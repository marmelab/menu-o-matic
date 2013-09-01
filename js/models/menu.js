define(function(require) {
  "use strict";

  var Backbone = require('backbone');

  var Menu = Backbone.Model.extend({
    defaults: {
      title: 'Nouveau menu',
      url: '',
      order: 0
    },
    select: function() {
      this.trigger('select', this);
    },
    unselect: function() {
      this.trigger('unselect', this);
    }
  });

  return Menu;
});
