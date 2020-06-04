'use strict';

/* const { spawn } = require('child_process');
const dir = spawn('cmd', ['/c', 'dir'])

dir.stdout.on('data', data => console.log(`stdout: ${data}`));
dir.stderr.on('data', data => console.log(`stderr: ${data}`));
dir.on('close', code => console.log(`child process exited with code ${code}`)); */



//module
class install_postgres {
    constructor(log) {

        //exports
        this.runCommand = function() {

            //postgre binaries for windows 10
            //https://sbp.enterprisedb.com/getfile.jsp?fileid=12546


            //C:\Users\Schuster\Downloads (downloads folder)

            // var child = require('child_process').execFile;
            // var executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
            // var parameters = ["--mode unattended --superpassword 'password' --servicename 'postgreSQL' --servicepassword 'password' --serverport 4321"];

            // child(executablePath, parameters, function(err, data) {
            //     console.log(err)
            //     console.log(data.toString());
            // });



        };


    }
}

module.exports = install_postgres;