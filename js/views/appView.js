define(function(require) {
  "use strict";

  var $             = require('jquery');
  var Backbone      = require('backbone');
  var MenuBarView   = require('views/menuBarView');
  var MenuFormView  = require('views/menuFormView');
  var BlockSetView  = require('views/blockSetView');
  var BlockFormView = require('views/blockFormView');

  var AppView = Backbone.View.extend({
    el: '.container',
    events: {
      'leave .properties_form': 'leaveForm',
      'updatePosition .item': 'placeConnector'
    },
    initialize: function(options) {
      // menus
      this.menus = options.menus;
      this.menus.fetch();
      this.menus.sortBy('order');
      this.listenTo(this.menus, 'select', this.selectMenu);
      this.listenTo(this.menus, 'unselect', this.unselect);
      this.listenTo(this.menus, 'remove', this.removeMenu);
      new MenuBarView({ collection: this.menus });
      // blocks
      this.blocks = options.blocks;
      this.blocks.fetch();
      this.listenTo(this.blocks, 'select', this.selectBlock);
      this.listenTo(this.blocks, 'unselect', this.unselect);
      // edition form
      this.formView = null;
    },
    leaveForm: function() {
      if (this.menus.selectedMenu) {
        this.menus.selectedMenu.unselect();
      }
      if (this.blocks.selectedBlock) {
        this.blocks.selectedBlock.unselect();
      }
    },
    selectMenu: function(menu) {
      this.unselect();
      this.formView = new MenuFormView({ model: menu });
      this.$(".properties_form")
        .html(this.formView.render().el)
        .show()
        .find('input[name="title"]').focus();
      if (this.blockSetView) {
        this.blockSetView.remove();
      }
      this.blockSetView = new BlockSetView({ collection: this.blocks, menu: menu });
    },
    placeConnector: function(e, position) {
      this.$(".menu-block-connector")
        .css({
          'visibility': 'visible',
          'margin-left': position.left + 15,
          width: position.width + 'px'
        });
    },
    removeMenu: function(menu) {
      this.blocks.removeForMenu(menu);
      this.$(".menu-block-connector")
        .css('visibility', 'hidden');
    },
    selectBlock: function() {
      this.menus.selectedMenu.unselect();
      var block = this.blocks.selectedBlock;
      this.formView = new BlockFormView({ model: block });
      this.$(".properties_form")
        .html(this.formView.render().el)
        .show()
        .find('textarea[name="content"]').focus();
    },
    unselect: function() {
      if (this.formView) {
        this.formView.remove();
      }
    }
  });

  return AppView;
});
