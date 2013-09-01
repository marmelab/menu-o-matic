define(function(require) {
  "use strict";

  var _        = require('underscore');
  var Backbone = require('backbone');
  var Store    = require('backboneLocalStorage');
  var Block    = require('models/block');

  var BlockCollection = Backbone.Collection.extend({
    model: Block,
    localStorage: new Store("blocks-backbone"),
    comparator: 'order'
  });

  return BlockCollection;
});
