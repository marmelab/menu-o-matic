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
      this.$el.trigger('unselect'); // event bubbling will do the rest
      this.$el.addClass('selected');
      this.$el.trigger('selected', [this.model]);
    },
    updateOrder: function() {
      this.model.save({ order: this.el.tabIndex });
    }
  });

  return MenuView;
});
