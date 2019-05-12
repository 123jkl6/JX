# json_for_directory

# json schema
This new schema is completely different as it doesn't try to replicate the tree of the file system like before. Instead, now there is a "check" object which contains all the files to be checked for and their respective keywords. With a much simpler schema, I am guessing this would be a lot easier to use and the programme would be less likely to crash. 

# User Input
1. The file path to the json file will be asked for, this is where all ninformation the keywords and files to be looked for will be found. 
2. The second input prompted is the base directory from which to start your search.
3. Alternatively, if keying in the inputs every time the programme is run is a chore, there is also the option of hardcoding the input direcly. Just go to main.js file and remove/comment all the lines prompting the use, and uncomment the traverse function and input the filepath and base directory there.

# Environment variables
The environment variables like before are roughly the same, now I added the username variable to suit your environment more. In addition, a script.sh is also added so that it can also be done on linux. 