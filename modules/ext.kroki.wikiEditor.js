// noinspection JSVoidFunctionReturnValueUsed

'use strict';

/**
 * Add Kroki-specific functionality to the WikiEditor toolbar.
 * Adds a button to insert <kroki> tags, and adds a help section
 * about how to use references to WikiEditor's help panel.
 *
 */
$( function () {
	/**
	 * @param {jQuery} $textarea
	 */
	function KrokiDialogManager( $textarea ) {
		KrokiDialogManager.super.call( this, {} );
		this.$textarea = $textarea;
	}

	OO.inheritClass( KrokiDialogManager, OO.ui.ProcessDialog );

	KrokiDialogManager.static.name = 'extKrokiDialogManager';

	KrokiDialogManager.static.size = 'full';

	KrokiDialogManager.static.title = OO.ui.deferMsg( 'kroki-wikieditor-dialog-title' );

	KrokiDialogManager.static.cssClass = 'your_css_class';

	KrokiDialogManager.static.supportedLanguages = [
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

	KrokiDialogManager.static.actions = [
		{
			flags: [ 'primary', 'progressiv' ],
			label: OO.ui.deferMsg( 'kroki-wikieditor-dialog-insert' ),
			action: 'insert',
			modes: [ 'choose', 'insert' ]
		},
		{
			title: OO.ui.deferMsg( 'kroki-wikieditor-dialog-close' ),
			flags: [ 'safe', 'close' ],
			action: 'closeDialog',
			modes: [ 'choose', 'insert' ]
		}
	];

	/**
	 * Check if a language is supported
	 *
	 * @param {string} language Language name
	 * @return {boolean} The language is supported
	 */
	KrokiDialogManager.static.isLanguageSupported = function ( language ) {
		return KrokiDialogManager.static.supportedLanguages.indexOf( language || undefined ) !== -1;
	};

	/**
	 * Set the height to a reasonable maximum.
	 *
	 * @return {number} Body height
	 */
	KrokiDialogManager.prototype.getBodyHeight = function () {
		return 600;
	};

	KrokiDialogManager.prototype.initialize = function () {
		KrokiDialogManager.super.prototype.initialize.apply( this, arguments );
		this.content = new OO.ui.PanelLayout( { padded: true, expanded: false } );

		this.diagramContainer = new OO.ui.PanelLayout( {
			classes: [ 'wikieditor-kroki-side-by-side-container' ]
		} );

		this.input = new ve.ui.MWAceEditorWidget( {
			rows: 20,
			autosize: true,
			maxRows: 50,
			classes: [ 'kroki-wikieditor-input' ]
		} );

		this.codeField = new OO.ui.FieldLayout( this.input, {
			align: 'top',
			label: mw.msg( 'kroki-wikieditor-code-label' )
		} );

		this.diagram = new OO.ui.FieldsetLayout( {
			id: 'diagram-result'
		} );

		this.languageValid = null;

		const noneMsg = ve.msg( 'kroki-wikieditor-mwkrokiinspector-none' );

		this.language = new OO.ui.ComboBoxInputWidget( {
			$overlay: this.$overlay,
			menu: {
				filterFromInput: true,
				items: KrokiDialogManager.static.supportedLanguages.slice().map( function ( lang ) {
					return new OO.ui.MenuOptionWidget( { data: lang, label: lang || noneMsg } );
				} )
			},
			validate: function ( input ) {
				return KrokiDialogManager.static.isLanguageSupported( input );
			}
		} );

		// Events
		this.input.connect( this, { change: 'onCodeInputChange' } );
		this.language.connect( this, { change: 'onCodeInputChange' } );
		this.language.connect( this, { change: 'onLanguageInputChange' } );

		this.languageField = new OO.ui.FieldLayout( this.language, {
			classes: [ 'wikieditor-kroki-languageField' ],
			align: 'top',
			label: mw.msg( 'kroki-wikieditor-language-label' )
		} );

		this.diagramContainer.$element.append(
			this.codeField.$element,
			this.diagram.$element
		);

		this.content.$element.append(
			this.languageField.$element,
			this.diagramContainer.$element
		);

		this.$body.append( this.content.$element );
	};

	KrokiDialogManager.prototype.onLanguageInputChange = function () {
		const dialog = this;

		const validity = this.language.getValidity();

		validity.always( function () {
			dialog.languageValid = validity.state() === 'resolved';
			dialog.updateActions();
		} );
	};

	KrokiDialogManager.prototype.updateActions = function () {
		this.getActions().setAbilities( { insert: this.languageValid } );
	};

	KrokiDialogManager.prototype.getSetupProcess = function ( data ) {
		// Parent process
		const process = KrokiDialogManager.super.prototype.getSetupProcess.call( this, data );
		// Mixin process
		return process
			.next( function () {
				this.$element.addClass( 'wikieditor-kroki-dialog' );
			}, this )
			.next( function () {
				this.onLanguageInputChange();

			}, this );
	};

	KrokiDialogManager.prototype.getTeardownProcess = function ( data ) {
		// Start parent teardown process
		const process = KrokiDialogManager.super.prototype.getTeardownProcess.call( this, data );
		// Mixin process
		return process
			.first( function () {
				// Reset the values on closing the dialog
				this.language.setValue( '' );
				this.input.setValue( '' );
			}, this );
	};

	KrokiDialogManager.prototype.getOutputFormat = function () {
		const dialog = this;

		const $outputElement = $( '<kroki>' )
			.attr( 'id', 'custom-id' )
			.attr( 'lang', dialog.language )
			.text( dialog.input );

		return $outputElement.toString();
	};

	KrokiDialogManager.prototype.getActionProcess = function ( action ) {
		const dialog = this;
		return KrokiDialogManager.super.prototype.getActionProcess.call( this, action )
			.next( function () {
				if ( action === 'closeDialog' ) {
					dialog.close();
				}
			} )

			.next( function () {
				if ( action === 'insert' ) {
					const textSelectionOpts = {
						pre: '<kroki lang="' + dialog.language.value + '">',
						peri: '\n' + dialog.input.value + '\n',
						post: '</kroki>',
						replace: true,
						selectPeri: false
					};
					dialog.ignoreParamValues = false;
					dialog.close().closed.then( function () {
						// Delay this until the dialog has closed, because modal dialogs make
						// the rest of the page unfocusable, and textSelection needs to focus
						// the field to do its job (T33780#8106393).
						// eslint-disable-next-line no-jquery/no-global-selector
						$( '#wpTextbox1' ).textSelection( 'encapsulateSelection', textSelectionOpts );
					} );
				}
			} );
	};

	function debounce( func, wait, immediate ) {
		let timeout;
		return function () {
			const context = this, args = arguments;
			const later = function () {
				timeout = null;
				if ( !immediate ) {
					func.apply( context, args );
				}
			};
			const callNow = immediate && !timeout;
			clearTimeout( timeout );
			timeout = setTimeout( later, wait );
			if ( callNow ) {
				func.apply( context, args );
			}
		};
	}

	function textEncode( str ) {
		if ( window.TextEncoder ) {
			return new TextEncoder( 'utf-8' ).encode( str );
		}
		const utf8 = unescape( encodeURIComponent( str ) );
		const result = new Uint8Array( utf8.length );
		for ( let i = 0; i < utf8.length; i++ ) {
			result[ i ] = utf8.charCodeAt( i );
		}
		return result;
	}

	KrokiDialogManager.prototype.onCodeInputChange = debounce( function () {
		const dialog = this;

		const diagramType = dialog.language.getValue();
		const source = dialog.input.getValue();

		if ( diagramType && source && source.trim() !== '' ) {
			const urlPath = diagramType + '/svg/' + base64js
				.fromByteArray( pako.deflate( textEncode( source ), { level: 9 } ) )
				.replace( /\+/g, '-' )
				.replace( /\//g, '_' );

			const url = mw.config.get("wgKrokiServerEndpoint").trimEnd('/') +'/' + urlPath;
			const req = new XMLHttpRequest();
			req.onreadystatechange = function () {
				if ( this.readyState === XMLHttpRequest.DONE ) {
					if ( this.status === 200 && this.responseText !== '' ) {
						const diagramTypeClass = 'diagram-' + diagramType;
						dialog.diagram.$element.html( this.responseText );
						dialog.diagram.$element.attr( 'class', '' );
						// eslint-disable-next-line mediawiki/class-doc
						dialog.diagram.$element.addClass( diagramTypeClass );
					} else {
						if ( this.responseText === '' ) {
							dialog.diagram.$element.empty().append(
								$( '<pre>' ).addClass( 'kroki-diagram-error' )
									.text( 'Error' )
							);
						} else {
							dialog.diagram.$element.empty().append(
								$( '<pre>' ).addClass( 'kroki-diagram-error' )
									.text( this.responseText )
							);
						}

						dialog.diagram.$element.attr( 'class', '' );
					}
				}
			};
			req.open( 'GET', url, true );
			req.send( null );
		} else {
			// Handle empty input case
			dialog.diagram.$element.html( '' );
			dialog.diagram.$element.attr( 'class', '' );
		}
	}, 250, true );

	mw.hook( 'wikiEditor.toolbarReady' ).add( function ( $textarea ) {
		const dialog = new KrokiDialogManager( $textarea );
		OO.ui.getWindowManager().addWindows( [ dialog ] );

		/* Add the <kroki></kroki> button to the toolbar */
		$textarea.wikiEditor( 'addToToolbar', {
			section: 'main',
			group: 'insert',
			tools: {
				reference: {
					label: mw.msg( 'kroki-wikieditor-tool-label' ),
					filters: [ 'body.ns-subject' ],
					type: 'button',
					oouiIcon: 'puzzle',
					action: {
						type: 'callback',
						execute: () => {
							OO.ui.getWindowManager().openWindow( dialog );
						}
					}
				}
			}
		} );

	} );
}() );
