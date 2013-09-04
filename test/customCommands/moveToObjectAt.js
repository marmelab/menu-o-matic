exports.command = function (cssSelector, xoffset, yoffset, callback) {
		var self = this;

		this.element("css selector", cssSelector,function(err,result) {

				if(err === null && result.value) {
						console.log('Move : '+xoffset);

						self.moveTo(result.value.ELEMENT, xoffset, yoffset, function(err,result) {
								if (typeof callback === "function") {
										callback(err,result);
								}
						});
				} else if (typeof callback === "function") {
						callback(err,result);
				}

		});
};

