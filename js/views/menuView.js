define(function(require) {
  "use strict";

  var $            = require('jquery');
  var _            = require('underscore');
  var Backbone     = require('backbone');
  var MenuFormView = require('views/menuFormView');

  var menuFormView;
  
  var MenuView = Backbone.View.extend({
    tagName:  "li",
    className: "item",
    events: {
      "click":       "select",
      "updateOrder": "updateOrder"
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this.$el
        .addClass('item')
        .attr({
          'tabindex': this.model.get('order'),
          'data-url': this.model.get('url'),
          'title': this.model.get('url')
        })
        .text(this.model.get('title'));
      return this;
    },
    select: function() {
      if (menuFormView) {
        menuFormView.remove();
      }
      this.$el.parent().children('.item').removeClass('selected');
      this.$el.addClass('selected');
      menuFormView = new MenuFormView({ model: this.model });
      $(".menuform")
        .html(menuFormView.render().el)
        .show()
        .find('input[name="title"]').focus();
    },
    updateOrder: function() {
      this.model.save({ order: this.el.tabIndex });
    }
  });

  return MenuView;
});
