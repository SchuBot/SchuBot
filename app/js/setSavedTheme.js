//this is to load audio, images or videos to dropdowns
let events = require('events');


function setSavedTheme(io) {

    this.testMethod = function(fs, folder) {
        myReaddir(fs, folder)
            .then(function(data) {

                // need to ensure that the files don't duplicate
                io.emit('sendSoundFilesToDropDown', data);
                // return new fileOps.prototype.emit('sendFiles', data, type);
            })
            .catch((err) => console.log(err));
    };


    this.sendThemeToUI = function(myUITheme) {
        io.emit('setDefaultTheme', myUITheme.data.uitheme[0]);
    }


    this.sendUIPreferences = function() {
        io.emit('setDefaultUIVisibility');
    }

    async function myReaddir(fs, folder) {
        try {
            const file = await fs.readdir(folder);

            return file;

        } catch (err) { console.error(err) }
    };


}

setSavedTheme.prototype = new events.EventEmitter;
module.exports = setSavedTheme;