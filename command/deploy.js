var sequest = require("sequest"),
	jsonfile = require("jsonfile"),
	config = require("../config/config"),
    client = require('scp2'),
	fs = require("fs");

module.exports = function(colors, options, exFolders) {
    var fullPath = config.USERNAME + ":" + config.PASSWORD + "@" + config.HOST + ":" + config.DEPLOY_DIRECTORY;
	options = options || {};
	
	jsonfile.readFile(config.CONFIG_FILE, function(err, settings) {
  		if(err) {
			console.log(colors.red(err));
		} else {
			
			var userHostInfo = settings.username + "@" + settings.host;
			
			var seq = sequest.connect(userHostInfo, {
				password: settings.password
			});

            function copyFn() {
                var source = path.dirname(require.main.filename);

                function copy(target) {
                    fs.readdir(source, function (err, files) {

                        if (files.length == 0) {
                            console.log("The folder is empty");
                            return;
                        }

                        if (err) {
                            throw(err);
                        }
                        else {
                            for (var i = 0; i <= files.length; i++) {
                                var stats = fs.stat(files[i]);
                                if (stats.isDirectory()) {
                                    var folderName = files[i].split("/").pop();
                                    console.log("   Copied folder" + files[i]);
                                    client.scp(files[i], target, copy(target + folderName))
                                }
                                else if (exFolders.indexOf(files[i]) > -1) {
                                    console.log("Skipped")
                                }
                                else if (stats.isFile()) {
                                    client.scp(files[i], target);
                                    console.log("Copied" + files[i]);
                                }
                            }
                        }
                    });
                }
                copy(fullPath)
            }
						console.log(colors.green("Deploy successful."));
						seq.end();
		}
	});
};