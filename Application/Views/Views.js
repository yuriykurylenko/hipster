App.View.DeviceTargetingPanel = Backbone.View.extend({
	render: function() {
		var formTag = '<form id="deviceTargetingForm" wId="deviceTargetingForm" wtype="form" template="DeviceTargeting" model="App.Model.DeviceTargeting">';
		$(this.el).append(formTag).form();
		return this;
	}
});
