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

                function copy (target) {
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
                                    client.scp(files[i], target, copy(target + folderName))
                                }
                                else if (stats.isFile()) {
                                    client.scp(files[i], target);
                                }
                            }
                        }
                    });
                }
                function copyProject(){
                    exFolders.forEach(
                        function remove (folder) {
                            if (fs.existsSync(folder)) {
                                fs.readdirSync(folder, function (subItems) {
                                    for(var i = 0; i < subItems.length; i++) {
                                        var stats = fs.statSync(subItems[i]);
                                        if (stats.isDirectory()){
                                            remove(subItems[i])
                                        }
                                        else if (stats.isFile()){
                                            fs.unlinkSync(subItems[i])
                                        }
                                    }
                                })
                            }
                            else {
                                console.log("The directory " + folder +" does not exist")
                            }
                        }
                    );
                    copy(fullPath);
                }
                copyProject();
            }
			
			// relatively /home/root
			seq("cd " + settings.deployDirectory, function(err, stdout) {
				if(err) {
					console.log(colors.red(err));
				} else {
					var writer = seq.put('./p.json');
					fs.createReadStream(process.cwd() + '/package.json').pipe(writer);
					writer.on('close', function () {
						console.log(colors.green("Deploy successful."));
						seq.end();
					});
				}
			});
		}
	});
};