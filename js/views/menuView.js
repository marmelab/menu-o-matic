define(function(require) {
  "use strict";

  var $            = require('jquery');
  var Backbone     = require('backbone');

  var MenuView = Backbone.View.extend({
    tagName:  "li",
    className: "item",
    events: {
      "mousedown":   "select",
      "touchstart":  "select",
      "updateOrder": "updateOrder"
    },
    initialize: function() {
      this.listenTo(this.model, 'change:url', this.renderUrl);
      this.listenTo(this.model, 'change:title', this.renderTitle);
      this.listenTo(this.model, 'change:order', this.renderOrder);
      this.listenTo(this.model, 'select', this.renderSelected);
      this.listenTo(this.model, 'unselect', this.renderUnselected);
      this.listenTo(this.model, 'select change:url', this.updatePosition);
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
    updatePosition: function() {
      var position = {
        left: this.$el.position().left,
        width: this.$el.width()
      };
      this.$el.trigger('updatePosition', position);
    },
    updateOrder: function() {
      this.model.save({ order: this.el.tabIndex });
      if (this.$el.hasClass('is-dragging') || this.$el.hasClass('selected')) {
        this.updatePosition();
      }
    }
  });

  return MenuView;
});
