var assert = require('assert');
var webdriverjs = require('webdriverjs');
var config = require('config');
var customCommands = require('../customCommands');

var applicationUrl = config.application.url;
var client = {};
var options = {
		desiredCapabilities: 	{browserName: config.test.browser},
		customCommands: __dirname + '/../utils'
};

process.env.NODE_ENV = 'test';

describe('Simple menu creation', function() {

		before(function(){
				client = webdriverjs.remote(options);
				client.init();

				customCommands(client);
		});

		it('Order test',function(done) {
				client
						.url(applicationUrl)
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
		});
});