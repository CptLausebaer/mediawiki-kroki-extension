/**
 * DataModel Kroki diagram node.
 *
 * @class
 * @extends ve.dm.MWExtensionNode
 *
 * @constructor
 * @param {Object} [element] Reference to element in linear model
 */
ve.dm.MWKrokiNode = function VeDmMWKrokiNode() {
	// Parent method
	ve.dm.MWKrokiNode.super.apply( this, arguments );

};

/* Inheritance */
OO.inheritClass( ve.dm.MWKrokiNode, ve.dm.MWExtensionNode );

/* Static members */

ve.dm.MWKrokiNode.static.name = 'mwKroki';

ve.dm.MWKrokiNode.static.extensionName = 'kroki';

ve.dm.MWKrokiNode.static.tagName = 'div';

ve.dm.MWKrokiNode.static.matchRdfaTypes = [ 'mw:Extension/kroki' ];

ve.dm.MWKrokiNode.static.supportedLanguages = [
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

/* Static methods */

// /**
//  * @inheritdoc
//  */
ve.dm.MWKrokiNode.static.toDataElement = function ( domElements, converter ) {

	return ve.dm.MWExtensionNode.static.toDataElement.call( this, domElements, converter );
};

/**
 * Check if a language is supported
 *
 * @param {string} language Language name
 * @return {boolean} The language is supported
 */
ve.dm.MWKrokiNode.static.isLanguageSupported = function ( language ) {
	return ve.dm.MWKrokiNode.static.supportedLanguages.indexOf( language || undefined ) !== -1;
};

/**
 * Get an array of all languages
 *
 * @return {Array} All currently supported languages
 */
ve.dm.MWKrokiNode.static.getLanguages = function () {
	return ve.dm.MWKrokiNode.static.supportedLanguages.slice();
};

/* Methods */

/**
 * Check if the node's current language is supported
 *
 * @return {boolean} The language is supported
 */
ve.dm.MWKrokiNode.prototype.isLanguageSupported = function () {
	return this.constructor.static.isLanguageSupported( this.getLanguage() );
};

ve.dm.MWKrokiNode.prototype.getLanguage = function () {
	return this.getAttribute( 'mw' ).attrs.lang.toLowerCase();
};

/* Registration */
ve.dm.modelRegistry.register( ve.dm.MWKrokiNode );
