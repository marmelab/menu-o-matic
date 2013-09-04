exports.command = function(cssSelectorItem, cssSelectorDropDestination, xoffset, yoffset, callback) {

		var self = this;

		this
				.moveToObject(cssSelectorItem)
				.buttonDown()
				.moveToObjectAt(cssSelectorDropDestination, 100, 10)
				.pause(2000)
				.buttonUp(function(err,result) {
						if (typeof callback === "function") {
								callback(err,result);
						}
				});
};
