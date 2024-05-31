/**
 * ContentEditable Kroki diagram node.
 *
 * @class
 * @extends ve.ce.MWExtensionNode
 *
 * @constructor
 */
ve.ce.MWKrokiNode = function VeCeMWKrokiNode() {
	// Parent constructor
	ve.ce.MWLatexNode.super.apply(this, arguments);
};


/* Inheritance */

OO.inheritClass(ve.ce.MWKrokiNode, ve.ce.MWExtensionNode);


/* Static Properties */

ve.ce.MWKrokiNode.static.name = 'mwKroki';
ve.ce.MWKrokiNode.static.tagName = 'div';
ve.ce.MWKrokiNode.static.primaryCommandName = 'mwKrokiDialog';


/* Methods */

ve.ce.MWKrokiNode.static.getDescription = function (model) {
	//todo better description
	return ve.getProp(model.getAttribute('mw'), 'attrs', 'lang');
};


/* Registration */

ve.ce.nodeFactory.register(ve.ce.MWKrokiNode);
