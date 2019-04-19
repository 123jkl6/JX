var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');

var jsonFile = "/Users/wanaccess/eclipse-workspace/node_examples/sample.json";
var directory = "";
var content = "";
var missingFiles = [];
var keywordsResults = [];
var keywordsMissingResults = [];

fs.readFile(jsonFile,function(err,data){
	if (err){
		throw err;
	}
	
	content += data;
	
	var obj = JSON.parse(content);
	console.log(obj);
	
	directory = obj["dir"];
	var contentObj = obj["dirSchema"];
	var resultsFile = obj["results"];
	
	resolveDir(contentObj,directory);
	
	setTimeout(function(){
		console.log("----------Missing Files-----------");
		console.log(missingFiles);
		console.log("----------Keywords-----------");
		console.log(keywordsResults);
		console.log("----------Missing Keywords-----------");
		console.log(keywordsMissingResults);
		
		var resultsString = "--------------Missing Files---------------\r\n";
		
		for (var oneFile of missingFiles){
			resultsString += oneFile + "\r\n";
		}
		
		resultsString += "\r\n---------------Keywords---------------\r\n";
		
		for (var oneKeyword of keywordsResults){
			resultsString += oneKeyword + "\r\n";
		}
		
		resultsString += "\r\n---------------Missing keywords---------------\r\n";
		
		for (var oneMissingKeyword of keywordsMissingResults){
			resultsString += oneMissingKeyword + "\r\n";
		}
		
		fs.writeFile(resultsFile,resultsString,function(err){
			if (err){
				return console.log(err);
			}
			
			console.log("Write to "+resultsFile+" complete. ");
		});
		
		sendMail(resultsString);
		
	},3000);
});

function resolveDir(jsonDir,dirInput){
	
	fs.readdir(dirInput,function(err,list){
		for (var oneFile in jsonDir){
			
			if (!list){
				return ;
			}
			
			if (!list.includes(oneFile) && oneFile!="type"){
				missingFiles.push(oneFile+" is missing in "+dirInput+". ");
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
							keywordsMissingResults.push("\""+oneKeyword+"\""+" is not in "+path.resolve(dirInput,oneFile));
						}
					}
				});
			}
		}
		
	});
}

function sendMail(textMail){
	var transporter = nodemailer.createTransport({
	    host: 'hotmail',
		auth: {
		    user: '<user>@hotmail.com',
		    pass: '<password>'
		  }
		});

	var mailOptions = {
	  from: '<sender>',
	  to: '<recepient>',
	  subject: 'Test Results',
	  text: textMail
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
}