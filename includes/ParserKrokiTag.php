<?php

namespace MediaWiki\Kroki;

use LocalRepo;
use MediaWiki\Html\Html;
use MediaWiki\MediaWikiServices;
use MediaWiki\Page\PageReference;
use OutputPage;
use Parser;
use ParserOptions;
use ParserOutput;
use PPFrame;
use Status;

/**
 * Class ParserKrokiTag
 *
 * This class represents a parser tag for handling Kroki tags.
 */
class ParserKrokiTag {
	/**
	 * The CSS class used for styling Kroki diagrams in the application.
	 *
	 * @var string KROKI_CSS_CLASS
	 */
	private const KROKI_CSS_CLASS = 'mw-kroki';
	private \ParserOptions $parserOptions;
	private \ParserOutput $parserOutput;
	private \Language $language;

	/** @var string[] Diagram types */
	public const DIAGRAM_TYPES = [
		'blockdiag',
		'bpmn',
		'bytefield',
		'seqdiag',
		'actdiag',
		'nwdiag',
		'packetdiag',
		'rackdiag',
		'c4plantuml',
		'd2',
		'dbml',
		'ditaa',
		'erd',
		'excalidraw',
		'graphviz',
		'mermaid',
		'nomnoml',
		'pikchr',
		'plantuml',
		'structurizr',
		'svgbob',
		'symbolator',
		'tikz',
		'vega',
		'vegalite',
		'wavedrom',
		'wireviz'
	];

	/**
	 * Constructor method for MyClass.
	 *
	 * @param Parser $parser The parser object.
	 * @param ParserOptions $parserOptions The parser options object.
	 * @param ParserOutput $parserOutput The parser output object.
	 * @return void
	 */
	public function __construct( Parser $parser, \ParserOptions $parserOptions, \ParserOutput $parserOutput ) {
		$this->parserOptions = $parserOptions;
		$this->parserOutput = $parserOutput;
		$this->language = $parser->getTargetLanguage();
	}

	/**
	 * Check if $string is one of the available diagram types.
	 *
	 * @param string $string
	 * @return bool
	 */
	private static function validDiagrammType( string $string ): bool {
		return in_array( strtolower( $string ), array_map( 'strtolower', self::DIAGRAM_TYPES ), true );
	}

	/**
	 * - Add tracking categories
	 * - Split parser cache for preview, where Graph uses different HTML
	 * @param ParserOutput $parserOutput
	 * @param ?PageReference $pageRef
	 * @param bool $isPreview
	 */
	public static function addTagMetadata(
		ParserOutput $parserOutput, ?PageReference $pageRef, bool $isPreview
	): void {
		$tc = MediaWikiServices::getInstance()->getTrackingCategories();
		if ( $parserOutput->getExtensionData( 'kroki_diagram_broken' ) ) {
			$tc->addTrackingCategory( $parserOutput, 'kroki-diagram-broken-category', $pageRef );
		}
		$tc->addTrackingCategory( $parserOutput, 'kroki-diagram-tracking-category', $pageRef );

		if ( $isPreview ) {
			$parserOutput->updateCacheExpiry( 0 );
		}
	}

	/**
	 * Handles the onKrokiTag hook.
	 *
	 * @param string|null $input The input string for the tag.
	 * @param array $args An array of arguments passed to the tag.
	 * @param Parser $parser The Parser object for the current page.
	 * @param PPFrame $frame The PPFrame object for the current page.
	 * @return Status|string The generated HTML or a Status object if there was an error.
	 */
	public static function onKrokiTag( $input, $args, $parser, $frame ): Status|string {
		$tag = new self( $parser, $parser->getOptions(), $parser->getOutput() );

		$input = $parser->getStripState()->unstripNoWiki( $input ?? '' );

		$html = $tag->buildHtmlInline( (string)$input, $args );
		self::addTagMetadata( $parser->getOutput(), $parser->getPage(), $parser->getOptions()->getIsPreview() );
		return $html;
	}

	/**
	 * Returns the kroki.io server url
	 *
	 * @return string
	 */
	private static function getKrokiUrl(): string {
		return MediaWikiServices::getInstance()->getMainConfig()->get( 'krokiServerEndpoint' );
	}

	/**
	 * Formats the HTML for displaying an error message.
	 *
	 * @param \Message $wfMessage The error message to be displayed.
	 * @param string $data_string The data string associated with the error (optional).
	 * @param string $response_string The response string associated with the error (optional).
	 * @return string The formatted HTML code for the error message.
	 */
	private function formatError( \Message $wfMessage, string $data_string = '', string $response_string = '' ): string {
		$this->parserOutput->setExtensionData( 'kroki_diagram_broken', true );
		$error = $wfMessage->inLanguage( $this->language )->parse();

		if ( !empty( $response_string ) ) {
			$contents = ( '<strong>HTTP-Response:</strong> ' . PHP_EOL .
					$response_string . PHP_EOL . PHP_EOL )
				. '<strong>Diagram-Code:</strong>' . $data_string;
		} else {
			$contents = '<strong>Diagram-Code:</strong>' . $data_string;
		}

		return Html::rawElement(
			'div',
			[ 'class' => self::KROKI_CSS_CLASS ],
			Html::rawElement(
				'pre',
				[
					'data-title' => $error,
				],
				$contents
			)
		);
	}

	/**
	 * Generates the HTML for the 'buildHtml_inline' method.
	 *
	 * @param string $input The input string for the tag.
	 * @param null $args An array of arguments passed to the tag.
	 * @return string The generated HTML or a Status object if there was an error.
	 */
	public function buildHtmlInline( string $input, $args = null ): string {
		if ( $input === '' ) {
			return $this->formatError( wfMessage( 'kroki-error-empty-input' ) );
		}

		$lang = $args['lang'] ?? '';

		// For invalid diagram type, output nothing instead of broken img.
		if ( !self::validDiagrammType( $lang ) ) {
			return $this->formatError( wfMessage( 'kroki-error-unknown-language' ) );
		}

		// set post fields
		$requestParams = [
			'method' => 'POST',
			'postData' => json_encode( [
				'diagram_source' => $input,
				'diagram_type' => $lang,
				'output_format' => 'svg',
				'diagram_options' => [
					'no-doctype' => 'TRUE'
				] ] ),
		];

		$url = self::getKrokiUrl();

		// Create HttpRequest
		$request = MediaWikiServices::getInstance()->getHttpRequestFactory()->create( $url, $requestParams, __METHOD__ );

		// Send the request
		$status = $request->execute();

		if ( !$status->isOK() ) {
			return $this->formatError( wfMessage( 'kroki-error-diagram-render-failed' ), $input, $request->getContent() );
		}

		if ( $request->getContent() === '' ) {
			return $this->formatError( wfMessage( 'kroki-error-diagram-render-failed' ), $input );
		}

		return self::formatHtml( "data:image/svg+xml;base64," . base64_encode( $request->getContent() ) );
	}

	/**
	 * Builds the HTML for a local file diagram.
	 *
	 * @param string $input The input string for the diagram.
	 * @param null $args An array of additional arguments passed to the diagram.
	 * @return Status|string The generated HTML or a Status object if there was an error.
	 * @throws \MWException
	 */
	public function buildHtmlLocalfile( string $input, $args = null ): Status|string {
		if ( $input === '' ) {
			return $this->formatError( wfMessage( 'kroki-error-empty-input' ) );
		}

		$lang = $args['lang'] ?? '';

		// For invalid diagram type, output nothing instead of broken img.
		if ( !self::validDiagrammType( $lang ) ) {
			return $this->formatError( wfMessage( 'kroki-error-unknown-language' ) );
		}

		// set post fields
		$requestParams = [
			'method' => 'POST',
			'postData' => json_encode( [
				'diagram_source' => $input,
				'diagram_type' => $lang,
				'output_format' => 'svg',
				'diagram_options' => [
					'no-doctype' => 'TRUE'
				] ], JSON_FORCE_OBJECT ),
		];

		$url = self::getKrokiUrl();

		// Create HttpRequest
		$request = MediaWikiServices::getInstance()->getHttpRequestFactory()->create( $url, $requestParams, __METHOD__ );

		// Send the request
		$status = $request->execute();

		if ( !$status->isOK() ) {
			return $this->formatError( wfMessage( 'kroki-error-diagram-render-failed' ), $input, $request->getContent() );
		}

		if ( $request->getContent() === '' ) {
			return $this->formatError( wfMessage( 'kroki-error-diagram-render-failed' ), $input );
		}

		$result = $request->getContent();

		$localRepo = MediaWikiServices::getInstance()->getRepoGroup()->getLocalRepo();
		$diagramsRepo = new LocalRepo( [
			'class' => 'LocalRepo',
			'name' => 'local',
			'backend' => $localRepo->getBackend(),
			'directory' => $localRepo->getZonePath( 'public' ) . '/kroki_diagrams',
			'url' => $localRepo->getZoneUrl( 'public' ) . '/kroki_diagrams',
			'hashLevels' => 0,
			'thumbUrl' => '',
			'transformVia404' => false,
			'deletedDir' => '',
			'deletedHashLevels' => 0,
			'zones' => [
				'public' => [
					'directory' => '/kroki_diagrams',
				],
			],
		] );

		$sha1Input = sha1( $input );
		$fileName = implode( '_', [ 'Kroki', $lang, $sha1Input ] ) . '.svg';
		$graphFile = $diagramsRepo->findFile( $fileName );

		if ( !$graphFile ) {
			$graphFile = $diagramsRepo->newFile( $fileName );
		}

		if ( $graphFile->exists() ) {
			return self::formatHtml( $graphFile->getUrl() );
		}

		$tmpFactory = MediaWikiServices::getInstance()->getTempFSFileFactory();
		$tmpGraphSourceFile = $tmpFactory->newTempFSFile( 'diagrams_out', $sha1Input );
		file_put_contents( $tmpGraphSourceFile->getPath(), $result );

		if ( $this->parserOptions->getIsPreview() ) {
			$check = $diagramsRepo->storeTemp( $fileName, $tmpGraphSourceFile );
		} else {
			$check = $graphFile->publish( $tmpGraphSourceFile );
		}

		if ( !$check->isGood() ) {
			$status->value = $this->formatError( $check->getHtml() );
			return $status;
		}

		return self::formatHtml( $graphFile->getUrl() );
	}

	/**
	 * Formats the HTML for displaying an image.
	 *
	 * @param string $imgUrl The URL of the image.
	 * @return string The formatted HTML code.
	 */
	private static function formatHtml( string $imgUrl ): string {
		return Html::rawElement(
			'div',
			[ 'class' => self::KROKI_CSS_CLASS ],
			Html::element( 'img', [ 'src' => $imgUrl ] )
		);
	}

	/**
	 * Finalizes the parser output for the Kroki extension.
	 *
	 * @param OutputPage $outputPage The OutputPage object representing the rendered page.
	 * @param ParserOutput $parserOutput The ParserOutput object for the current page.
	 * @return void
	 */
	public static function finalizeParserOutput(
		OutputPage $outputPage, ParserOutput $parserOutput
	): void {
		$outputPage->addModuleStyles( [ 'ext.kroki.styles' ] );
	}
}
