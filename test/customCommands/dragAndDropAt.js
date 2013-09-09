exports.command = function(cssSelectorItem, cssSelectorDropDestination, xoffset, yoffset, callback) {

  this
    .moveToObject(cssSelectorItem)
    .moveToObject(cssSelectorItem) // won't work unless doubled in this case
    .buttonDown()
    .pause(100)
    .moveToObjectAt(cssSelectorDropDestination, xoffset || 100, yoffset || 10)
    .buttonUp(function(err,result) {
      if (typeof callback === "function") {
        callback(err,result);
      }
    });
};
