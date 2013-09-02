define(function(require) {
  "use strict";

  var $        = require('jquery');
  var Backbone = require('backbone');
  var blockFormTemplate = require('text!templates/blockFormTemplate.html');

  var BlockFormView = Backbone.View.extend({
    template: _.template(blockFormTemplate),
    events: {
      'change textarea[name="content"]': 'updateContent',
      'keyup textarea[name="content"]': 'updateContent',
      'click #delete': 'removeBlock',
      'focus textarea': 'enterTextarea',
      'blur textarea': 'leaveTextarea'
    },
    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },
    updateContent: function(e) {
      this.model.set('content', this.$('textarea[name="content"]').val());
    },
    removeBlock: function() {
      if (!confirm('Vous êtes sur le point de supprimer un block.')) return;
      this.model.destroy();
    },
    enterTextarea: function() {
      if (this.onFormBlur) {
        clearTimeout(this.onFormBlur);
      }
    },
    leaveTextarea: function() {
      this.model.save();
      var self = this;
      this.onFormBlur = setTimeout(function() {
        self.$el.trigger('leave');
        self.remove();
      }, 500);
    }
  });

  return BlockFormView;
});
