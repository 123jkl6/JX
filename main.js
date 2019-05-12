const traverse = require("./traverse/traverse");
const readline = require('readline');

//first input is json file path
//next input is base directory
//for me I use home, you can also use any other directory


//traverse("/home/developer/json_for_directory/sample.json",process.env.HOME);

//alternatively, prompt for user input on CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Input json file path ', (jsonFile) => {
  // TODO: Log the answer in a database
  //console.log(`${jsonFile}`);
    rl.question('Now the base directory to start search. ',(baseDir)=>{
        //console.log(`${baseDir}`);
        traverse(jsonFile,baseDir);
        rl.close();
    });
  
});

