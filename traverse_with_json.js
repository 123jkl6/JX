var fs = require('fs');
var path = require('path');

var jsonFile = "/Users/wanaccess/eclipse-workspace/node_examples/sample.json";
var directory = "";
var content = "";
var missingFiles = [];
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
	
	resolveDir(contentObj,directory);
	
	setTimeout(function(){
		console.log("----------Missing Files-----------");
		console.log(missingFiles);
		console.log("----------Keywords-----------");
		console.log(keywordsResults);
	},3000);
});

function resolveDir(jsonDir,dirInput){
	
	fs.readdir(dirInput,function(err,list){
		for (var oneFile in jsonDir){
			
			if (!list){
				return ;
			}
			
			if (!list.includes(oneFile) && oneFile!="type"){
				//console.log(path.resolve(dirInput,oneFile));
				missingFiles.push(path.resolve(dirInput,oneFile));
			}
			
			if (jsonDir[oneFile]["type"]=="directory"){
				resolveDir(jsonDir[oneFile],path.resolve(dirInput,oneFile));
			}
			else if (jsonDir[oneFile]["type"]=="file"){
				var stringIn = "";
				fs.readFile(path.resolve(dirInput,oneFile),function(error,dataIn){
					stringIn += dataIn;
					var keywords = jsonDir[oneFile]["keywords"];
					
					for (var oneKeyword of keywords){
						if (stringIn.includes(oneKeyword)){
							keywordsResults.push("\""+oneKeyword+"\""+" is in "+path.resolve(dirInput,oneFile));
						}
						else {
							keywordsResults.push("\""+oneKeyword+"\""+" is not in "+path.resolve(dirInput,oneFile));
						}
					}
				});
			}
		}
		
	});
}