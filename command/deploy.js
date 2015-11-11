var sequest = require("sequest"),
	jsonfile = require("jsonfile"),
	config = require("../config/config"),
    fileCopy = require("../util/fileCopy"),
	fs = require("fs");

module.exports = function(colors, options) {
    var exFolders = config.EXCLUDED_FOLDERS,
        fullPath = config.USERNAME + ":" + config.PASSWORD + "@" + config.HOST + ":" + config.DEPLOY_DIRECTORY,
        source = path.dirname(require.main.filename);
	options = options || {};
	
	jsonfile.readFile(config.CONFIG_FILE, function(err, settings) {
  		if(err) {
			console.log(colors.red(err));
		} else {
			
			var userHostInfo = settings.username + "@" + settings.host;
			
			var seq = sequest.connect(userHostInfo, {
				password: settings.password
			});

            fileCopy(source, exFolders, fullPath);

            console.log(colors.green("Deploy successful."));
            seq.end();
		}
	});
};