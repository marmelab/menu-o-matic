define(function(require) {
  "use strict";

  var $        = require('jquery');
  var Backbone = require('backbone');
  var MenuBarView = require('views/menuBarView');
  var MenuFormView = require('views/menuFormView');

  var AppView = Backbone.View.extend({
    el: '.container',
    initialize: function() {
      // fetch menus from storage and reorder
      this.collection.fetch();
      this.collection.sortBy('order');
      this.listenTo(this.collection, 'select', this.selectMenu);
      new MenuBarView({ collection: this.collection });
      this.formView = null;
    },
    selectMenu: function() {
      if (this.formView) {
        this.formView.remove();
      }
      this.formView = new MenuFormView({ model: this.collection.selectedMenu });
      this.$(".menuform")
        .html(this.formView.render().el)
        .show()
        .find('input[name="title"]').focus();
    }
  });

  return AppView;
});
