define(function(require) {
  "use strict";

  var Backbone = require('backbone');

  var Block = Backbone.Model.extend({
    defaults: {
      content: 'Nouveau block',
      menuId: 0,
      order: 0
    },
    select: function() {
      this.trigger('select', this);
    },
    unselect: function() {
      this.trigger('unselect', this);
    }
  });

  return Block;
});
