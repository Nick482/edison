var path = require('path'),
    fs = require('fs'),
    client = require('scp2');

function copyFn(source, exFolders, fullPath) {

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
                    if (exFolders.indexOf(files[i]) > -1){
                        console.log("Skipped")
                    }
                    else if (stats.isDirectory()) {
                        var folderName = files[i].split("/").pop();
                        console.log("   Copied folder" + files[i]);
                        client.scp(files[i], target, copy(target + folderName))
                    }
                    else if (stats.isFile()) {
                        client.scp(files[i], target);
                        console.log("Copied" + files[i]);
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
                            if(exFolders.indexOf(subItems[i]) > -1){
                                console.log("Skipped on Edison")
                            }
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
module.exports = copyFn();