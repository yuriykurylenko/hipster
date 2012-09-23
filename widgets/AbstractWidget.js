$.widget('ui.AbstractWidget', $.Widget, {
	PATH_TO_TEMPLATES: 'templates/',

	VISIBILITY_CHECK_CSS_PROPERTIES: 'left,top,width,height,display',
	VISIBILITY_CHECK_TIMEOUT: 100,

	
	_checkVisibility: function() {
		if (this.element.is(':visible')) {
			this.element.trigger('visible');
		}
	},

	_watchVisibility: function() {
		this._checkVisibility();
		this.element.watch( this.VISIBILITY_CHECK_CSS_PROPERTIES, $.proxy(this._checkVisibility, this), this.VISIBILITY_CHECK_TIMEOUT );
	},

	_createTemplatePath: function(templateName) {
		return this.PATH_TO_TEMPLATES + templateName.split('.').join('/') + '.html';
	},

	_createViewModelsForDataClients: function(dataClients) {
		var widget = this;
		this._viewModels = [];

		$.each(this._dataClients, function(i, dataClient) {
			var ViewModelType = ns( $(dataClient).attr('viewModel') );
			var dataClientName = $(dataClient).attr('name');
			if (ViewModelType) {
				widget._viewModels[dataClientName] = new ViewModelType(widget._model);
			}
		});
	},

	_setDataClientFieldValue: function(fieldElement, viewModel) {
		var modelFieldName = $(fieldElement).attr('name');
		var modelFieldValue = this._model.get(modelFieldName);

		if (!viewModel[modelFieldName]) {
			$(fieldElement).html(modelFieldValue);
		} else if (modelFieldValue) {
			viewModel[modelFieldName]($(fieldElement), modelFieldValue);
		}
	},

	_updateDataClientsOnModelChange: function() {
		var widget = this;
		$.each(this._dataClients, function(i, dataClient) { 
			$.each($(dataClient).find('[name]'), function(j, fieldElement) {
				widget._setDataClientFieldValue( fieldElement, widget.getViewModel($(dataClient).attr('name')) );
			});	
		});
	},

	// TODO: Do it less horrible!!!
	_bindDataClients: function() {
		var widget = this;

		this._dataClients = $('[dataBind=' + this.element.attr('wId') + ']');
		this._createViewModelsForDataClients();

		this._model.on('change', $.proxy(this._updateDataClientsOnModelChange, this));
	},

	_bindModel: function(ModelType) {
		var widget = this;

		this._model = new ModelType();

		$.each( this.element.find('[name]'), function(i, fieldElement) {
			var wType = $(fieldElement).attr('wtype');
			var name = $(fieldElement).attr('name');

			var onChangeAlias = wType ? 'valuechange' : 'keyup'; //'change';

			$(fieldElement).bind(onChangeAlias, function() {
				var fieldValue = wType ? $(fieldElement)[wType]('val') : $(fieldElement).val();
				widget._model.set(name, fieldValue);
			});
		} );

		this._bindDataClients();
	},

	_bindCollection: function(CollectionType) {
		this._collection = new CollectionType();

		this._collection.fetch({
			success: $.proxy(this.dataReady, this)
		});
	},

	_createDataBindings: function() {
		var modelTypeName = this.element.attr('model');
		if (modelTypeName) {
			this._bindModel( ns(modelTypeName) );
		}

		var collectionTypeName = this.element.attr('collection');
		if (collectionTypeName) {
			this._bindCollection( ns(collectionTypeName) );
		}
	},

	_parseChildren: function(el) {
		var widget = this;

                $.each(el.children(), function(i, wElement) {
			var wType = $(wElement).attr('wtype');
			if (wType) {
				$(wElement)[wType]();
			} else {
				widget._parseChildren( $(wElement) );
			}
		});
	},

	_render: function(input) {
		this.template = this.template || input;

		if (this.template) {
			this.element.html(this.template);
		}
		this.markupReady();

		this._parseChildren(this.element);
		this._createDataBindings();
	},

	_lazyRender: function(toLoadTemplate) {
		var action = toLoadTemplate ? this._loadTemplate : this._render;

		this.element.one( 'visible', $.proxy(action, this) );
		this._watchVisibility();
	},

	_loadTemplate: function() {
		$.get( this._createTemplatePath(this.templateName) , $.proxy(this._render, this) );
	},

	_create: function() {
		$.Widget.prototype._create.apply(this);

		// TODO: Refine!
		var lazy = this.element.attr('lazy');
		this.templateName = this.element.attr('template') || this.templateName;
		var toLoadTemplate = this.templateName ? true : false;

		if ( lazy && (lazy == 'true') ) {
			this._lazyRender(toLoadTemplate);
		} else if (toLoadTemplate) {
			this._loadTemplate();
		} else {
			this._render();
		}
	},

	// Hooks
	markupReady: function() { },
	dataReady: function(data) { },

	// Public
	getViewModel: function(name) {
		return (this._viewModels && this._viewModels[name]) ? this._viewModels[name] : null;
	},

	getModel: function() {
		return this._model ? this._model : null;
	},

	getCollection: function() {
		return this._collection ? this._collection : null;
	}
});
