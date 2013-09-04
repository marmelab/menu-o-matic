var async = require('async');

exports.command = function(cssSelector, callback) {

		this.elements('css selector', cssSelector, function(err, elements) {
				var results = [];
				var self = this;

				async.each(elements.value, function(element, cb){
						self.elementIdText(element.ELEMENT, function(err, result) {
								if (err) {
										return callback(err);
								}

								results.push(result.value);
								cb();
						});
				}, function(err){
						if (err) {
								return callback(err);
						}

						callback(null, results);
				});
		});

};
