//this is to load audio, images or videos to dropdowns
let events = require('events');
//let log = require('electron-log');
var fs1 = require('mz/fs');

function fileOps(io, log) {

    this.getFilesInSoundFolder = function(fs, folder) {
        myReaddir(fs, folder)
            .then(function(data) {
                // need to ensure that the files don't duplicate
                io.emit('sendSoundFilesToDropDown', data);
                // return new fileOps.prototype.emit('sendFiles', data, type);
            })
            .catch((err) => log.error('get sound files ' + err));
    };

    this.getFilesInVideoFolder = function(fs, folder) {
        myReaddir(fs, folder)
            .then(function(data) {

                io.emit('sendVideoFilesToDropDown', data);
                // return new fileOps.prototype.emit('sendFiles', data, type);
            })
            .catch((err) => log.error('get video files error ' + err));
    };

    this.getFilesInImageFolder = function(fs, folder) {
        myReaddir(fs, folder)
            .then(function(data) {
                io.emit('sendImageFilesToDropDown', data);
                // return new fileOps.prototype.emit('sendFiles', data, type);
            })
            .catch((err) => log.error('getImages error '  + err));
    };

    this.getAllMedia = function(fs, AudioFolder, VideoFolder, ImageFolder) {


        setTimeout(() => {
            myReaddir(fs, AudioFolder).then(function(data) {

                    log.info(AudioFolder);
                    // need to ensure that the files don't duplicate
                    io.emit('sendSoundFilesToDropDown', data);

                    // return new fileOps.prototype.emit('sendFiles', data, type);
                })
                .catch((err) => log.info(err));
        }, 1000);


        setTimeout(() => {
            myReaddir(fs, VideoFolder).then(function(data) {

                    log.info(VideoFolder);
                    // need to ensure that the files don't duplicate
                    io.emit('sendVideoFilesToDropDown', data);

                    // return new fileOps.prototype.emit('sendFiles', data, type);
                })
                .catch((err) => log.error('sendVideoFilesToUI error ' + err));
        }, 2000);

        /*         myReaddir(fs, VideoFolder).then(function(data) {
                        log.info(VideoFolder);
                        io.emit('sendVideoFilesToDropDown', data);
                        // return new fileOps.prototype.emit('sendFiles', data, type);
                    })
                    .catch((err) => console.log(err)); */

        setTimeout(() => {
            myReaddir(fs, ImageFolder).then(function(data) {
                log.info(ImageFolder);
                io.emit('sendImageFilesToDropDown', data);
                // return new fileOps.prototype.emit('sendFiles', data, type);
            }).catch((err) => log.error('sendImageFilesToUI error ' + err));
        }, 3000);

        /*       myReaddir(fs, ImageFolder).then(function(data) {
                  log.info(ImageFolder);
                  io.emit('sendImageFilesToDropDown', data);
                  // return new fileOps.prototype.emit('sendFiles', data, type);
              }).catch((err) => console.log(err)); */

    }

    this.sendCommandsToUI = function(userCommands) {
        //SendCommandListToBot(userCommands);
        io.emit('loadCommandsToList', userCommands);
    };

    this.sendMediaToUi = function(audioMedia, imageMedia, videoMedia) {

        io.emit('loadMediaToList', audioMedia, imageMedia, videoMedia);
    };

    this.sendHostAlertsToUI = function(data) {
        io.emit('hostalertlist', data);
    };

    this.sendFollowAlertsToUI = function(data) {
        io.emit('followalertlist', data);
    };


    this.sendKeywordsToUI = function(data) {
        io.emit('keywordlist', data);
    }

    this.sendNotesToUI = function(data) {
        io.emit('notelist', data);
    }

    this.sendTimersToUI = function(data) {
        io.emit('timerlist', data);
    }


    this.sendCurrencyToUI = function(data) {
        io.emit('currencylist', data);
    }

    async function myReaddir(fs, folder) {
        try {
            const file = await fs1.readdir(folder);

            return file;

        } catch (err) {
            log.error('myReaddir error:  reading folder ' + err);
        }
    };


}

fileOps.prototype = new events.EventEmitter;
module.exports = fileOps;