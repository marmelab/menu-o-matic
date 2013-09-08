var assert = require('assert');
var http = require('http');
var nodeStatic = require('node-static');
var webdriverjs = require('webdriverjs');
var customCommands = require('../customCommands');

var client = {};
var options = {
  desiredCapabilities:  { browserName: process.env.TEST_BROWSER || 'firefox' },
  customCommands: __dirname + '/../utils'
};

process.env.NODE_ENV = 'test';

describe('Simple menu creation', function() {

  var server;

  before(function() {

    // start the application on port 4001
    var fileServer = new nodeStatic.Server(__dirname + '/../../');
    server = http.createServer(function (request, response) {
      request.addListener('end', function () {
        fileServer.serve(request, response);
      }).resume();
    });
    server.listen(4001);

    // start Selenium webdriver
    client = webdriverjs.remote(options);
    client.init();

    // load custom Selenium commands
    customCommands(client);
  });

  it('Order test',function(done) {
    client
      .url('http://localhost:4001/')
      .click('.menubar .add_button button')
      .pause(200)
      .getText('.menus .item', function(err, text) {
        assert.equal("Nouveau menu", text);
      })
      .click('.menubar .add_button button')
      .pause(500)
      .setValue(".properties_form input[name='title']", 'My second menu')
      .dragAndDropAt('.menus .item:nth-child(1)', '.menus .item:nth-child(2)',0 ,0)
      .pause(2000)
      .getElementsText('.menus .item', function(err, rslt){
        assert.equal("My second menu", rslt[0]);
        assert.equal("Nouveau menu", rslt[1]);
      })

      .call(done)
    ;
  });


  after(function(done) {
    client.end(done);
    server.close();
  });
});
