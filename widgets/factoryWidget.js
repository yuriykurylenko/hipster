$.widget('ui.factoryWidget', $.ui.AbstractWidget, {
	_create: function() {
		if (!this.options.templateName) {
			throw new Error('factoryWidget: templateName parameter should be specified!');
		}

		$.ui.AbstractWidget.prototype._create.apply(this);
	},
});
