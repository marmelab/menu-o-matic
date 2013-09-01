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
    text:         '../bower_components/requirejs-text/text',
    backbone:     '../bower_components/backbone-amd/backbone',
    backboneLocalStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
    marked:       '../bower_components/marked/lib/marked',
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
  var $               = require('jquery');
  var _               = require('underscore');
  var Backbone        = require('backbone');
  var BlockCollection = require('collections/blockCollection');
  var BlockSetView    = require('views/blockSetView');
  var App = new BlockSetView({ collection: new BlockCollection() });
});
