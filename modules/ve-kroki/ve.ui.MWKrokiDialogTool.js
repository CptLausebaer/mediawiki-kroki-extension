/**
 * MediaWiki UserInterface Kroki diagram tool.
 *
 * @class
 * @extends ve.ui.FragmentWindowTool
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */
ve.ui.MWKrokiDialogTool = function VeUiMWKrokiDialogTool() {
	ve.ui.MWKrokiDialogTool.super.apply(this, arguments);
};

/* Inheritance */

OO.inheritClass(ve.ui.MWKrokiDialogTool, ve.ui.FragmentWindowTool);

/* Static properties */

ve.ui.MWKrokiDialogTool.static.name = 'mwKrokiDialog';
ve.ui.MWKrokiDialogTool.static.group = 'object';
ve.ui.MWKrokiDialogTool.static.icon = 'puzzle';
ve.ui.MWKrokiDialogTool.static.title = OO.ui.deferMsg(
	'kroki-visualeditor-mwkrokiinspector-title');
ve.ui.MWKrokiDialogTool.static.modelClasses = [ve.dm.MWKrokiNode];
ve.ui.MWKrokiDialogTool.static.commandName = 'mwKrokiDialog';

/* Registration */

ve.ui.toolFactory.register(ve.ui.MWKrokiDialogTool);

/* Commands */

ve.ui.commandRegistry.register(
	new ve.ui.Command(
		'mwKrokiDialog', 'window', 'open',
		{args: ['mwKrokiDialog'], supportedSelections: ['linear']}
	)
);
