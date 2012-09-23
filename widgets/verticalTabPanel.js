$.widget('ui.verticalTabPanel', $.ui.AbstractWidget, {
	_create: function() {
		$.ui.AbstractWidget.prototype._create.apply(this);
	},

	markupReady: function() {
		this.element.find("#verticalTabs").verticalTabs().show();
	},
});
