//this is to load audio, images or videos to dropdowns
let events = require('events');


function fileOps(io) {

    this.getFilesInSoundFolder = function(fs, folder) {
        myReaddir(fs, folder)
            .then(function(data) {

                // need to ensure that the files don't duplicate
                io.emit('sendSoundFilesToDropDown', data);
                // return new fileOps.prototype.emit('sendFiles', data, type);
            })
            .catch((err) => console.log(err));
    };

    this.getFilesInVideoFolder = function(fs, folder) {
        myReaddir(fs, folder)
            .then(function(data) {

                io.emit('sendVideoFilesToDropDown', data);
                // return new fileOps.prototype.emit('sendFiles', data, type);
            })
            .catch((err) => console.log(err));
    };

    this.getFilesInImageFolder = function(fs, folder) {
        myReaddir(fs, folder)
            .then(function(data) {
                io.emit('sendImageFilesToDropDown', data);
                // return new fileOps.prototype.emit('sendFiles', data, type);
            })
            .catch((err) => console.log(err));
    };

    this.sendCommandsToUI = function(userCommands) {
        //SendCommandListToBot(userCommands);
        io.emit('loadCommandsToList', userCommands);
    }

    this.sendMediaToUi = function(audioMedia, imageMedia, videoMedia) {

        io.emit('loadMediaToList', audioMedia, imageMedia, videoMedia);
    }

    this.sendHostAlertsToUI = function(data) {
        io.emit('hostalertlist', data);
    }

    this.sendFollowAlertsToUI = function(data) {
        io.emit('followalertlist', data);
    }


    this.sendKeywordsToUI = function(data) {
        io.emit('keywordlist', data);
    }

    this.sendNotesToUI = function(data) {
        io.emit('notelist', data);
    }

    this.sendTimersToUI = function(data) {
        io.emit('timerlist', data);
    }

    async function myReaddir(fs, folder) {
        try {
            const file = await fs.readdir(folder);

            return file;

        } catch (err) { console.error(err) }
    };


}

fileOps.prototype = new events.EventEmitter;
module.exports = fileOps;