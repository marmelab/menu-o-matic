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
      this.listenTo(this.model, 'select', this.renderSelected);
      this.listenTo(this.model, 'unselect', this.renderUnselected);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this
        .renderContent()
        .renderOrder();
      return this;
    },
    renderContent: function() {
      this.$el.html(marked(this.model.get('content')));
      return this;
    },
    renderOrder: function() {
      this.$el.attr('tabindex', this.model.get('order'));
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
