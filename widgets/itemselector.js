$.widget('ui.itemselector', $.ui.AbstractWidget, {
	templateName: 'itemselector',

	//template: '<h1>Wheee!!!</h1>',

	_addItem: function(list, item) {
		var optionMarkup = '<option value="' + item.id + '">' + item.name + '</option>';
		list.append(optionMarkup);
	},

	_bindEvents: function() {
		var that = this;
		var removedItems = [];

		var firstList = this.element.find('.itemselector_firstList');
		var secondList = this.element.find('.itemselector_secondList');

		this.element.find('.itemselector_to2').bind('click', function() {
			if (firstList.val()) {
				$.each(firstList.val(), function(i, itemId) {
					firstList.find('option[value=' + itemId + ']')
					.appendTo(secondList);
				});
			}
			that.element.trigger('valuechange');
		});
		
		this.element.find('.itemselector_to1').bind('click', function() {
			if (secondList.val()) {
				$.each(secondList.val(), function(i, itemId) {
					secondList.find('option[value=' + itemId + ']')
					.appendTo(firstList);
				});
			}
			that.element.trigger('valuechange');
		});

		this.element.find('.itemselector_to2_all').bind('click', function() {
			$.each(firstList.find('option'), function(i, item) {
				$(item).appendTo(secondList);
			});
			that.element.trigger('valuechange');		
		});

		this.element.find('.itemselector_to1_all').bind('click', function() {
			$.each(secondList.find('option'), function(i, item) {
				$(item).appendTo(firstList);
			});
			that.element.trigger('valuechange');			
		});
		
		var filter = this.element.find('#filter');
		filter.bind('keyup', function() {
			that.element.find('.itemselector_firstList').append(removedItems);
			
			removedItems = that.element.find('.itemselector_firstList option').filter(function(index, elt) {
				return ( $(elt).text().toLowerCase().indexOf(filter.val().toLowerCase()) == -1 );
			}).remove();
		});		
	},

	_create: function() {
		$.ui.AbstractWidget.prototype._create.apply(this);
	},


	markupReady: function() {
		this._bindEvents();
	},

	dataReady: function(data) {
		var that = this;
		$.each(data.toJSON(), function(i, item) {
			that._addItem(that.element.find('.itemselector_firstList'), item);
		});
	},

	val: function() {
		var that = this;

		return $.map(this.element.find('.itemselector_secondList option'), function(item, i) {
			return that.getCollection().where({ 'id': $(item).attr('value') });
		});
	}
});
