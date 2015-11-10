var sequest = require("sequest"),
	jsonfile = require("jsonfile"),
	config = require("../config/config"),
    FileCopy = require("../util/FileCopy"),
	fs = require("fs");

module.exports = function(colors, options) {
	options = options || {};
	
	jsonfile.readFile(config.CONFIG_FILE, function(err, settings) {
  		if(err) {
			console.log(colors.red(err));
		} else {
			
			var userHostInfo = settings.username + "@" + settings.host;
			
			var seq = sequest.connect(userHostInfo, {
				password: settings.password
			});

            console.log(colors.green("Deploy successful."));
            seq.end();
		}
	});
}