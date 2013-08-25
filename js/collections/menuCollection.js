define(function(require) {
  "use strict";

  var Backbone = require('backbone');
  var Store    = require('backboneLocalStorage');
  var Menu     = require('models/menu');

  var MenuCollection = Backbone.Collection.extend({
    model: Menu,
    localStorage: new Store("menus-backbone"),
    comparator: 'order'
  });

  return MenuCollection;
});
