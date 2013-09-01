define(function(require) {
  "use strict";
 
  var _        = require('underscore');
  var Backbone = require('backbone');

  var Block = Backbone.Model.extend({
    defaults: function() {
      return {
        content: '',
        order: 0
      };
    }
  });

  return Block;
});
