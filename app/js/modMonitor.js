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
                        io.emit('MixerDeleteMessage', data);
                        break;
                    case "PurgedOrTimeout":
                        //emit sends data to browser
                        io.emit('MixerPurgeOrTimeoutMessage', data);
                        break;

                    case "Ban":
                        //emit sends data to browser
                        io.emit('MixerPurgeMessageBan', data);
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
                case "PurgeOrTimeout":
                    file = await addPurgeTimeout(myModeratorMonitor, dataIn, actionDateFull);
                    break;
                case "ban":
                    file = await addBan(myModeratorMonitor, dataIn, actionDateFull);
                    break;
                default:
                    break;
            }



            return file;

        } catch (err) { console.error(err) }
    };

    async function addDelete(myModeratorMonitor, fullcommand, actionDateFull) {

        var actionObject = new Object();
        actionObject.id = fullcommand.id;
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


    async function addPurgeTimeout(myModeratorMonitor, fullcommand, actionDateFull) {




        var actionObject = new Object();
        actionObject.id = fullcommand.user_id + new Date().toTimeString();
        actionObject.date = actionDateFull;
        actionObject.moderatorid = fullcommand.moderator.user_id;
        actionObject.moderatorname = fullcommand.moderator.user_name;
        actionObject.rolewho = fullcommand.moderator.user_roles[0];
        actionObject.action = "PurgedOrTimeout";
        actionObject.user = fullcommand.user_id;


        //push command to the file
        myModeratorMonitor.push("/modaction[]", actionObject, true);
        return actionObject;
    };


    async function addBan(myModeratorMonitor, fullcommand, actionDateFull) {


        var actionObject = new Object();

        actionObject.id = fullcommand.user_id + '';
        actionObject.date = actionDateFull;
        actionObject.moderatorid = ""; //mixer doesn't provide who banned info
        actionObject.moderatorname = ""; //mixer doesn't provide who banned info
        actionObject.rolewho = ""; //mixer doesn't provide who banned info
        actionObject.action = "Ban";
        actionObject.user = fullcommand.user_id;


        //push command to the file
        myModeratorMonitor.push("/modaction[]", actionObject, true);
        return actionObject;
    };

}

modMonitor.prototype = new events.EventEmitter;
module.exports = modMonitor;