var assert = require('assert');
var http = require('http');
var nodeStatic = require('node-static');
var webdriverjs = require('webdriverjs');
var customCommands = require('../customCommands');

var client = {};
var options = {
  desiredCapabilities:  { browserName: process.env.TEST_BROWSER || 'firefox' },
  logLevel: 'silent'
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
      .pause(200)
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
      .pause(200)
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
      .click('.properties_form #delete')
      .pause(200)
      .alertAccept()
      .click('.menus .item:nth-child(1)')
      .pause(200)
      .click('.properties_form #delete')
      .pause(200)
      .alertAccept()
      .call(done);
  });

  it('should allow drag and drop of menus', function(done) {
    client
      .url('http://localhost:4001/')
      .click('.menubar .add_button button')
      .click('.menubar .add_button button')
      .pause(500)
      .getAttribute('.menus .item:nth-child(1)', 'tabindex', function(err, tabindex) {
        assert.equal(tabindex, 1);
      })
      .getAttribute('.menus .item:nth-child(2)', 'tabindex', function(err, tabindex) {
        assert.equal(tabindex, 2);
      })
      .setValue(".properties_form input[name='title']", 'My second menu')
      .dragAndDropAt('.menus .item:nth-child(1)', '.menus .item:nth-child(2)', 0, 0)
      .pause(1000)
      .getAttribute('.menus .item:nth-child(1)', 'tabindex', function(err, tabindex) {
        assert.equal(tabindex, 2);
      })
      .getAttribute('.menus .item:nth-child(2)', 'tabindex', function(err, tabindex) {
        assert.equal(tabindex, 1);
      })
      .click('.properties_form #delete')
      .pause(200)
      .alertAccept()
      .click('.menus .item:nth-child(1)')
      .pause(200)
      .click('.properties_form #delete')
      .pause(200)
      .alertAccept()
      .call(done);
  });

  it('should persist menus between sessions', function(done) {
    client
      .url('http://localhost:4001/')
      .click('.menubar .add_button button')
      .pause(500)
      .setValue(".properties_form input[name='title']", 'First')
      .pause(100)
      .click('.menubar .add_button button')
      .pause(500)
      .setValue(".properties_form input[name='title']", 'Second')
      .pause(100)
      .dragAndDropAt('.menus .item:nth-child(1)', '.menus .item:nth-child(2)', 0, 0)
      .pause(1000)
      .refresh()
      .pause(500)
      .getText('.menus .item:nth-child(1)', function(err, text) {
        assert.equal(text, 'Second');
      })
      .getAttribute('.menus .item:nth-child(1)', 'tabindex', function(err, tabindex) {
        assert.equal(tabindex, 1);
      })
      .getText('.menus .item:nth-child(2)', function(err, text) {
        assert.equal(text, 'First');
      })
      .getAttribute('.menus .item:nth-child(2)', 'tabindex', function(err, tabindex) {
        assert.equal(tabindex, 2);
      })
      .click('.menus .item:nth-child(1)')
      .pause(200)
      .click('.properties_form #delete')
      .pause(200)
      .alertAccept()
      .click('.menus .item:nth-child(1)')
      .pause(200)
      .click('.properties_form #delete')
      .pause(200)
      .alertAccept()
      .call(done);
  });

  after(function(done) {
    client.end(done);
    server.close();
  });
});
