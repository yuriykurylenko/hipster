App.Model.OS = Backbone.Model.extend();

App.Model.DeviceTargeting = Backbone.Model.extend({
	relations: [{
		type: Backbone.HasMany,
		key: 'OS',
		relatedModel: App.Model.OS,
		collectionType: App.Collection.OS
		/*reverseRelation: { key, includeInJSON }*/
	}]
});


ns('App.ViewModel');
App.ViewModel.DeviceTargetingPreview = Backbone.Model.extend({
	initialize: function(model) {
		this.model = model;
	},

	_common: function(container, value) {
		container.text( $.map(value, function(item, i) {
			return item.get('name');
		}).join(', ') );
	},

	OS: function(container) {
		container.html( $.map(this.model.get('OS'), function(item, i) {
			return (item.get('parentid') == '-1') ? ('<b>' + item.get('name') + '</b>') : item.get('name');
		}).join(', ') );
	},

	vendors: function(container, value) {
		this._common(container, value);
	},

	models: function(container, value) {
		this._common(container, value);
	}
});
