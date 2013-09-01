define(function(require) {
  "use strict";

  var $        = require('jquery');
  var Backbone = require('backbone');
  var MenuBarView = require('views/menuBarView');
  var MenuFormView = require('views/menuFormView');

  var AppView = Backbone.View.extend({
    el: '.container',
    events: {
      'selected .item': 'selectMenu'
    },
    initialize: function() {
      new MenuBarView({ collection: this.collection });
      this.formView = null;
    },
    selectMenu: function(e, model) {
      if (this.formView) {
        this.formView.remove();
      }
      this.formView = new MenuFormView({ model: model });
      this.$(".menuform")
        .html(this.formView.render().el)
        .show()
        .find('input[name="title"]').focus();
    },
  });

  return AppView;
});
