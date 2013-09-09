var async = require('async');

exports.command = function(cssSelector, callback) {

  this.elements('css selector', cssSelector, function(err, elements) {
    if (err) return callback(err);
    var results = [];
    var self = this;
    async.each(elements.value, function(element, cb) {
      self.elementIdText(element.ELEMENT, function(err, result) {
        if (err) return cb(err);
        results.push(result.value);
        cb();
      });
    }, function(err){
      callback(err, results);
    });
  });

};
