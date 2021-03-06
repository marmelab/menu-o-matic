define(function(require) {
  "use strict";

  var $           = require('jquery');
  var _           = require('underscore');
  var Backbone    = require('backbone');
  var Packery     = require('packery/js/packery');
  var Draggabilly = require('draggabilly');
  var MenuView    = require('views/menuView');

  var MenuBarView = Backbone.View.extend({
    el: ".menubar",
    events: {
      'click #add_menu': 'createMenu'
    },
    initialize: function() {
      // render
      this.addAll();
      // bind collection events
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'remove', this.removeOne);
      this.listenTo(this.collection, 'change', this.updateLayout);
      this.listenTo(this.collection, 'reset', this.addAll);
      // initialize Packery
      var pckry = new Packery(this.$('.menus').get(0), {
        gutter: 5,
        rowHeight: 40,
        "itemSelector": ".item"
      });
      // make items draggable
      pckry.getItemElements().forEach(function(elem) {
        pckry.bindDraggabillyEvents(new Draggabilly(elem));
      });
      pckry.on('layoutComplete', this.orderItems.bind(this));
      pckry.on('dragItemPositioned', this.updateLayout.bind(this));
      this.pckry = pckry;
    },
    addOne: function(menu) {
      var view = new MenuView({ model: menu });
      this._views.push(view);
      var elem = view.render().el;
      this.$('ul').append(elem);
      this.pckry.appended(elem);
      this.updateLayout();
      this.pckry.bindDraggabillyEvents(new Draggabilly(elem));
      setTimeout(function() { view.select(); }, 500);
    },
    removeOne: function(menu) {
      var viewToRemove = this.findViewForModel(menu);
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
      this.collection.each(function(menu) {
        var view = new MenuView({ model: menu });
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
        $(elem).trigger('updateOrder'); // caught by menu views
      }
    },
    createMenu: function() {
      this.collection.create();
    },
    findViewForModel: function(model) {
      return _(this._views).find(function(view) { return view.model === model; });
    }
  });

  return MenuBarView;
});
