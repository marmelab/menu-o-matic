define(function(require) {
  "use strict";

  var $        = require('jquery');
  var Backbone = require('backbone');
  var MenuBarView = require('views/menuBarView');
  var MenuFormView = require('views/menuFormView');
  var BlockSetView = require('views/blockSetView');

  var AppView = Backbone.View.extend({
    el: '.container',
    events: {
      'leave .menuform': 'leaveMenuForm'
    },
    initialize: function(options) {
      // menus
      this.menus = options.menus;
      this.menus.fetch();
      this.menus.sortBy('order');
      this.listenTo(this.menus, 'select', this.selectMenu);
      this.listenTo(this.menus, 'unselect', this.unselect);
      new MenuBarView({ collection: this.menus });
      // blocks
      this.blocks = options.blocks;
      this.blocks.fetch();
      this.listenTo(this.blocks, 'select', this.selectBlock);
      this.listenTo(this.blocks, 'unselect', this.unselect);
      // edition form
      this.formView = null;
    },
    leaveMenuForm: function() {
      this.menus.selectedMenu.unselect();
    },
    selectMenu: function() {
      this.unselectMenu();
      var menu = this.menus.selectedMenu;
      this.formView = new MenuFormView({ model: menu });
      this.$(".menuform")
        .html(this.formView.render().el)
        .show()
        .find('input[name="title"]').focus();
      if (this.blockSetView) {
        this.blockSetView.remove();
      }
      this.blockSetView = new BlockSetView({ collection: this.blocks, menu: menu }); 
    },
    selectBlock: function() {
      this.menus.selectedMenu.unselect();
    },
    unselect: function() {
      if (this.formView) {
        this.formView.remove();
      }
    }
  });

  return AppView;
});
