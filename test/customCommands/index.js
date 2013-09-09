var fs = require('fs');

// load all files of the current directory as new Selenium commands
function init(client) {
  var files = fs.readdirSync(__dirname);
  files.forEach(function(file) {
    var filePath = __dirname + '/' + file;
    if (filePath == __filename) return;
    var commandName = file.split('.')[0];
    console.log(commandName);
    client.addCommand(commandName, require(filePath).command);
  });
}

module.exports = init;
