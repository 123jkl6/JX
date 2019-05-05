# JX

Code is largely unchanged other than splitting traverse_with_json.js and email.js into different folders.

# Email

Email module is in the email folder.
Feel free to add html, images or file attachments in this module. TO do that, the input arguments need to change, and the traverse module needs to send over these attachments. 

# Traverse

traverse_with_json module is in the traverse folder. Modified it in such a way that it takes in the full json file path before any execution

# Main

The main.js file at the project root directory is the entry point. Here you will find the code is much shorter as the bulk of the work is managed by email and traverse modules. 

# Environment variables

Since it is not good practice to hard code credentails into source files. I have added script files where you can optionally set up environment variables like the host server, username and password, to be run as a Windows batch file. Alternatively, the same can be done in a shell script for linux. Input such variables into the script.bat and when completed, run.bat can be run.

