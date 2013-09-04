define(function(require) {
  "use strict";

  var Backbone = require('backbone');

  var Menu = Backbone.Model.extend({
    defaults: {
      title: 'Nouveau menu',
      url: '',
      className: '',
      order: 0
    },
    select: function(position) {
      this.trigger('select', this, position);
    },
    unselect: function() {
      this.trigger('unselect', this);
    }
  });

  return Menu;
});
