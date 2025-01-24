<?php

/**
 * Class KrokiHooks
 *
 * This class implements the ParserFirstCallInitHook and OutputPageParserOutputHook interfaces.
 * It defines two event handler methods, `onOutputPageParserOutput` and `onParserFirstCallInit`,
 * which are triggered when the corresponding events occur.
 */

namespace MediaWiki\Kroki;

use ExtensionRegistry;
use MediaWiki\Config\Config;
use MediaWiki\EditPage\EditPage;
use MediaWiki\Hook\OutputPageParserOutputHook;
use MediaWiki\Hook\ParserFirstCallInitHook;
use MediaWiki\ResourceLoader\Hook\ResourceLoaderGetConfigVarsHook;
use OutputPage;
use Parser;
use ParserOutput;

/**
 * Class KrokiHooks
 *
 * This class implements the ParserFirstCallInitHook and OutputPageParserOutputHook interfaces.
 * It defines two event handler methods, `onOutputPageParserOutput` and `onParserFirstCallInit`,
 * which are triggered when the corresponding events occur.
 */
class KrokiHooks implements ParserFirstCallInitHook, OutputPageParserOutputHook, ResourceLoaderGetConfigVarsHook {

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

	/**
	 * Hook to add Version to Special:Version
	 *
	 * @see https://www.mediawiki.org/wiki/Manual:Hooks/SoftwareInfo
	 * @param array &$software
	 */
	public function onSoftwareInfo( &$software ) {
	}

	/**
	 * Hook to modify ResourceLoader config vars
	 *
	 * @param array &$vars The reference to the config vars array to be modified.
	 * @param string $skin The skin being used for the ResourceLoader.
	 * @param Config $config An instance of the Config class containing configuration values.
	 * @return void
	 */
	public function onResourceLoaderGetConfigVars( array &$vars, $skin, Config $config ): void {
		$vars['wgKrokiServerEndpoint'] = $config->get( 'KrokiServerEndpoint' );
	}
}
