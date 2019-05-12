const traverse = require("./traverse/traverse");

//first input is json file path
//next input is base directory
//for me I use home, you can also use any other directory
traverse("/home/developer/json_for_directory/sample.json",process.env.HOME);