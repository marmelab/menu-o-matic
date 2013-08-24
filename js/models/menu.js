define(function(require) {
  "use strict";
 
  var _        = require('underscore');
  var Backbone = require('backbone');

  var Menu = Backbone.Model.extend({
    defaults: function() {
      return {
        title: '',
        url: '',
        order: 0
      };
    }
  });

  return Menu;
});
