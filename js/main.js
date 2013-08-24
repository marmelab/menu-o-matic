require.config({
  shim: {
    backboneLocalStorage: {
      deps: ['backbone'],
      exports: 'Store'
    }
  },
  paths: {
    jquery:       '../bower_components/jquery/jquery',
    underscore:   '../bower_components/underscore-amd/underscore',
    backbone:     '../bower_components/backbone-amd/backbone',
    backboneLocalStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
    packery:      '../bower_components/packery',
    draggabilly:  '../bower_components/draggabilly/draggabilly',
    // packery and draggabilly dependencies (see https://github.com/desandro/draggabilly/issues/28 and http://packery.metafizzy.co/appendix.html#requirejs)
    classie:      '../bower_components/classie',
    eventie:      '../bower_components/eventie',
    'doc-ready':  '../bower_components/doc-ready',
    eventEmitter: '../bower_components/eventEmitter',
    'get-style-property': '../bower_components/get-style-property',
    'get-size':   '../bower_components/get-size',
    'matches-selector': '../bower_components/matches-selector',
    outlayer:     '../bower_components/outlayer'
  }
});

define(function(require) {
  'use strict';
  var $              = require('jquery');
  var _              = require('underscore');
  var Backbone       = require('backbone');
  var MenuCollection = require('collections/menuCollection');
  var MenuBarView    = require('views/menuBarView');
  var App = new MenuBarView({ collection: new MenuCollection() });
});
