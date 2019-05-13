const fs = require('fs');
const path = require('path');

const sendMail = require('../email/email');
const walk = require("./walk");

const standardMessage = "A policy is in place to notify you of the test results.";
var content = "";
var missingFiles = [];
var keywordsResults = [];
var keywordsMissingResults = [];

function traverse_with_json(jsonFile, startingDirectory) {
    var jsonDir = "";
    var strArr = [];

    if (jsonFile.includes("\\")) {
        strArr = jsonFile.split("/");
    } else {
        strArr = jsonFile.split("/");
    }


    for (var i = 0; i < strArr.length - 1; i++) {
        jsonDir += "/" + strArr[i];
    }

    fs.readFile(jsonFile, function (err, data) {
        if (err) {
            throw err;
        }

        content += data;
        var obj = JSON.parse(content);
        console.log(obj);

        var check = obj["check"];
        var resultsFile = obj["results"];
        var recepients = obj["watchers"];

        walk(startingDirectory, function (err, scanResults) {
            if (err) {
                //end program
                throw err;
            }
            runCheck(check, jsonDir, resultsFile, recepients, scanResults);
        });
    });
}

async function runCheck(check, jsonFile, resultsFile, recepients, scanResults) {
    for (var oneFile of check) {
        var relPath = oneFile["relPath"];
        var keywords = oneFile["keywords"];
        var filename = path.resolve(jsonFile, relPath);
        var foundFileFlag = false;

        for (var result of scanResults) {
            if (!result){
                //quick fix to skip loop if result is undefined
                //Root cause is in walk, some undefined variable might get added to list
                continue;
            }

            //replace forward slash with backslash.
			var windowsRelPath = relPath.replace(/\//g,'\\');
			//console.log(windowsRelPath);

            if (result.endsWith(relPath) || result.endsWith(windowsRelPath)) {
                //found the file
                foundFileFlag=true;
                await findKeywords(result).then(function (stringIn) {
                    for (var oneKeyword of keywords) {
                        if (stringIn.includes(oneKeyword)) {
                            console.log("in" + oneKeyword);
                            keywordsResults.push("\"" + oneKeyword + "\"" + " is in " + filename);
                        }
                        else {
                            console.log("missing" + oneKeyword);
                            keywordsMissingResults.push("\"" + oneKeyword + "\"" + " is not in " + filename);
                        }
                    }
                }).catch(function (err) {
                    console.log(err);
                    missingFiles.push(filename + " is missing. ");
                });
            }
        }
        if (!foundFileFlag){
            missingFiles.push(filename+" is missing. ");
        }
    }


    console.log("----------Missing Files-----------");
    console.log(missingFiles);
    console.log("----------Keywords-----------");
    console.log(keywordsResults);
    console.log("----------Missing Keywords-----------");
    console.log(keywordsMissingResults);

    //use \r\n for new lines in Windows

    var resultsString = "--------------Missing Files---------------\r\n";
    for (var oneFile of missingFiles) {
        resultsString += oneFile + "\r\n";
    }

    resultsString += "\r\n---------------Missing keywords---------------\r\n";

    for (var oneMissingKeyword of keywordsMissingResults) {
        resultsString += oneMissingKeyword + "\r\n";
    }

    resultsString += "\r\n---------------Keywords---------------\r\n";
    for (var oneKeyword of keywordsResults) {
        resultsString += oneKeyword + "\r\n";
    }

    //put a timestamp on the file name
    resultsFile += "_" + Date.now().toString() + ".txt";
    fs.writeFile(resultsFile, resultsString, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("Write to " + resultsFile + " complete. ");
    });

    //clean up resultsFile
    var emailResultsFile = resultsFile.replace("./", "");
    console.log(emailResultsFile);
    //make attachments array to send over, just one attachment
    var attachments = [
        {
            filename: resultsFile,
            content: resultsString,
        }
    ];

    sendMail(standardMessage, attachments, recepients);
}

async function findKeywords(filename) {
    return fs.readFileAsync(filename);
}

fs.readFileAsync = function (filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, function (err, data) {
            if (err)
                reject(err);
            else {

                resolve(data);
            }
        });
    });
};

module.exports = traverse_with_json;
