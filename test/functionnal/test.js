var assert = require('assert');
var http = require('http');
var nodeStatic = require('node-static');
var webdriverjs = require('webdriverjs');
var customCommands = require('../customCommands');

var client = {};
var options = {
  desiredCapabilities:  { browserName: process.env.TEST_BROWSER || 'firefox' },
  customCommands: __dirname + '/../utils',
  // logLevel: 'silent'
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

  it('should allow addition of new menus',function(done) {
    client
      .url('http://localhost:4001/')
      .click('.menubar .add_button button')
      .pause(300)
      .getText('.menus .item', function(err, text) {
        assert.strictEqual(err, null);
        assert.equal("Nouveau menu", text);
      })
      .pause(500)
      .click('#delete')
      .pause(400)
      .alertAccept()
      .call(done);
  });

  it('should allow selection of menus', function(done) {
    client
      .url('http://localhost:4001/')
      .click('.menubar .add_button button')
      .pause(500)
      .click('h1') //deselect
      .click('.menus .item:nth-child(1)')
      .getValue(".properties_form input[name='title']", function(err, result) {
        assert.strictEqual(err, null);
        assert.equal(result, 'Nouveau menu');
      })
      .pause(500)
      .click('#delete')
      .pause(400)
      .alertAccept()
      .call(done);
  });

  it('should allow renaming of menus', function(done) {
    client
      .url('http://localhost:4001/')
      .click('.menubar .add_button button')
      .click('.menubar .add_button button')
      .pause(500)
      .setValue(".properties_form input[name='title']", 'My second menu')
      .pause(500)
      .getElementsText('.menus .item', function(err, result){
        assert.strictEqual(err, null);
        assert.equal("Nouveau menu", result[0]);
        assert.equal("My second menu", result[1]);
      })
      .pause(500)
      .click('.properties_form #delete')
      .pause(400)
      .alertAccept()
      .click('.menus .item:nth-child(1)')
      .pause(200)
      .click('.properties_form #delete')
      .pause(400)
      .alertAccept()
      .call(done);
  });

  it('should allow drag and drop of menus', function(done) {
    client
      .url('http://localhost:4001/')
      .click('.menubar .add_button button')
      .click('.menubar .add_button button')
      .pause(500)
      .setValue(".properties_form input[name='title']", 'My second menu')
      .pause(500)
      .dragAndDropAt('.menus .item:nth-child(1)', '.menus .item:nth-child(2)',0 ,0)
      .pause(2000)
      .getElementsText('.menus .item', function(err, result){
        assert.strictEqual(err, null);
        assert.equal("My second menu", result[0]);
        assert.equal("Nouveau menu", result[1]);
      })
      .pause(500)
      .click('.properties_form #delete')
      .pause(400)
      .alertAccept()
      .click('.menus .item:nth-child(1)')
      .pause(200)
      .click('.properties_form #delete')
      .pause(400)
      .alertAccept()
      .call(done);
  });

  after(function(done) {
    client.end(done);
    server.close();
  });
});
