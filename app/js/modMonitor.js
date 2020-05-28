//this is to load audio, images or videos to dropdowns
let events = require('events');

function modMonitor(io) {

    this.addModeratorAction = function(myModeratorMonitor, dataIn, type) {
        modAction(myModeratorMonitor, dataIn, type)
            .then(function(data) {

                // need to ensure that the files don't duplicate
                //  io.emit('sendModeratorActionToBrowser', data);

                switch (data.action) {
                    case "delete":
                        //emit sends data to browser
                        io.emit('MixerModAction', data);
                        break;
                    case "timeout":
                        //emit sends data to browser
                        io.emit('MixerModAction', data);
                        break;
                    case "ban":
                        //emit sends data to browser
                        io.emit('MixerModAction', data);
                        break;
                    default:
                        break;
                }
                // return new fileOps.prototype.emit('sendFiles', data, type);
            })
            .catch((err) => console.log(err));
    };

    async function modAction(myModeratorMonitor, dataIn, type) {
        try {


            let file = null;

            var actionDate = new Date();
            var actionDateFull = actionDate.toDateString() + ' - ' + actionDate.toTimeString();

            switch (type) {
                case "delete":
                    file = await addDelete(myModeratorMonitor, dataIn, actionDateFull);
                    break;
                case "timeout":
                    file = await addModAction(myModeratorMonitor, dataIn, actionDateFull);
                    break;
                case "ban":
                    file = await addModAction(myModeratorMonitor, dataIn, actionDateFull);
                    break;
                default:
                    file = await addModAction(myModeratorMonitor, dataIn, actionDateFull);
                    break;
            }

            return file;

        } catch (err) { console.error(err) }
    };

    async function addDelete(myModeratorMonitor, fullcommand, actionDateFull) {

        var actionObject = new Object();
        actionObject.id = fullcommand.id + new Date().toTimeString();;
        actionObject.date = actionDateFull;
        actionObject.moderatorid = fullcommand.moderator.user_id;
        actionObject.moderatorname = fullcommand.moderator.user_name;
        actionObject.rolewho = fullcommand.moderator.user_roles[0];
        actionObject.action = "delete";
        actionObject.user = "";

        //push command to the file
        myModeratorMonitor.push("/modaction[]", actionObject, true);
        return actionObject;
    };

    async function addModAction(myModeratorMonitor, fullcommand, actionDateFull) {

        var actionObject = new Object();
        actionObject.id = fullcommand.user_id + new Date().toTimeString();
        actionObject.date = actionDateFull;
        actionObject.moderatorid = fullcommand.moderator.user_id;
        actionObject.moderatorname = fullcommand.moderator.user_name;
        actionObject.rolewho = fullcommand.moderator.user_roles[0];
        actionObject.action = fullcommand.cause.type;
        actionObject.user = fullcommand.user_id;

        //push command to the file
        myModeratorMonitor.push("/modaction[]", actionObject, true);
        return actionObject;
    };

}

modMonitor.prototype = new events.EventEmitter;
module.exports = modMonitor;