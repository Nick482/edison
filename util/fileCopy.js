var path = require('path'),
    fs = require('fs'),

    tempFolders = [],
    folderListString = "-name",
    fullFoldersList = [];

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

    exFolders.forEach(
        function(folder, index){
            var sepFol = folder.split("/"),
                folderPositions = [];
            sepFol.pop();
            sepFol.forEach(function(fol, index){
                folderPositions.push(sepFol[index])
            });
            tempFolders[index] = folderPositions
        }
    );

    tempFolders.forEach(function(folderArray){
        for (var i = 1; i <= folderArray.length; i++){
            fullFoldersList.push(folderArray.slice(0, i).join("/") + "/")
        }
    });
    console.log(fullFoldersList);

    fullFoldersList.forEach(function(folder, index){
        if (index == 0){
            folderListString = folderListString + " " + folder
        }
        else{
            folderListString = folderListString + " -o -name "+ folder
        }
    });
    function cleanUp(){
        seq("find ! \( " + folderListString + " \) -type d -exec rm -r -f {} +")
    }
    cleanUp();
    copy(fullPath);
}
module.exports = copyFn;
