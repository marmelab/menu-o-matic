define(function(require) {
  "use strict";

  var $        = require('jquery');
  var Backbone = require('backbone');
  var menuFormTemplate = require('text!templates/menuFormTemplate.html');

  var MenuFormView = Backbone.View.extend({
    template: _.template(menuFormTemplate),
    events: {
      'change input[name="title"]': 'updateTitle',
      'keyup input[name="title"]': 'updateTitle',
      'change input[name="url"]': 'updateUrl',
      'keyup input[name="url"]': 'updateUrl',
      'click #delete': 'removeMenu',
      'focus input': 'enterInput',
      'blur input': 'leaveInput'
    },
    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },
    updateTitle: function(e) {
      this.model.set('title', this.$('input[name="title"]').val());
    },
    updateUrl: function(e) {
      this.model.set('url', this.$('input[name="url"]').val());
    },
    removeMenu: function() {
      if (!confirm('Vous êtes sur le point de supprimer le menu "' + this.model.get('title') + '".')) return;
      this.model.destroy();
    },
    enterInput: function() {
      if (this.onFormBlur) {
        clearTimeout(this.onFormBlur);
      }
    },
    leaveInput: function() {
      this.model.save();
      var self = this;
      this.onFormBlur = setTimeout(function() {
        self.remove();
        $('.menubar').trigger('unselect');
      }, 500);
    }
  });

  return MenuFormView;
});
