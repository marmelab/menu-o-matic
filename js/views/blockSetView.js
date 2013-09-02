define(function(require) {
  "use strict";

  var $           = require('jquery');
  var _           = require('underscore');
  var Backbone    = require('backbone');
  var Packery     = require('packery/js/packery');
  var Draggabilly = require('draggabilly');
  var BlockView    = require('views/blockView');

  var BlockSetView = Backbone.View.extend({
    el: ".blockset",
    events: {
      'click #add_block': 'createBlock'
    },
    initialize: function(options) {
      this.menu = options.menu;
      // render
      this.addAll();
      // bind collection events
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'remove', this.removeOne);
      this.listenTo(this.collection, 'change', this.updateLayout);
      this.listenTo(this.collection, 'reset', this.addAll);
      // initialize Packery
      var pckry = new Packery(this.$('.blocks').get(0), {
        gutter: 5,
        columnWidth: 250,
        "itemSelector": ".block"
      });
      // make items draggable
      pckry.getItemElements().forEach(function(elem) {
        pckry.bindDraggabillyEvents(new Draggabilly(elem));
      });
      pckry.on('layoutComplete', this.orderItems.bind(this));
      pckry.on('dragItemPositioned', this.updateLayout.bind(this));
      this.pckry = pckry;
    },
    addOne: function(block) {
      var view = new BlockView({ model: block });
      this._views.push(view);
      var elem = view.render().el;
      this.$('ul').append(elem);
      this.pckry.appended(elem);
      this.updateLayout();
      this.pckry.bindDraggabillyEvents(new Draggabilly(elem));
      block.select();
    },
    removeOne: function(block) {
      var viewToRemove = this.findViewForModel(block);
      this._views = _(this._views).without(viewToRemove);
      this.pckry.remove(viewToRemove.el);
      this.updateLayout();
    },
    updateLayout: function() {
      this.pckry.layout();
    },
    addAll: function() {
      this._views = [];
      var self = this;
      var blocks = this.collection.filterForMenu(this.menu);
      // blocks is a simple array, not a collection
      blocks = _.sortBy(blocks, 'order');
      _.each(blocks, function(block) {
        var view = new BlockView({ model: block });
        self._views.push(view);
        self.$('ul').append(view.render().el);
      });
    },
    orderItems: function() {
      // items are in order within the layout
      var itemElems = this.pckry.getItemElements();
      for (var i = 0, len = itemElems.length; i < len; i++) {
        var elem = itemElems[i];
        elem.tabIndex = i + 1;
        $(elem).trigger('updateOrder'); // caught by block views
      }
    },
    createBlock: function() {
      this.collection.create({ menuId: this.menu.id });
    },
    findViewForModel: function(model) {
      return _(this._views).find(function(view) { return view.model === model; });
    },
    remove: function() {
      // empty instead of removing
      _.invoke(this._views, 'remove');
      this._views = [];
      this.stopListening();
      this.$el.unbind();
      return this;
    }
  });

  return BlockSetView;
});
