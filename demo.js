const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Input json file path ', (jsonFile) => {
  // TODO: Log the answer in a database
  console.log(`${jsonFile}`);
    rl.question('Now the base directory to start search. ',(baseDir)=>{
        console.log(`${baseDir}`);
        rl.close();
    });
  
});