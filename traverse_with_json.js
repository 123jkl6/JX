var fs = require('fs');
var path = require('path');

var jsonFile = "/Users/wanaccess/eclipse-workspace/node_examples/sample.json";
var directory = "";
var content = "";
var missingFiles = [];
var keywords = [];
var keywordsResults = [];

fs.readFile(jsonFile,function(err,data){
	if (err){
		throw err;
	}
	
	content += data;
	
	var obj = JSON.parse(content);
	console.log(obj);
	
	directory = obj["dir"];
	var contentObj = obj["dirSchema"];
	keywords = obj["keywords"];
	
	resolveDir(contentObj,directory);
	
	setTimeout(function(){
		console.log("----------Missing Files-----------");
		console.log(missingFiles);
		console.log("----------Keywords-----------");
		console.log(keywordsResults);
	},3000);
});

async function resolveDir(jsonDir,dirInput){
	fs.readdir(dirInput,function(err,list){
		for (var oneFile in jsonDir){
			if (!list.includes(oneFile)){
				//console.log(path.resolve(dirInput,oneFile));
				missingFiles.push(path.resolve(dirInput,oneFile));
			}
			if ((typeof jsonDir[oneFile])=="object"){
				resolveDir(jsonDir[oneFile],path.resolve(dirInput,oneFile));
			}
			else if (jsonDir[oneFile]=="file"){
				var stringIn = "";
				fs.readFile(path.resolve(dirInput,oneFile),function(error,dataIn){
					stringIn += dataIn;
					for (var oneWord of keywords){
						if (stringIn.includes(oneWord)){
							keywordsResults.push(oneWord+" is in "+path.resolve(dirInput,oneFile));
						}
					}
				});
			}
		}
		
	});
}