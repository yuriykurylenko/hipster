$.widget('ui.checkboxTree', $.ui.AbstractWidget, {
	_create: function() {
		$.ui.AbstractWidget.prototype._create.apply(this);
	},

	_getDataSourceForJqxTree: function(data) {
		var source = {
			datatype: 'json',
			datafields: [
				{ name: 'id' },
				{ name: 'parentid' },
				{ name: 'name' }
			],
			id: 'id',
			localdata: data.toJSON()
		};

		var dataAdapter = new $.jqx.dataAdapter(source);
		dataAdapter.dataBind();

		return dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{ 
			name: 'name',
			map: 'label'
		}]);
	},

	dataReady: function(data) {
		var that = this;

		this.element.jqxTree({ 
			source: this._getDataSourceForJqxTree(data), 
			hasThreeStates: true, 
			checkboxes: true,
			height: '480px',
			width: '500px'
		}).bind('change', function (event) { 
			that.checked = $.map($(this).jqxTree('getItems'), function(item, i) {
				if (item.checked) {
					return item.id;
				}
			});

			that.element.trigger('valuechange');
		});
	},

	val: function() {
		var that = this;

		return this.getCollection().filter( function(OS) {
		    return (that.checked.indexOf(OS.get('id')) != -1);
		} );
	}
});
