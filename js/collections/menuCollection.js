define(function(require) {
  "use strict";

  var Backbone = require('backbone');
  var Store    = require('backboneLocalStorage');
  var Menu     = require('models/menu');

  var MenuCollection = Backbone.Collection.extend({
    model: Menu,
    localStorage: new Store("menus-backbone"),
    comparator: 'order',
    initialize: function() {
      this.listenTo(this, 'select', this.changeSelected);
    },
    changeSelected: function(model) {
      if (this.selectedMenu == model) return;
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
