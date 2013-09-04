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
      'change input[name="className"]': 'updateClassName',
      'keyup input[name="className"]': 'updateClassName',
      'click #delete': 'removeBlock',
      'blur textarea': 'leaveForm',
      'blur input': 'leaveForm',
      'focus textarea': 'enterForm',
      'focus input': 'enterForm'
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
    updateClassName: function(e) {
      this.model.set('className', this.$('input[name="className"]').val());
    },
    removeBlock: function() {
      if (!confirm('Vous êtes sur le point de supprimer un block.')) return;
      this.model.destroy();
    },
    enterForm: function() {
      if (this.onFormBlur) {
        clearTimeout(this.onFormBlur);
      }
    },
    leaveForm: function() {
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
