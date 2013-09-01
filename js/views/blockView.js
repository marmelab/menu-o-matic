define(function(require) {
  "use strict";

  var $             = require('jquery');
  var _             = require('underscore');
  var Backbone      = require('backbone');
  var marked        = require('marked');
  var BlockFormView = require('views/blockFormView');

  var blockFormView;
  
  var BlockView = Backbone.View.extend({
    tagName:  "li",
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
        .addClass('block')
        .attr({
          'tabindex': this.model.get('order')
        })
        .html(marked(this.model.get('content')));
      return this;
    },
    select: function() {
      if (blockFormView) {
        blockFormView.remove();
      }
      this.$el.parent().children('.block').removeClass('selected');
      this.$el.addClass('selected');
      blockFormView = new BlockFormView({ model: this.model });
      $(".blockform")
        .html(blockFormView.render().el)
        .show()
        .find('textarea[name="content"]').focus();
    },
    updateOrder: function() {
      this.model.save({ order: this.el.tabIndex });
    }
  });

  return BlockView;
});
