define(function(require) {
  "use strict";

  var $             = require('jquery');
  var Backbone      = require('backbone');
  var marked        = require('marked');

  var BlockView = Backbone.View.extend({
    tagName:  "li",
    className: "block",
    events: {
      "mousedown":   "select",
      "touchstart":  "select",
      "updateOrder": "updateOrder"
    },
    initialize: function() {
      this.listenTo(this.model, 'change:content', this.renderContent);
      this.listenTo(this.model, 'change:order', this.renderOrder);
      this.listenTo(this.model, 'change:className', this.renderClassName);
      this.listenTo(this.model, 'select', this.renderSelected);
      this.listenTo(this.model, 'unselect', this.renderUnselected);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this
        .renderContent(this.model, this.model.get('content'))
        .renderOrder(this.model, this.model.get('order'))
        .renderClassName(this.model, this.model.get('className'));
      return this;
    },
    renderContent: function(model, content) {
      this.$el.html(marked(content));
      return this;
    },
    renderOrder: function(model, order) {
      this.$el.attr('tabindex', order);
      return this;
    },
    renderClassName: function(model, className) {
      this.$el
        .removeClass(model.previous('className'))
        .addClass(className);
      return this;
    },
    renderSelected: function() {
      this.$el.addClass('selected');
    },
    renderUnselected: function() {
      this.$el.removeClass('selected');
    },
    select: function() {
      this.model.select();
    },
    updateOrder: function() {
      this.model.save({ order: this.el.tabIndex });
    }
  });

  return BlockView;
});
