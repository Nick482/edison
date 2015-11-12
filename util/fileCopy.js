var path = require('path'),
    fs = require('fs');

function copyFn(source, exFolders, fullPath, host, targetPath, seq) {

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
                        seq("mkdir -p", files[i], copy(target + folderName))
                    }
                    else if (stats.isFile()) {
                        var writer = seq.put(host, targetPath + files[i]);
                        fs.createReadStream(files[i]).pipe(writer);
                        console.log("Copied" + files[i]);
                    }
                }
            }
        });
    }
    function cleanUp(){
        var edisonFolders = seq("ls", function(e, stdout){
            return stdout.split("\n")
        });
        edisonFolders.forEach(
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
    }
    cleanUp();
    copy(fullPath);
}
module.exports = copyFn;
