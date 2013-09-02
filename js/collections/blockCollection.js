define(function(require) {
  "use strict";

  var Backbone = require('backbone');
  var _        = require('underscore');
  var Store    = require('backboneLocalStorage');
  var Block    = require('models/block');

  var BlockCollection = Backbone.Collection.extend({
    model: Block,
    localStorage: new Store("Blocks-backbone"),
    comparator: 'order',
    initialize: function() {
      this.listenTo(this, 'select', this.changeSelected);
    },
    filterForMenu: function(menu) {
      return this.filter(function(block) {
        return block.get('menuId') == menu.id;
      });
    },
    removeForMenu: function(menu) {
      _.each(this.filterForMenu(menu), function(block) {
        block.destroy();
      });
    },
    changeSelected: function(model) {
      this.unselect();
      this.selectedBlock = model;
    },
    unselect: function() {
      if (this.selectedBlock) {
        this.selectedBlock.unselect();
      }
      this.selectedBlock = null;
    }
  });

  return BlockCollection;
});
