define(function(require) {
  "use strict";

  var _        = require('underscore');
  var Backbone = require('backbone');

  var Menu = Backbone.Model.extend({
    defaults: {
      title: 'Nouveau menu',
      url: '',
      order: 0
    }
  });

  return Menu;
});
