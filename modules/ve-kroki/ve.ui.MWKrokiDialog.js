/**
 * MediaWiki Kroki diagram dialog.
 *
 * @class
 * @extends ve.ui.MWExtensionDialog
 * @mixins ve.ui.MWKrokiWindow
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
ve.ui.MWKrokiDialog = function VeUiMWKrokiDialog() {
	// Parent constructor
	ve.ui.MWKrokiDialog.super.apply(this, arguments);
};

/* Inheritance */

OO.inheritClass(ve.ui.MWKrokiDialog, ve.ui.MWExtensionDialog);

/* Static properties */

ve.ui.MWKrokiDialog.static.name = 'mwKrokiDialog';

ve.ui.MWKrokiDialog.static.size = 'larger';

ve.ui.MWKrokiDialog.static.modelClasses = [ve.dm.MWKrokiNode];

/* Methods */

/**
 * @inheritdoc
 */
ve.ui.MWKrokiDialog.prototype.initialize = function () {
	// Parent method
	ve.ui.MWKrokiDialog.super.prototype.initialize.call(this);

	this.input = new ve.ui.MWAceEditorWidget({
		limit: 1,
		rows: 14,
		maxRows: 25,
		autosize: true,
		autocomplete: 'live',
		classes: ['ve-ui-mwExtensionWindow-input']
	});

	this.input.connect(this, {resize: 'updateSize'});

	// todo -- refactor
	var noneMsg = ve.msg('kroki-visualeditor-mwkrokiinspector-none');

	this.languageValid = null;

	this.language = new OO.ui.ComboBoxInputWidget({
		$overlay: this.$overlay,
		menu: {
			filterFromInput: true,
			items: ve.dm.MWKrokiNode.static.getLanguages().map(function (lang) {
				return new OO.ui.MenuOptionWidget({data: lang, label: lang || noneMsg});
			})
		},
		validate: function (input) {
			return ve.dm.MWKrokiNode.static.isLanguageSupported(input);
		}
	});

	// Events
	this.language.connect(this, {change: 'onLanguageInputChange'});

	this.languageField = new OO.ui.FieldLayout(this.language, {
		classes: ['ve-ui-mwKrokiWindow-languageField'],
		align: 'top',
		label: ve.msg('kroki-visualeditor-mwkrokiinspector-language')
	});
	this.codeField = new OO.ui.FieldLayout(this.input, {
		align: 'top',
		label: ve.msg('kroki-visualeditor-mwkrokiinspector-code')
	});

	// todo -- refactor

	this.languageField.setAlignment('left');

	this.contentLayout = new OO.ui.PanelLayout({
		scrollable: true,
		padded: true,
		expanded: false,
		content: [
			this.languageField,
			this.codeField
		]
	});

	// Initialization
	this.$content.addClass('ve-ui-mwKrokiDialog-content');
	this.$body.append(this.contentLayout.$element);
};

/**
 * @inheritdoc MWKrokiWindow
 */
ve.ui.MWKrokiDialog.prototype.onLanguageInputChange = function () {
	var dialog = this;

	var validity = this.language.getValidity();
	validity.always(function () {
		var language = dialog.language.getValue();
		dialog.input.setLanguage(validity.state() === 'resolved' ? language : 'text');
		dialog.languageValid = validity.state() === 'resolved';
		dialog.updateActions();
	});
};

/**
 * @inheritdoc
 */
ve.ui.MWKrokiDialog.prototype.getReadyProcess = function (data) {
	// Parent process
	var process = ve.ui.MWKrokiDialog.super.prototype.getReadyProcess.call(this, data);

	return process.next(function () {
		this.language.getMenu().toggle(false);
		if (!this.language.getValue()) {
			this.language.focus();
		} else {
			this.input.focus();
		}
	}, this);
};

/**
 * @inheritdoc
 */
ve.ui.MWKrokiDialog.prototype.getSetupProcess = function (data) {
	// Parent process
	var process = ve.ui.MWKrokiDialog.super.prototype.getSetupProcess.call(this, data);
	// Mixin process
	return process.next(function () {
		var attrs = this.selectedNode ? this.selectedNode.getAttribute('mw').attrs : {},
			language = attrs.lang ? attrs.lang.toLowerCase() : '',
			isReadOnly = this.isReadOnly();

		this.language.setValue(language).setReadOnly(isReadOnly);

	}, this);
};

/**
 * @inheritdoc
 */
ve.ui.MWKrokiDialog.prototype.getTeardownProcess = function (data) {
	// Parent process
	var process = ve.ui.MWKrokiDialog.super.prototype.getTeardownProcess.call(this, data);
	// Mixin process
	return process;
};

/**
 * @inheritdoc ve.ui.MWExtensionWindow
 */
ve.ui.MWKrokiDialog.prototype.updateActions = function () {
	this.getActions().setAbilities({done: this.languageValid && this.isModified()});
};

/**
 * @inheritdoc
 */
ve.ui.MWKrokiDialog.prototype.updateMwData = function (mwData) {
	// Parent method
	ve.ui.MWKrokiDialog.super.prototype.updateMwData.apply(this, arguments);
	// Mixin method
	var language = this.language.getValue();

	mwData.attrs.lang = language || undefined;
};

/* Registration */

ve.ui.windowFactory.register(ve.ui.MWKrokiDialog);
