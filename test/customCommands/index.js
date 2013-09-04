var fs = require('fs');

function init(client) {
		fs.readdir(__dirname, function(err, files){
				files.forEach(function(file) {
						var filePath = __dirname+'/'+file;
						if (filePath == __filename) {
								return;
						}
						
						var commandName = file.split('.')[0];
						client.addCommand(commandName, require(filePath).command);
				});
		});
}

module.exports = init;