define(function(require) {
  "use strict";

  var Backbone = require('backbone');
  var Store    = require('backboneLocalStorage');
  var Menu     = require('models/menu');

  var MenuCollection = Backbone.Collection.extend({
    model: Menu,
    localStorage: new Store("menus-backbone"),
    comparator: 'order',
    selected: null,
    initialize: function() {
      this.listenTo(this, 'select', this.changeSelected);
    },
    changeSelected: function(model) {
      this.unselect();
      this.selectedMenu = model;
    },
    unselect: function() {
      if (this.selectedMenu) {
        this.selectedMenu.unselect();
      }
      this.selectedMenu = null;
    }
  });

  return MenuCollection;
});
