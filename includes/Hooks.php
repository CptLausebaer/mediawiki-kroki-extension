<?php

/**
 * Class Hooks
 *
 * This class implements the ParserFirstCallInitHook and OutputPageParserOutputHook interfaces.
 * It defines two event handler methods, `onOutputPageParserOutput` and `onParserFirstCallInit`,
 * which are triggered when the corresponding events occur.
 */

namespace MediaWiki\Kroki;

use ExtensionRegistry;
use MediaWiki\EditPage\EditPage;
use MediaWiki\Hook\OutputPageParserOutputHook;
use MediaWiki\Hook\ParserFirstCallInitHook;
use OutputPage;
use Parser;
use ParserOutput;

/**
 * Class Hooks
 *
 * This class implements the ParserFirstCallInitHook and OutputPageParserOutputHook interfaces.
 * It defines two event handler methods, `onOutputPageParserOutput` and `onParserFirstCallInit`,
 * which are triggered when the corresponding events occur.
 */
class Hooks implements ParserFirstCallInitHook, OutputPageParserOutputHook {

	/**
	 * Finalizes the parser output by calling the "finalizeParserOutput" method
	 * of the "ParserKrokiTag" class.
	 *
	 * @param OutputPage $outputPage The OutputPage object.
	 * @param ParserOutput $parserOutput The ParserOutput object.
	 * @return void
	 */
	public function onOutputPageParserOutput( $outputPage, $parserOutput ): void {
		ParserKrokiTag::finalizeParserOutput( $outputPage, $parserOutput );
	}

	/**
	 * Sets up the required hooks for initializing the parser on the first call.
	 *
	 * @param Parser $parser The parser object.
	 *
	 * @return void
	 */
	public function onParserFirstCallInit( $parser ): void {
		$parser->setHook( 'kroki', [ ParserKrokiTag::class, 'onKrokiTag' ] );
	}

	/**
	 * Hook: EditPage::showEditForm:initial
	 *
	 * Add the module for WikiEditor
	 *
	 * @param EditPage $editPage the current EditPage object.
	 * @param OutputPage $outputPage object.
	 */
	public function onEditPage__showEditForm_initial( $editPage, $outputPage ) {
		if ( $editPage->contentModel !== CONTENT_MODEL_WIKITEXT ) {
			return;
		}

		$wikiEditorEnabled = ExtensionRegistry::getInstance()->isLoaded( 'WikiEditor' );

		if ( $wikiEditorEnabled ) {
			$outputPage->addModules( 'ext.kroki.wikiEditor' );
		}
	}
}
