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
      this.listenTo(this.model, 'change:url', this.renderUrl);
      this.listenTo(this.model, 'change:title', this.renderTitle);
      this.listenTo(this.model, 'change:order', this.renderOrder);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this
        .renderTitle()
        .renderUrl()
        .renderOrder();
      return this;
    },
    renderTitle: function() {
      this.$el.text(this.model.get('title'));
      return this;
    },
    renderUrl: function() {
      this.$el.attr({
          'data-url': this.model.get('url'),
          'title': this.model.get('url')
      });
      return this;
    },
    renderOrder: function() {
      this.$el
        .attr({
          'tabindex': this.model.get('order')
        });
      return this;
    },
    select: function() {
      if (menuFormView) {
        menuFormView.remove();
      }
      this.$el.siblings('.item').removeClass('selected');
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
