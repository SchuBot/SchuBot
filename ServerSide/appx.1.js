(function() {
    //github access token for schubot 61ea34e9ffd423d3ebc9f5bf4ca19f43f7763c1c
    'use strict';
    const dateNow = Date.now();
    const beamchat = require('../app/js/mixerchatNew.js');
    const beamchatbot = require('../app/js/beamchatbot.js');
    const constellation = require('../app/js/constellation.js');
    const commandHandler = require('../app/js/commandHandler.js');
    const fileOps = require('../app/js/fileOps');
    const setSavedTheme = require('../app/js/setSavedTheme');
    const modMonitor = require('../app/js/modMonitor');
    const currencyManager = require('../app/js/currencyManager');
    const request = require("request");
    const colors = require('colors');
    // "beam-client-node": "^0.10.4",
    // "passport-beam": "^1.0.4",
    // "passport": "^0.3.2",
    // "passport-local": "~1.0.0",
    // "passport-mixer": "^1.0.1",
    //"node-windows": "^0.1.14",
    //"rethinkdb": "^2.3.3", 
    // "oauth-electron": "^1.1.1",
    // "electron-oauth-helper": "^3.0.0",
    // "electron-oauth2": "^3.0.0",
    //        "ejs": "latest",
    //var app = express();
    var port = process.env.PORT || 8081;
    //var r = require('rethinkdb');
    var config = require('../app/js/config.js');
    //let uiTheme = require('.app/jsconfig.js');
    var cookieParser = require('cookie-parser');
    // var session = require('express-session');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    // var passport = require('passport');
    var flash = require('connect-flash');
    const path = require('path');
    var JsonDB = require('node-json-db');
    ////const server = require('http').createServer(app);
    //var app = require('express').createServer();
    //var io = require('socket.io')(app);
    ////const io = require('socket.io')(server);
    var express = require('express');
    var appex = express();
    var server = require('http').createServer(appex);
    const io = require('socket.io')(server);
    var fs = require('mz/fs');
    // = 582310
    let streamerChannel = null;
    var bc;
    var bcBot;
    var co;
    var ch;
    let dbAlerts = new JsonDB("./app/jsondbfiles/myAlerts", true, true);
    let userCommands = new JsonDB("./app/jsondbfiles/myCommands", true, true);
    let myFollowAlerts = new JsonDB("./app/jsondbfiles/myFollowAlerts", true, true);
    let myHostAlerts = new JsonDB("./app/jsondbfiles/myHostAlerts", true, true);
    let myMedia = new JsonDB("./app/jsondbfiles/myMedia", true, true);
    let myTriggers = new JsonDB("./app/jsondbfiles/myTriggers", true, true);
    let currencyUsers = new JsonDB("./app/jsondbfiles/currencyUsers", true, true);
    let currencyUserTypes = new JsonDB("./app/jsondbfiles/currencyUserTypes", true, true);
    let currency = new JsonDB("./app/jsondbfiles/currency", true, true);
    let myTimers = new JsonDB("./app/jsondbfiles/myTimers", true, true);
    let myModeratorMonitor = new JsonDB("./app/jsondbfiles/myModeratorMonitor", true, true);
    let myNotes = new JsonDB("./app/jsondbfiles/myNotes", true, true);
    let myUITheme = new JsonDB("./app/jsondbfiles/myUITheme", true, true);
    let authDB = new JsonDB("./app/jsondbfiles/auth", true, true);
    //https://github.com/Belphemur/node-json-db this is info on jsondb
    dbAlerts.reload();
    userCommands.reload();
    myFollowAlerts.reload();
    myHostAlerts.reload();
    myMedia.reload();
    myTriggers.reload();
    currency.reload();
    currencyUsers.reload();
    currencyUserTypes.reload();
    myTimers.reload();
    myModeratorMonitor.reload();
    myNotes.reload();
    myUITheme.reload();
    authDB.reload();
    initializeData();
    let chatConnectedBot = false;
    let chatConnected = false;
    let timers = [];
    var globalFollowers = [];
    // this variable is to warn the caster only once about re-auth (could be improved)
    let unauthenticatedCounter = 0;
    //var followAlertList = [];
    const soundFolder = './views/media/sounds/';
    const videoFolder = './views/media/videos/';
    const imageFolder = './views/media/images/';
    const alertsoundFolder = '../media/sounds/';
    const alertvideoFolder = '../media/videos/';
    const alertimageFolder = '../media/images/';
    //timer data
    var someData = [];
    var dateIn = new Date();
    ////////////////////////////////var dateStringTest = getLetterFullDateTimeString(dateIn);
    ///////////////////////////////// console.log(dateStringTest);
    //require('../config/passport')(passport);
    appex.use(morgan('dev'));
    console.log(__dirname);
    var pathdir = __dirname.replace("ServerSide", "");
    appex.use(express.static(pathdir + '/public'));
    /////////////////////////////app.use(express.static(__dirname + '/public/build'));
    ///////////////////////////////////////app.use(express.static(__dirname + '/vendors'));
    // app.use(express.static(__dirname + '/views'));
    appex.use(express.static(pathdir + '/public/img'));
    //  app.set('views', path.join(__dirname, '/views'));
    appex.set('views', pathdir + '/views');
    appex.set('view engine', 'ejs');
    //console.log(JSON.stringify(passport));
    appex.use(cookieParser());
    appex.use(bodyParser.json());
    appex.use(bodyParser.urlencoded({ extended: false }));
    /*    app.use(session({
           secret: 'anystringoftext',
           saveUninitialized: true,
           resave: true
       })); */
    //app.use(passport.initialize());
    console.log('Server attempting to run: ' + port);
    //app.use(passport.session()); // persistent login sessions
    appex.use(flash()); // use connect-flash for flash messages stored in session
    require('../app/routes/routes.js')(appex);
    server.listen(port, function() {
        console.log(colors.magenta('Webserver Listening on port: ' + port));
    });
    //console.log(passport.GetAuthData);
    //socket.io stuff
    //sockets
    var connections = 0;
    var isConnected = false;
    // ../media/sounds/sound1.mp3 - sound path
    //../media/images/alert.gif - images path
    let sequenceNumberByClient = new Map();
    io.on('connection', function(socket) {
        // console.log('Auth Token is ' + xd);
        connections = connections + 1;
        socket.name = socket.id;
        console.info(`Client connected [id=${socket.id}]`);
        sequenceNumberByClient.set(socket, 1);
        /*   console.log('connected ' + connections + ' times');
           console.log('connected with', `${socket.name} IP: ${socket.handshake.address}`)
        */
        socket.on('disconnect', function() {
            sequenceNumberByClient.delete(socket);
            console.info(`Client gone [id=${socket.id}]`);
            //commented this out 04/09/2018
            socket.disconnect;
            //  console.log("Socket status:" + socket.connected);
        });
        socket.on('beamClient', function(client) {
            console.log('beamClient line 141 chatbot');
        });
        socket.on('message', function(message, sendType) {
            try {
                SendMessageToBeam(message, bc, bcBot, sendType);
            } catch (error) {
                console.log('error in main line 148 message event ' + error.message);
            }
        });
        socket.on('alertFinished', function(dateid, type) {
            try {
                //simply deletes the alert from the queue with the given name
                GetFirstOneAndDeletesIt(dbAlerts, dateid, type);
            } catch (error) {
                console.log('alertFinished event error ' + error.message);
            }
        });
        socket.on('alertCommandFinished', function(dateid, type) {
            try {
                GetFirstOneAndDeletesIt(dbAlerts, dateid, type);
            } catch (error) {
                console.log('error getting next alert in sequence');
            }
        });
        socket.on('saveUIThemeSetting', function(element, color) {
            try {
                saveUIThemeSetting(myUITheme, element, color);
            } catch (error) {
                console.log('error saving UI Theme Setting');
            }
        });
        socket.on('getNextAlertInList', function(message) {
            try {
                GetLastFromList(dbAlerts, message);
            } catch (error) {
                console.log('getNextAlertInList error ' + error.message);
            }
        });
        socket.on('error', function(message) {
            try {
                console.log('error in server websocket ' + message);
                // socket.join; //not sure why this is here
            } catch (error) {
                console.log('catch: error in server websocket' + error.message);
            }
        });
        socket.on('stopTimers', function(message) {
            try {
                //  stopAlltimers();
                stopAllTimersSchedule();
            } catch (message) {
                console.log('error stopping timers');
            }
        });
        socket.on('startTimers', function(message) {
            try {
                console.log('Starting timers');
                //addAlltimers(myTimers);
                addAlltimersSchedule(myTimers);
            } catch (error) {
                console.log('error starting timers');
            }
        });
        socket.on('addSaveCommand', function(cmdObject) {
            try {
                console.log('Saving UI Command');
                var commandExists = checkCommandUIExists(userCommands, cmdObject);
                if (commandExists.length == 0) {
                    processAddUICommand(cmdObject);
                    io.emit('addSaveSingleCommand', cmdObject);
                } else {
                    processEditUICommand(userCommands, cmdObject);
                    io.emit('addSaveSingleCommand', cmdObject);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error saving command');
            }
        });
        socket.on('deleteCommand', function(cmdObject) {
            try {
                console.log('Deleting UI Command');
                var commandExists = checkCommandUIExists(userCommands, cmdObject);
                if (commandExists.length > 0) {
                    var commandID = cmdObject.id;
                    deleteCommandFromList(userCommands, commandID);
                    io.emit("RemoveCommandFromTable", cmdObject.id.replace("!", "x"));
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error deleting command');
            }
        });
        socket.on('addSaveTrigger', function(cmdObject) {
            try {
                console.log('Saving UI Trigger');
                var commandExists = checkTriggerUIExists(myTriggers, cmdObject);
                if (commandExists.length == 0) {
                    processAddUITrigger(myTriggers, cmdObject);
                    io.emit('addSaveSingleTrigger', cmdObject);
                } else {
                    processEditUITrigger(myTriggers, cmdObject);
                    io.emit('addSaveSingleTrigger', cmdObject);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error saving trigger');
            }
        });
        socket.on('addSaveNote', function(cmdObject) {
            try {
                console.log('Saving UI Note');
                var commandExists = checkNoteUIExists(myNotes, cmdObject);
                if (commandExists.length == 0) {
                    processAddUINote(cmdObject);
                    io.emit('addSaveSingleNote', cmdObject);
                } else {
                    processEditUINote(myNotes, cmdObject);
                    io.emit('addSaveSingleNote', cmdObject);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error saving note');
            }
        });
        socket.on('deleteTrigger', function(cmdObject) {
            try {
                console.log('Deleting UI trigger');
                var commandExists = checkTriggerUIExists(myTriggers, cmdObject);
                if (commandExists.length > 0) {
                    deleteTriggerFromList(myTriggers, cmdObject);
                    io.emit("RemoveTriggerFromTable", cmdObject.id);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error deleting trigger - ' + error.message);
            }
        });
        socket.on('deleteNote', function(cmdObject) {
            try {
                console.log('Deleting UI Note');
                var commandExists = checkNoteUIExists(myNotes, cmdObject);
                if (commandExists.length > 0) {
                    deleteNoteFromList(myNotes, cmdObject);
                    io.emit("RemoveNoteFromTable", cmdObject.id);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error deleting note - ' + error.message);
            }
        });
        socket.on('completeNote', function(cmdObject) {
            try {
                console.log('Completing UI Note');
                var commandExists = checkNoteUIExists(myNotes, cmdObject);
                if (commandExists.length > 0) {
                    completeNoteFromList(myNotes, cmdObject);
                    io.emit('addSaveSingleNote', cmdObject);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error deleting note - ' + error.message);
            }
        });
        socket.on('addSaveTimer', function(cmdObject) {
            try {
                var commandExists = checkTimerUIExists(myTimers, cmdObject);
                if (commandExists.length == 0) {
                    console.log('Adding UI timer');
                    processAddUITimer(cmdObject);
                    io.emit('addSaveSingleTimer', cmdObject);
                } else {
                    console.log('Saving UI timer');
                    processEditUITimer(cmdObject);
                    io.emit('addSaveSingleTimer', cmdObject);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error saving timer - ' + error.message);
            }
        });
        socket.on('deleteTimer', function(cmdObject) {
            try {
                console.log('Deleting UI timer');
                var commandExists = checkTimerUIExists(myTimers, cmdObject);
                if (commandExists.length > 0) {
                    deleteTimerFromList(myTimers, cmdObject);
                    io.emit("RemoveTimerFromTable", cmdObject.id);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error deleting timer');
            }
        });
        socket.on('addEditAlert', function(objAlert) {
            try {
                console.log('Saving UI Alert');
                var alertExists = checkAlertUIExists(myHostAlerts, myFollowAlerts, objAlert);
                if (alertExists.length == 0) {
                    processAddUIAlert(objAlert);
                    io.emit('addSaveSingleAlert', objAlert);
                } else {
                    processEditUIAlert(myHostAlerts, myFollowAlerts, objAlert);
                    io.emit('addSaveSingleAlert', objAlert);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error saving alert - ' + error.message);
            }
        });
        socket.on('deleteAlert', function(cmdObject) {
            try {
                console.log('Deleting Alert Command');
                var alertExists = checkAlertUIExists(myHostAlerts, myFollowAlerts, cmdObject);
                if (alertExists.length > 0) {
                    deleteAlertFromList(myHostAlerts, myFollowAlerts, cmdObject);
                    io.emit("RemoveAlertFromTable", cmdObject);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error deleting alert ' + error.message);
            }
        });
        socket.on('addSaveMedia', function(cmdMedia) {
            try {
                console.log('Saving UI Media');
                var mediaExists = checkMediaUIExists(myMedia, cmdMedia);
                if (mediaExists.length == 0) {
                    processAddUIMedia(cmdMedia);
                } else {
                    processEditUIMedia(myMedia, cmdMedia);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error saving media');
            }
        });
        socket.on('TimeoutMixerUser', function(data) {
            try {
                console.log('timing out user');
                if (bc != null) {
                    bc.timeout(data);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error timing out user ' + error.message);
            }
        });
        socket.on('BanMixerUser', function(data) {
            try {
                console.log('ban user');
                if (bc != null) {
                    bc.ban(data.userid);
                }
                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                console.log('error timing out user ' + error.message);
            }
        });
        SendUIThemeToBot(myUITheme);
        LoadSoundFiles(soundFolder);
        LoadVideoFiles(videoFolder);
        LoadImageFiles(imageFolder);
        SendCommandListToBot(userCommands);
        SendMediaListToBot(myMedia);
        SendHostAlertsToBot(myHostAlerts);
        SendFollowAlertsToBot(myFollowAlerts);
        SendKeywordsToBot(myTriggers);
        SendNotesToBot(myNotes);
        SendTimersToBot(myTimers);
        ConnectToBeamAndConsellation();
        StartCurrency();
    });

    function deleteCommandFromList(userCommands, commandID) {
        for (var i = 0, len = userCommands.data.commands.length; i < len; i++) {
            //array = alertsinqueue and index = i
            var iii = userCommands.data.commands[i].id;
            if (iii == commandID) {
                userCommands.delete(("/commands[" + i + "]"));
                break;
            }
        }
    }

    function deleteTimerFromList(myTimers, cmdObject) {
        for (var i = 0, len = myTimers.data.timers.length; i < len; i++) {
            //array = alertsinqueue and index = i
            var iii = myTimers.data.timers[i].id;
            if (iii == cmdObject.id) {
                myTimers.delete(("/timers[" + i + "]"));
                break;
            }
        }
    }

    function deleteTriggerFromList(myTriggers, cmdObject) {
        for (var i = 0, len = myTriggers.data.triggers.length; i < len; i++) {
            //array = alertsinqueue and index = i
            var iii = myTriggers.data.triggers[i].id;
            if (iii == cmdObject.id) {
                myTriggers.delete(("/triggers[" + i + "]"));
                break;
            }
        }
    }

    function deleteNoteFromList(myNotes, cmdObject) {
        for (var i = 0, len = myNotes.data.notes.length; i < len; i++) {
            //array = alertsinqueue and index = i
            var iii = myNotes.data.notes[i].id;
            if (iii == cmdObject.id) {
                myNotes.delete(("/notes[" + i + "]"));
                break;
            }
        }
    }

    function deleteAlertFromList(myHostAlerts, myFollowAlerts, cmdObject) {
        var commandID = cmdObject.id;
        if (cmdObject.type == 'altAlertFollow') {
            for (var i = 0, len = myFollowAlerts.data.followalerts.length; i < len; i++) {
                //array = alertsinqueue and index = i
                var iii = myFollowAlerts.data.followalerts[i].id;
                if (iii == commandID) {
                    myFollowAlerts.delete(("/followalerts[" + i + "]"));
                    break;
                }
            }
        }
        if (cmdObject.type == 'altAlertHost') {
            for (var i = 0, len = myHostAlerts.data.hostalerts.length; i < len; i++) {
                //array = alertsinqueue and index = i
                var iii = myHostAlerts.data.hostalerts[i].id;
                if (iii == commandID) {
                    myHostAlerts.delete(("/hostalerts[" + i + "]"));
                    break;
                }
            }
        }
    }
    //name of test functions
    function getDayName(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    function getWeekDayName(dayStr) {
        switch (dayStr) {
            case 0:
                dayStr = 'Sunday'
                break;
            case 1:
                dayStr = 'Monday'
                break;
            case 2:
                dayStr = 'Tuesday'
                break;
            case 3:
                dayStr = 'Wednesday'
                break;
            case 4:
                dayStr = 'Thursday'
                break;
            case 5:
                dayStr = 'Friday'
                break;
            case 6:
                dayStr = 'Saturday'
                break;
        }
        return dayStr;
    }

    function getDateMonthName(monthStr) {
        switch (monthStr) {
            case 0:
                monthStr = 'January'
                break;
            case 1:
                monthStr = 'February'
                break;
            case 2:
                monthStr = 'March'
                break;
            case 3:
                monthStr = 'April'
                break;
            case 4:
                monthStr = 'May'
                break;
            case 5:
                monthStr = 'June'
                break;
            case 6:
                monthStr = 'July'
                break;
            case 7:
                monthStr = 'August'
                break;
            case 8:
                monthStr = 'September'
                break;
            case 9:
                monthStr = 'October'
                break;
            case 10:
                monthStr = 'November'
                break;
            case 11:
                monthStr = 'December'
                break;
            default:
                break;
        }
        return monthStr;
    }
    //
    function StartCurrency() {
        var cm = new currencyManager(io);
        cm.createTimers(currency, currencyUsers);
    }

    function initializeData() {
        // check for backup (set backup folder)
        //initially the json fiels will be empty so we need to populate the theme as a minimum
    }

    function ConnectToBeamAndConsellation() {
        if (!isConnected) {
            authDB.reload();
            CreateBeamObjects(authDB.data.streamer.accessToken, null, authDB.data.streamer.username, chatConnected, authDB.data.streamer.username, authDB.data.bot.username, globalFollowers);
            //console.log('streamer connected to socket ' + connections + ' times');
            /*       if (bc != null) {
                      console.log('getting client');
                      bc.getclient();
                  } */
            CreateBeamBotObjects(authDB.data.bot.accessToken, null, authDB.data.bot.username, chatConnectedBot, authDB.data.streamer.username, authDB.data.bot.username, authDB.data.streamer.channelId);
            initBeamData();
        } else {
            io.emit('authenticated', 'false');
            console.log('already connected');
            //initBeamData();
        }
    }
    //this sends list of file names down to page, need to add some stuff so that I can make this dynamic
    //function LoadFiles(folder, fileType) { ....
    //might want to send file type to just have one function on client side to load relevant element
    function LoadSoundFiles(folder) {
        var fsOps = new fileOps(io);
        fsOps.getFilesInSoundFolder(fs, folder);
    }
    //this sends list of file names down to page, need to add some stuff so that I can make this dynamic
    //function LoadFiles(folder, fileType) { ....
    //might want to send file type to just have one function on client side to load relevant element
    function LoadVideoFiles(folder) {
        var fsOps = new fileOps(io);
        fsOps.getFilesInVideoFolder(fs, folder);
    }

    function LoadImageFiles(folder) {
        var fsOps = new fileOps(io);
        fsOps.getFilesInImageFolder(fs, folder);
    }

    function SendCommandListToBot(userCommands) {
        var fsOps = new fileOps(io);
        fsOps.sendCommandsToUI(userCommands);
        //  io.emit('loadCommandsToList', userCommands);
    }

    function SetStreamerAuth() {
        //  authDB.push("/streamer",)
        authDB.push('/streamer/userid', "Schuster");
        var dataish = authDB.getData('/streamer');
    }

    function SendMediaListToBot(myMedia) {
        //splits media list into audio , image and video
        var audioMedia = myMedia.data.media.filter(function(item) { return (item.type == 'Audio'); });
        var imageMedia = myMedia.data.media.filter(function(item) { return (item.type == 'Image'); });
        var videoMedia = myMedia.data.media.filter(function(item) { return (item.type == 'Video'); });
        var fsOps = new fileOps(io);
        fsOps.sendMediaToUi(audioMedia, imageMedia, videoMedia);
        //  io.emit('loadCommandsToList', userCommands);
    }

    function SendUIThemeToBot(myUITheme) {
        var uiThemeSettings = new setSavedTheme(io);
        uiThemeSettings.sendThemeToUI(myUITheme);
        uiThemeSettings.sendUIPreferences();
    }

    function SendHostAlertsToBot(myHostAlerts) {
        var fsOps = new fileOps(io);
        fsOps.sendHostAlertsToUI(myHostAlerts.data.hostalerts);
        //  io.emit('loadCommandsToList', userCommands);
    }

    function SendFollowAlertsToBot(myFollowAlerts) {
        var fsOps = new fileOps(io);
        fsOps.sendFollowAlertsToUI(myFollowAlerts.data.followalerts);
        //  io.emit('loadCommandsToList', userCommands);
    }

    function SendKeywordsToBot(myTriggers) {
        var fsOps = new fileOps(io);
        fsOps.sendKeywordsToUI(myTriggers.data.triggers);
        //  io.emit('loadCommandsToList', userCommands);
    }

    function SendNotesToBot(myNotes) {
        var fsOps = new fileOps(io);
        fsOps.sendNotesToUI(myNotes.data.notes);
        //  io.emit('loadCommandsToList', userCommands);
    }

    function SendTimersToBot(myTimers) {
        var fsOps = new fileOps(io);
        fsOps.sendTimersToUI(myTimers.data.timers);
        //  io.emit('loadCommandsToList', userCommands);
    }

    function AddMonitorAction(myModeratorMonitor, data, type) {
        var modMon = new modMonitor(io);
        modMon.addModeratorAction(myModeratorMonitor, data, type);
    }

    function CreateBeamObjects(BBBToken, message, channelToken, chatConnected, streamerName, botName, globalFollowers) {
        if (BBBToken != null) {
            console.log(chatConnected);
            if (bc != null) {
                console.log('beam object found');
            } else {
                console.log('beam object not found')
                    //streamer object
                bc = new beamchat(BBBToken, chatConnected, globalFollowers);
                co = new constellation();
                ch = new commandHandler(channelToken);
                console.log('Authenticated To Beam');
                io.emit('authenticated');
                io.emit('loginaccounts', streamerName, botName);
                bc.on('FollowerCount', function(data) {
                    console.log('bc follower count emit');
                    io.emit('followerCount', data);
                });
                bc.on('FollowingCount', function(data) {
                    // console.info(data);
                    console.log('bc following count emit');
                    io.emit('followingCount', data);
                });
                bc.on('TriggerFollow', function(data) {
                    try {
                        console.log('Trigger Follow line 339 Chatbot beam js');
                        FollowEvent(data, alertsoundFolder, alertimageFolder, alertvideoFolder, myFollowAlerts);
                    } catch (error) {
                        console.log('error in mixer chat follow');
                    }
                });
                bc.on('ChatUserCount', function(data) {
                    console.log('bc chat user count');
                    io.emit('chatusercount', data);
                });
                bc.on('error', function(data) {
                    console.log('bc error');
                    console.log('bc error' + data.message);
                });
                bc.on('ChatMessage', function(data) {
                    sendMessageToChatWindow(data);
                });
                /*         bc.on('ChatMessage', function(data) {
                            User - A regular user. All Users have this.
                               Pro - A user who has an active Mixer Pro subscription will have this role.
                               Mod - A user will have this role if they are a moderator in the channel involved in this request.
                               GlobalMod - A user will have this role if they are a global moderator on Mixer.
                               Staff - A User will have this role if they are Mixer Staff.
                               Founder - A User will have this role if they are a Mixer Founder.
                               Owner - A user will have this role if they are the owner of the channel involved in this request. 
                            // console.info(colors.red(`ChatMessage`));
                            // console.info(colors.red(JSON.stringify(data)));
                            if (data.user_level == undefined) {
                                //console.info(`${data.user_name}` + ' has no Level Defined')
                            } else {
                                //  console.info(`${data.user_name}` + ' is level ' + `${data.user_level}` + 'and is a ' + `${data.user_roles[0]}`)
                            }
                            let UserName = data.user_name;
                            let t = '';
                            for (key in data.message.message) {
                                t += data.message.message[key].text;
                            }
                            //send message to client window
                            io.emit('message', UserName + ' [' + data.user_roles[0] + '] - ' + t);
                            /// TODO add these in db and fetch when triggered
                            var splitTxt = '';
                            for (key in data.message.message) { splitTxt += data.message.message[key].text; };
                            var text = splitTxt.split(' ');
                            if (text[0].substr(0, 1) == "!") {
                                //send to commandHandler to determine what to send to mixer
                                processChatCommand(userCommands, text[0], data.user_roles, UserName, ch, channelToken, t);
                            } else {
                                //processes triggers
                                var outputArray = [];
                                //reload triggers in case they have been changed
                                myTriggers.reload();
                                // triggers to output
                                myTriggers.data.triggers.forEach(element => {
                                    var isTriggerWord = t.includes(element.id, 0);
                                    if (isTriggerWord) {
                                        //also check that the chat message isn't exactly as per the trigger output
                                        if (t != element.output) {
                                            outputArray.push(element.output);
                                        }
                                    }
                                });
                                //now send each message to mixer (add first , last , all options in configuration)
                                outputArray.forEach(element => {
                                    var triggerResult = sendTriggerToMixer(bcBot, element);
                                });
                            }
                        });
                 */
                co.on('event', function(data) {
                    // console.log(colors.green(data.type));
                    //if(bl.isNew()){}
                    switch (data.type) {
                        case ('update'):
                            console.info('constellation update: ' + JSON.stringify(data));
                            io.emit('update', data);
                            break;
                        case ('followed'):
                            console.log('A user has followed ' + JSON.stringify(data, null, 2));
                            if (data.info.following == true) {
                                // if (bl.check(data.info.user.username) == false) {
                                //    bc.say(`User ${data.info.user.username} Followed the Channel! `)
                                //io.emit('followed', data);
                                io.emit('followed', data);
                                try {
                                    console.log('Constellation Follow Alert');
                                    //const soundFolder = './views/media/sounds/';
                                    //const gfxFolder = './views/media/graphics/';
                                    //const imageFolder = './views/media/images/';
                                    // images = list of images 
                                    // sounds = list of sounds
                                    // followGfx = list of gfx
                                    //  io.emit('followed', data);
                                    //this adds the follow to an alert queue
                                    //, images, sounds, followGfx
                                    FollowEvent(data, alertsoundFolder, alertimageFolder, alertvideoFolder, myFollowAlerts);
                                } catch (error) {
                                    console.log('error in mixer chat follow');
                                }
                                //  }
                            } else {
                                sendTriggerToMixer(bcBot, `User ${data.info.user.username} UnFollowed the Channel!`);
                                // bcBot.say(`User ${data.info.user.username} UnFollowed the Channel!`)
                                io.emit('unfollowed', data);
                            }
                            break;
                        case ('hosted'):
                            if (data.info.hoster != null) { //user is hosting you
                                console.log(data.info.hoster.token);
                            }
                            if (data.info.hostee != null) { //user is being hosted
                            }
                            //console.log(data.info); //hoster/hostee for possibles.
                            //  if (bl.check(data.info.hoster.token) == false) {
                            HostEvent(data, alertsoundFolder, alertimageFolder, alertvideoFolder, myHostAlerts);
                            bcBot.say(`User ${data.info.hoster.token} hosted  the Channel! `);
                            console.log(data.info.hoster.viewersCurrent);
                            io.emit('hosted', data);
                            //    }
                            break;
                        case ('subscribed'):
                            console.log(data.info);
                            io.emit('subscribed', data);
                            break;
                        case ('resubscribed'):
                            console.log(data.info);
                            io.emit('resubscribed', data);
                            break;
                        default: //dont trigger anything.
                            console.log(data.info);
                            break;
                    }
                });
                ch.on('CommandData', function(data) {
                    // io.emit('message', UserName + ' [' + data.user_roles[0] + '] - ' + t);
                    if (chatConnectedBot) {
                        bcBot.say(data);
                    } else {
                        bc.say(data);
                    }
                });
            }
        } else {
            io.emit('unauthenticated', 'false');
            console.log('Not Authenticated');
        }
    };

    function CreateBeamBotObjects(BBBTokenBot, message, channelToken, chatConnected, streamerName, botName, streamerChannel, globalFollowers) {
        console.log('is Connected ?' + isConnected);
        if (BBBTokenBot != null) {
            if (bcBot != null) {
                console.log('mixer bot object is not null');
            } else {
                console.log('mixer bot object is null');
                bcBot = new beamchatbot(BBBTokenBot, chatConnected, streamerChannel);
                console.log('Authenticated To Beam');
                bcBot.on('error', function(data) {
                    console.log('bc Bot error');
                    console.log('bc Bot error' + data.message);
                });
                //when a user is modded/banned etc
                bcBot.on('UserUpdate', function(data) {
                    console.info('A user update has happened: ' + JSON.stringify(data))
                });
                bcBot.on('UserTimeout', function(data) {
                    //not sent by mixer chat api atm
                    console.info('A user has been timed out: ' + JSON.stringify(data))
                });
                //when a user clears the chat
                bcBot.on('ClearMessages', function(data) {
                    console.info('A user has cleared chat: ' + JSON.stringify(data))
                        //data.clearer
                    io.emit('MixerMessagesCleared', data);
                });
                bcBot.on('PurgeOrTimeoutMessage', function(data) {
                    console.info('A user has purged/timedout someone: ' + JSON.stringify(data))
                    AddMonitorAction(myModeratorMonitor, data, "PurgeOrTimeout");
                });
                bcBot.on('DeleteMessage', function(data) {
                    //add row to db
                    data.moderator.user_roles[0]; //role of person deleting
                    data.moderator.user_id; //id of person deleting
                    data.moderator.user_name; //name of person deleting
                    console.info('Message Deleted: ' + JSON.stringify(data))
                    AddMonitorAction(myModeratorMonitor, data, "delete");
                });
                //mixer does not provide information of who banned the user at the moment
                bcBot.on('UserBanned', function(data) {
                    console.info('A user has been banned: ' + JSON.stringify(data))
                    AddMonitorAction(myModeratorMonitor, data, "ban");
                    //data.clearer
                });
                bcBot.on('UserJoin', function(data) {
                    let UserName = data.username;
                    //   io.emit('message', UserName + ' [' + data.roles[0] + ']' + ' - has Joined The Channel !!!!!!!!');
                    //io.emit('followed', data);
                    console.log('User: ' + data.username + ' has joined the channel');
                    if (data.roles[0] !== undefined) {
                        io.emit('UserJoined', UserName + ' - ' + data.roles[0] + ' - ' + data.id);
                    } else {
                        io.emit('UserJoined', UserName + ' - ' + 'No Role Defined' + ' - ' + data.id);
                    }
                });
                bcBot.on('UserLeave', function(data) {
                    ///console.log(colors.red(`UserPart`));
                    console.log('User: ' + data.username + ' has left the channel');
                    let UserName = data.username;
                    //  io.emit('message', UserName + ' [' + data.roles[0] + ']' + ' - has Left The Channel :( :( :(');
                    //io.emit('followed', data);
                    console.log(JSON.stringify(data));
                    if (data.roles[0] !== undefined) {
                        io.emit('UserPart', UserName + ' - ' + data.roles[0] + ' - ' + data.id);
                    } else {
                        io.emit('UserPart', UserName + ' - ' + 'No Role Defined' + ' - ' + data.id);
                    }
                });
                bcBot.on('ChatMessage', function(data) {
                    sendMessageToChatWindow(data);
                });
            }
        } else {
            io.emit('unauthenticatedBot', 'false');
            console.log('Bot Not Authenticated');
        }
    };

    function sendMessageToChatWindow(data) {
        /*   User - A regular user. All Users have this.
                       Pro - A user who has an active Mixer Pro subscription will have this role.
                       Mod - A user will have this role if they are a moderator in the channel involved in this request.
                       GlobalMod - A user will have this role if they are a global moderator on Mixer.
                       Staff - A User will have this role if they are Mixer Staff.
                       Founder - A User will have this role if they are a Mixer Founder.
                       Owner - A user will have this role if they are the owner of the channel involved in this request. */
        // console.info(colors.red(`ChatMessage`));
        // console.info(colors.red(JSON.stringify(data)));
        if (data.user_level == undefined) {
            //console.info(`${data.user_name}` + ' has no Level Defined')
        } else {
            //  console.info(`${data.user_name}` + ' is level ' + `${data.user_level}` + 'and is a ' + `${data.user_roles[0]}`)
        }
        let UserName = data.user_name;
        let t = '';
        for (var key in data.message.message) {
            t += data.message.message[key].text;
        }
        //send message to client window
        // io.emit('message', UserName + ' [' + data.user_roles[0] + '] - ' + t );
        //send message to client window better version
        io.emit('message', data.user_avatar, data.user_roles[0], data.user_name, t);
        /// TODO add these in db and fetch when triggered
        var splitTxt = '';
        for (var key in data.message.message) { splitTxt += data.message.message[key].text; };
        var text = splitTxt.split(' ');
        if (text[0].substr(0, 1) == "!") {
            //send to commandHandler to determine what to send to mixer
            processChatCommand(userCommands, text[0], data.user_roles, UserName, ch, t, bc);
        } else {
            //processes triggers
            var outputArray = [];
            //reload triggers in case they have been changed
            myTriggers.reload();
            // triggers to output
            myTriggers.data.triggers.forEach(element => {
                var isTriggerWord = t.includes(element.id, 0);
                if (isTriggerWord) {
                    //also check that the chat message isn't exactly as per the trigger output
                    if (t != element.text) {
                        outputArray.push(element.text);
                    }
                }
            });
            //now send each message to mixer (add first , last , all options in configuration)
            outputArray.forEach(element => {
                var triggerResult = sendTriggerToMixer(bcBot, element);
            });
        }
    }
    //change this to be either bot or streamer (this sends timers also)
    function SendMessageToBeam(message, bc, bcBot, sendType) {
        switch (sendType) {
            case "bot":
                sendMixerMessage(message, sendType, null, bcBot);
                break;
            case "streamer":
                sendMixerMessage(message, sendType, bc, null);
                break;
            default:
                break;
        }
    }

    function sendMixerMessage(message, sendType, bc, bcBot) {
        if (sendType == "streamer") {
            if (bc == null) {
                console.log('Beam disconnected Could not send message please Authenticate: - ' + message);
                //we don't want to emit unauthenticated more than once.
                unauthenticatedCounter = unauthenticatedCounter + 1;
                if (unauthenticatedCounter < 2) {
                    io.emit('unauthenticated', 'false');
                }
            } else {
                unauthenticatedCounter = 0;
                bc.say(message);
            }
        } else {
            if (bcBot == null) {
                console.log('Beam disconnected Could not send message please Authenticate: - ' + message);
                //we don't want to emit unauthenticated more than once.
                unauthenticatedCounter = unauthenticatedCounter + 1;
                if (unauthenticatedCounter < 2) {
                    io.emit('unauthenticated', 'false');
                }
            } else {
                unauthenticatedCounter = 0;
                bcBot.say(message);
            }
        }
    }
    //change this to be either bot or streamer
    function sendTriggerToMixer(bcBot, message) {
        try {
            var returnResult = bcBot.botSay(message);
        } catch (error) {
            console.log("trigger error" + error.message);
        } finally {}
        return returnResult;
    }

    function checkFollowerName(bc, userName) {
        var userExist = bc.doesFollowerExist(userName);
        return userExist;
    }
    //processes command an emits message to mixer
    function processChatCommand(CommandList, command, user_roles, username, ch, fullcommand, bc) {
        try {
            //need to work out a way to find the command possibly using underscore
            // var data = CommandList.getData(`/commands/id:['${[command]}']`); ///id${command}
            // $user = username
            // $random = select random chat user
            // $gfx = play gfx
            // $sfx = play sound
            // $perms = permissions
            // $specPerm = specific permission(s)
            // get command triggered search for command in json db
            // get $variables
            // make $variables list
            // user's role vs command's role
            // user specific ?  vs user triggering
            // if gfx and sound effect then queue command alert
            // if gfx only then queue gfx command  
            // if sound then queue sound
            // if text only then send back to chat
            // var wanted = CommandList.data.filter(function(CommandList.data) { return (CommandList.data.id == 'test'); });
            //checks to see if the command is in the list
            var commandInDB = CommandList.data.commands.filter(function(item) { return (item.id == command); });
            //if command exists then check permissions and process command
            if (commandInDB.length > 0) {
                // is command in db ?
                console.log('command found: permission is: ' + commandInDB[0].permission);
                //is user allowed to use command ?
                var userAllowed = isUserPermitted(commandInDB[0].permission, commandInDB[0].user, username, user_roles, bc); // get command's permission and return true is user is allowed otherwise false
                if (userAllowed) {
                    // process command and send to mixer
                    ch.say(username, commandInDB, user_roles, command, fullcommand);
                    //queue alert
                    //graphicsFolder, soundFolder, videoFolder, graphicFile, soundFile, videoFile
                    CommandAlertEvent(commandInDB[0], username, alertvideoFolder, alertsoundFolder, alertimageFolder);
                    //this will process over the follow and other alerts so will not work
                    //process the audio and video if present in command
                    /*                 var commandType = GetCommandAudioVideoVariables(commandInDB[0]);
                                    switch (commandType) {
                                        case ('0'): //text only
                                            // do nothing as command is already sent to mixer as normal
                                            break;
                                        case ('1'): //audio and image
                                            playCommandAudioImage(commandInDB[0]);
                                            break;
                                        case ('2'): //audio only
                                            playCommandAudio(commandInDB[0].audio);
                                            break;
                                        case ('3'): //video only
                                            playCommandVideo(commandInDB[0].video);
                                            break;
                                        case ('4'): //image only
                                            playCommandImage(commandInDB[0]);
                                            break;
                                        default: //this shouldn't be triggered as it is impossible to not have at least one of three variables
                                            break;
                                    } */
                } else {
                    // whisper user not allowed to run this command 
                    // have a setting to set whispers on or off TODO
                    // ch.say(username, commandInDB, user_roles, command, fullcommand);
                }
            }
            // otherwise check if its a command that should trigger a CRUD operation
            else {
                //command not in db now check if command is to add or remove existing command
                let CRUDType = CRUDCommandCategory(command);
                //this processes the CRUD commands
                switch (CRUDType) {
                    case 'Add':
                        processAddCommand(CommandList, fullcommand);
                        break;
                    case 'Edit':
                        processEditCommand(CommandList, fullcommand);
                        break;
                    case 'Delete':
                        processRemoveCommand(CommandList, fullcommand);
                        break;
                    default:
                        break;
                }
                return false;
            }
        } catch (error) {
            // The error will tell you where the DataPath stopped. In this case test1
            // Since /test1/test does't exist.
            console.log('command ' + command + ' not found');
            return false;
        };
    }
    //this edits the command
    function processEditCommand(CommandList, fullcommand) {
        //need to work on feedback what happens if its successfull / unsuccessfull
        var commandToCheckFor = checkCommandExists(CommandList, fullcommand);
        if (commandToCheckFor.length > 0) {
            let commandToEdit = getCommandToAddEditDel(fullcommand);
            for (var i = 0, len = CommandList.data.commands.length; i < len; i++) {
                var iii = CommandList.data.commands[i];
                if (iii != undefined) {
                    if (iii.id == commandToEdit) {
                        var cmd = new CommandObject(fullcommand);
                        // cmd.cenabled
                        CommandList.data.commands[i].permission = cmd.cpermission;
                        CommandList.data.commands[i].user = cmd.cuser;
                        CommandList.data.commands[i].audio = cmd.caudio;
                        CommandList.data.commands[i].video = cmd.cvideo;
                        CommandList.data.commands[i].image = cmd.cimage;
                        CommandList.data.commands[i].text = cmd.ctext;
                        CommandList.data.commands[i].cooldown = cmd.ccooldown;
                        CommandList.data.commands[i].enabled = cmd.cenabled; //command edits can't disable or enable commands
                        CommandList.save();
                        // db.delete(("/commands[" + i + "]"));    
                    }
                }
            }
        }
    }

    function processRemoveCommand(CommandList, fullcommand) {
        //need to work on feedback what happens if its successfull / unsuccessfull
        var commandToCheckFor = checkCommandExists(CommandList, fullcommand);
        if (commandToCheckFor.length > 0) {
            let commandToRemove = getCommandToAddEditDel(fullcommand);
            for (var i = 0, len = CommandList.data.commands.length; i < len; i++) {
                //array = alertsinqueue and index = i
                var iii = CommandList.data.commands[i];
                if (iii != undefined) {
                    if (iii.id == commandToRemove) {
                        CommandList.delete(("/commands[" + i + "]"));
                    }
                }
            }
        }
    }

    function processAddUICommand(fullcommand) {
        var PermsForCommand = transformUIPermsToCommandPerms(fullcommand.permission);
        var commandUser = "";
        if (fullcommand.user != undefined) {
            commandUser = fullcommand.user;
            fullcommand.user = SpecificUser;
        }
        var SpecificUser = "";
        if (PermsForCommand == "+u") {
            SpecificUser = commandUser;
        }
        fullcommand.user = SpecificUser;
        fullcommand.permission = PermsForCommand
        fullcommand.enabled = fullcommand.enabled;
        //push command to the file
        userCommands.push("/commands[]", fullcommand, true);
    }

    function processAddUITrigger(myTriggers, fullcommand) {
        fullcommand.option1 = "";
        fullcommand.option2 = "";
        //push command to the file
        myTriggers.push("/triggers[]", fullcommand, true);
    }

    function processAddUINote(myNotes, fullcommand) {
        //push command to the file
        myNotes.push("/notes[]", fullcommand, true);
    }

    function processAddUITimer(fullcommand) {
        fullcommand.option1 = "";
        //push command to the file
        myTimers.push("/timers[]", fullcommand, true);
    }

    function processAddUIMedia(mediaObject) {
        /* 
   // this is for commands so media cna only be added by owner for now
        var PermsForCommand = transformUIPermsToCommandPerms(fullcommand.permission);
        var cmdEnabled = transformUIEnableToCommandEnabled(fullcommand.enabled);
        var commandUser = "";
        if (fullcommand.user != undefined) {
            commandUser = fullcommand.user;
            fullcommand.user = SpecificUser;
        }
        var SpecificUser = "";
        if (PermsForCommand == "+u") {
            SpecificUser = commandUser;
        }
        fullcommand.user = SpecificUser;
        fullcommand.permission = PermsForCommand
        fullcommand.enabled = cmdEnabled;
     */
        //push media to the file
        myMedia.push("/media[]", mediaObject, true);
        //add media to commands panel
    }

    function processAddUIAlert(alertObject) {
        if (alertObject.type == 'altAlertHost') {
            myHostAlerts.push("/hostalerts[]", alertObject, true);
        }
        if (alertObject.type == 'altAlertFollow') {
            myFollowAlerts.push("/followalerts[]", alertObject, true);
        }
    }

    function processEditUIAlert(myHostAlerts, myFollowAlerts, alertObject) {
        //need to work on feedback what happens if its successfull / unsuccessfull
        let alertToEdit = getAlertToAddEditDelUI(alertObject);
        if (alertObject.type == 'altAlertFollow') {
            // myHostAlerts.push("/hostalerts[]", mediaObject, true);
            for (var i = 0, len = myFollowAlerts.data.followalerts.length; i < len; i++) {
                var iii = myFollowAlerts.data.followalerts[i];
                if (iii != undefined) {
                    if (iii.id == alertToEdit) {
                        var mediaEnabled = transformUIEnableToCommandEnabled(alertObject.enabled);
                        myFollowAlerts.data.followalerts[i].id = alertObject.id;
                        myFollowAlerts.data.followalerts[i].type = alertObject.type;
                        myFollowAlerts.data.followalerts[i].audio = alertObject.audio;
                        myFollowAlerts.data.followalerts[i].video = alertObject.video;
                        myFollowAlerts.data.followalerts[i].image = alertObject.image;
                        myFollowAlerts.data.followalerts[i].text = alertObject.text;
                        /* myHostAlerts.data.hostalerts[i].audiodur = mediaObject.audiodur;
                        myHostAlerts.data.hostalerts[i].videodur = mediaObject.videodur;
                        myHostAlerts.data.hostalerts[i].imagedur = mediaObject.imagedur; */
                        myFollowAlerts.data.followalerts[i].enabled = mediaEnabled; //command edits can't disable or enable commands
                        myFollowAlerts.save();
                        // db.delete(("/commands[" + i + "]"));    
                    }
                }
            }
            return;
        }
        if (alertObject.type == 'altAlertHost') {
            for (var i = 0, len = myHostAlerts.data.hostalerts.length; i < len; i++) {
                var iii = myHostAlerts.data.hostalerts[i];
                if (iii != undefined) {
                    if (iii.id == alertToEdit) {
                        var mediaEnabled = transformUIEnableToCommandEnabled(alertObject.enabled);
                        myHostAlerts.data.hostalerts[i].id = alertObject.id;
                        myHostAlerts.data.hostalerts[i].type = alertObject.type;
                        myHostAlerts.data.hostalerts[i].audio = alertObject.audio;
                        myHostAlerts.data.hostalerts[i].video = alertObject.video;
                        myHostAlerts.data.hostalerts[i].image = alertObject.image;
                        myHostAlerts.data.hostalerts[i].text = alertObject.text;
                        /*  myHostAlerts.data.hostalerts[i].audiodur = mediaObject.audiodur;
                            myHostAlerts.data.hostalerts[i].videodur = mediaObject.videodur;
                            myHostAlerts.data.hostalerts[i].imagedur = mediaObject.imagedur; */
                        myHostAlerts.data.hostalerts[i].enabled = mediaEnabled; //command edits can't disable or enable commands
                        myHostAlerts.save();
                        // db.delete(("/commands[" + i + "]"));    
                    }
                }
            }
            return;
        }
    }
    //this edits the command
    function processEditUICommand(userCommands, fullcommand) {
        //need to work on feedback what happens if its successfull / unsuccessfull
        let commandToEdit = getCommandToAddEditDelUI(fullcommand);
        for (var i = 0, len = userCommands.data.commands.length; i < len; i++) {
            var iii = userCommands.data.commands[i];
            if (iii != undefined) {
                if (iii.id == commandToEdit) {
                    //  var cmd = new CommandObject(fullcommand);
                    // cmd.cenabled
                    var commandUser = "";
                    if (fullcommand.user != undefined) {
                        commandUser = fullcommand.user;
                    }
                    var PermsForCommand = transformUIPermsToCommandPerms(fullcommand.permission);
                    var SpecificUser = "";
                    if (PermsForCommand == "+u") {
                        SpecificUser = commandUser;
                    }
                    userCommands.data.commands[i].id = fullcommand.id;
                    userCommands.data.commands[i].permission = PermsForCommand;
                    userCommands.data.commands[i].user = SpecificUser;
                    userCommands.data.commands[i].audio = fullcommand.audio;
                    userCommands.data.commands[i].video = fullcommand.video;
                    userCommands.data.commands[i].image = fullcommand.image;
                    userCommands.data.commands[i].text = fullcommand.text;
                    userCommands.data.commands[i].cooldown = ""; //not in use atm
                    userCommands.data.commands[i].enabled = fullcommand.enabled; //command edits can't disable or enable commands
                    userCommands.save();
                    // db.delete(("/commands[" + i + "]"));    
                }
            }
        }
    }

    function processEditUITrigger(myTriggers, fullcommand) {
        //need to work on feedback what happens if its successfull / unsuccessfull
        let commandToEdit = getTriggerToAddEditDelUI(fullcommand);
        for (var i = 0, len = myTriggers.data.triggers.length; i < len; i++) {
            var iii = myTriggers.data.triggers[i];
            if (iii != undefined) {
                if (iii.id == commandToEdit) {
                    myTriggers.data.triggers[i].id = fullcommand.id;
                    myTriggers.data.triggers[i].text = fullcommand.text;
                    myTriggers.data.triggers[i].enabled = fullcommand.enabled; //command edits can't disable or enable commands
                    myTriggers.data.triggers[i].option1 = fullcommand.option1;
                    myTriggers.data.triggers[i].option2 = fullcommand.option2;
                    myTriggers.save();
                    // db.delete(("/commands[" + i + "]"));    
                }
            }
        }
    }

    function processEditUINote(fullcommand) {
        //need to work on feedback what happens if its successfull / unsuccessfull
        let commandToEdit = getNoteToAddEditDelUI(fullcommand);
        for (var i = 0, len = myNotes.data.notes.length; i < len; i++) {
            var iii = myNotes.data.notes[i];
            if (iii != undefined) {
                if (iii.id == commandToEdit) {
                    myNotes.data.notes[i].id = fullcommand.id;
                    myNotes.data.notes[i].note = fullcommand.note;
                    myNotes.data.notes[i].todo = fullcommand.todo;
                    myNotes.save();
                    // db.delete(("/commands[" + i + "]"));    
                }
            }
        }
    }

    function completeNoteFromList(myNotes, fullcommand) {
        //need to work on feedback what happens if its successfull / unsuccessfull
        let commandToEdit = getNoteToAddEditDelUI(fullcommand);
        for (var i = 0, len = myNotes.data.notes.length; i < len; i++) {
            var iii = myNotes.data.notes[i];
            if (iii != undefined) {
                if (iii.id == commandToEdit) {
                    myNotes.data.notes[i].todo = "N";
                    myNotes.save();
                    return;
                    // db.delete(("/commands[" + i + "]"));    
                }
            }
        }
    }

    function processEditUITimer(fullcommand) {
        //need to work on feedback what happens if its successfull / unsuccessfull
        let commandToEdit = getTimerToAddEditDelUI(fullcommand);
        for (var i = 0, len = myTimers.data.timers.length; i < len; i++) {
            var iii = myTimers.data.timers[i];
            if (iii != undefined) {
                if (iii.id == commandToEdit) {
                    myTimers.data.timers[i].id = fullcommand.id;
                    myTimers.data.timers[i].enabled = fullcommand.enabled; //command edits can't disable or enable commands
                    myTimers.data.timers[i].text = fullcommand.text;
                    myTimers.data.timers[i].interval = fullcommand.interval;
                    myTimers.data.timers[i].option1 = fullcommand.option1;
                    myTimers.save();
                    // db.delete(("/commands[" + i + "]"));    
                }
            }
        }
    }

    function processEditUIMedia(myMedia, mediaObject) {
        //need to work on feedback what happens if its successfull / unsuccessfull
        let mediaToEdit = getMediaToAddEditDelUI(mediaObject);
        for (var i = 0, len = myMedia.data.media.length; i < len; i++) {
            var iii = myMedia.data.media[i];
            if (iii != undefined) {
                if (iii.id == mediaToEdit) {
                    var mediaEnabled = transformUIEnableToCommandEnabled(mediaObject.enabled);
                    myMedia.data.media[i].id = mediaObject.id;
                    myMedia.data.media[i].type = mediaObject.type;
                    myMedia.data.media[i].audio = mediaObject.audio;
                    myMedia.data.media[i].video = mediaObject.video;
                    myMedia.data.media[i].image = mediaObject.image;
                    myMedia.data.media[i].audiodur = mediaObject.audiodur;
                    myMedia.data.media[i].videodur = mediaObject.videodur;
                    myMedia.data.media[i].imagedur = mediaObject.imagedur;
                    myMedia.data.media[i].enabled = mediaEnabled; //command edits can't disable or enable commands
                    myMedia.save();
                    // db.delete(("/commands[" + i + "]"));    
                }
            }
        }
    }

    function convertUIPermissionType(permissionType) {
        switch (permissionType) {
            case "+m":
                return "Mod";
            case "+v":
                return "User";
            case "+o":
                return "Owner";
            case "+f":
                return "Follower"; //not implemented yet
            case "+s":
                return "Subscriber";
            case "+u":
                return "User Specific"; //these are user specific ones
            default:
                return "User";
        }
    }

    function transformUIPermsToCommandPerms(commandPermissions) {
        switch (commandPermissions) {
            case "Mod":
                return "+m";
            case "Viewer":
                return "+v";
            case "Owner":
                return "+o";
            case "Follower":
                return "+f";
            case "Subscriber":
                return "+s";
            case "User":
                return "+u";
            default:
                return "+v";
        }
    }

    function transformUIEnableToCommandEnabled(commandEnabled) {
        /*      <option value="Mod" >Mod</option>
                <option value="Viewer">Viewer</option>
                <option value="Owner">Owner</option>
                <option value="Follower">Follower</option>
                <option value="Subscriber">Subscriber</option>
                <option value="User">User Specific</option> */
        switch (commandEnabled) {
            case "true":
                return "Y";
            case "false":
                return "N";
            default:
                return commandEnabled;
        }
    }

    function checkCommandUIExists(userCommands, fullcommand) {
        var commandExists = userCommands.data.commands.filter(function(item) { return (item.id == fullcommand.id); });
        //if exists it returns the command if not the length of var = 0
        return commandExists;
    }

    function checkTriggerUIExists(myTriggers, fullcommand) {
        var commandExists = myTriggers.data.triggers.filter(function(item) { return (item.id == fullcommand.id); });
        //if exists it returns the command if not the length of var = 0
        return commandExists;
    }

    function checkNoteUIExists(myNotes, fullcommand) {
        var commandExists = myNotes.data.notes.filter(function(item) { return (item.id == fullcommand.id); });
        //if exists it returns the command if not the length of var = 0
        return commandExists;
    }

    function checkTimerUIExists(myTimers, fullcommand) {
        var commandExists = myTimers.data.timers.filter(function(item) { return (item.id == fullcommand.id); });
        //if exists it returns the command if not the length of var = 0
        return commandExists;
    }

    function checkMediaUIExists(myMedia, mediaObject) {
        //TODO
        var commandExists = myMedia.data.media.filter(function(item) { return (item.id == mediaObject.id); });
        //if exists it returns the command if not the length of var = 0
        return commandExists;
    }

    function checkAlertUIExists(myHostAlerts, myFollowAlerts, alertObject) {
        var commandExists = "";
        if (alertObject.type == 'altAlertHost') {
            commandExists = myHostAlerts.data.hostalerts.filter(function(item) { return (item.id == alertObject.id); });
        }
        if (alertObject.type == "altAlertFollow") {
            commandExists = myFollowAlerts.data.followalerts.filter(function(item) { return (item.id == alertObject.id); });
        }
        //if exists it returns the command if not the length of var = 0
        return commandExists;
    }

    function processAddCommand(CommandList, fullcommand) {
        //need to work on feedback what happens if its successfull / unsuccessfull
        var commandToCheckFor = checkCommandExists(CommandList, fullcommand);
        //if length = 0 then command does not exist therefore we can add it
        if (commandToCheckFor.length == 0) {
            var cmd = new CommandObject(fullcommand);
            var commandObject = {
                id: cmd.cid,
                permission: cmd.cpermission,
                user: cmd.cuser,
                audio: cmd.caudio,
                video: cmd.cvideo,
                image: cmd.cvideo,
                text: cmd.ctext,
                cooldown: cmd.ccooldown,
                enabled: cmd.cenabled
            };
            //push command to the file
            CommandList.push("/commands[]", commandObject, true);
        }
    }

    function processAddNote(myNotes, fullcommand) {
        //need to work on feedback what happens if its successfull / unsuccessfull
        var commandToCheckFor = checkCommandExists(myNotes, fullcommand);
        //if length = 0 then command does not exist therefore we can add it
        if (commandToCheckFor.length == 0) {
            var cmd = new CommandObject(fullcommand);
            var commandObject = {
                id: cmd.cid,
                permission: cmd.cpermission,
                user: cmd.cuser,
                audio: cmd.caudio,
                video: cmd.cvideo,
                image: cmd.cvideo,
                text: cmd.ctext,
                cooldown: cmd.ccooldown,
                enabled: cmd.cenabled
            };
            //push command to the file
            CommandList.push("/commands[]", commandObject, true);
        }
    }

    function checkCommandExists(CommandList, fullcommand) {
        var commandSplit = fullcommand.split(' ');
        var commandExists = CommandList.data.commands.filter(function(item) { return (item.id == commandSplit[1]); });
        //if exists it returns the command if not the length of var = 0
        return commandExists;
    }
    //getCommandNameFromChatCommand
    function getCommandToAddEditDel(fullcommand) {
        var commandSplit = fullcommand.split(' ');
        return commandSplit[1];
    }

    function getCommandToAddEditDelUI(fullcommand) {
        var commandName = fullcommand.id;
        return commandName;
    }

    function getTriggerToAddEditDelUI(fullcommand) {
        var commandName = fullcommand.id;
        return commandName;
    }

    function getNoteToAddEditDelUI(fullcommand) {
        var commandName = fullcommand.id;
        return commandName;
    }

    function getTimerToAddEditDelUI(fullcommand) {
        var commandName = fullcommand.id;
        return commandName;
    }

    function getMediaToAddEditDelUI(mediaObject) {
        var mediaId = mediaObject.id;
        return mediaId;
    }

    function getAlertToAddEditDelUI(mediaObject) {
        var mediaId = mediaObject.id;
        return mediaId;
    }

    function isUserPermitted(permissionType, specificUser, userThatRunCommand, user_roles, bc) {
        //bool has permission?
        var isAllowed = false;
        permissionType = convertUIPermissionType(permissionType);
        //if command is specific check username
        if (permissionType == 'User Specific') {
            if (specificUser == userThatRunCommand) {
                isAllowed = true;
                return isAllowed;
            }
        } else {
            for (var i = 0, len = user_roles.length; i < len; i++) {
                var userRole = user_roles[i];
                if (userRole == 'Owner') {
                    isAllowed = true;
                    return isAllowed;
                }
                if (userRole == permissionType) {
                    isAllowed = true;
                    return isAllowed;
                }
                if (permissionType == "Follower") {
                    var isUserfollowing = checkFollowerName(bc, userThatRunCommand);
                    if (isUserfollowing != undefined) {
                        if (isUserfollowing.length > 0) {
                            isAllowed = true;
                            return isAllowed;
                        }
                    }
                }
            }
        }
        return isAllowed;
    }

    function CRUDCommandCategory(command) {
        let CRUDType = false;
        switch (command) {
            case ('!CommandAdd'):
                CRUDType = 'Add';
                break;
            case ('!CommandEdit'):
                CRUDType = 'Edit';
                break;
            case ('!CommandDel'):
                CRUDType = 'Delete';
                break;
            default:
                CRUDType = 'None';
                break;
        }
        return CRUDType;
    }

    function CRUDNotesCategory(command) {
        let CRUDType = false;
        switch (command) {
            case ('!NotesAdd'):
                CRUDType = 'Add';
                break;
            case ('!NotesEdit'):
                CRUDType = 'Edit';
                break;
            case ('!NotesDel'):
                CRUDType = 'Delete';
                break;
            default:
                CRUDType = 'None';
                break;
        }
        return CRUDType;
    }
    // this is for party queue not used atm but need to implement properly
    function AddUserToJoinGame(message) {
        fs.readFile('./views/chatusers/users.json', 'utf-8', function(err, data) {
            if (err) throw err
            var arrayOfObjects = JSON.parse(data);
            arrayOfObjects.users.push({
                firstName: "one",
                lastName: "Test"
            });
            arrayOfObjects.users.push({
                firstName: "two",
                lastName: "Test"
            });
            console.log(arrayOfObjects);
            fs.writeFile('./views/chatusers/users.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
                if (err) throw err
                console.log('AddUserToJoinGame in chatbotbeam2.js Done!')
            });
        });
    }

    function randomNumberFrom1(maxNumber) {
        return Math.floor((Math.random() * maxNumber) + 1).toString();
    }

    function randomNumberFrom0(maxNumber) {
        return Math.floor((Math.random() * maxNumber));
    }

    function FollowEvent(data, audioFolder, imageFolder, videoFolder, myFollowAlerts) {

        let UserName = data.info.user.username;
        let user_id = data.info.user.id;
        //randomize the alert number
        var randomAlertNumber = randomNumberFrom0(myFollowAlerts.data.followalerts.length);
        var imagePath = myFollowAlerts.data.followalerts[randomAlertNumber].image;
        var audioPath = myFollowAlerts.data.followalerts[randomAlertNumber].audio;
        var videoPath = myFollowAlerts.data.followalerts[randomAlertNumber].video;
        var followText = myFollowAlerts.data.followalerts[randomAlertNumber].text;
        if (imagePath.length > 0) {
            var imageFileName = myMedia.data.media.filter(function(item) { return (item.type == 'Image' && item.id == imagePath); });
            imagePath = imageFolder + imageFileName[0].image; // commandInDB.image
            //   imagePath = imageFolder + imagePath;
        }
        if (audioPath.length > 0) {
            var audioFileName = myMedia.data.media.filter(function(item) { return (item.type == 'Audio' && item.id == audioPath); });
            audioPath = audioFolder + audioFileName[0].audio; //commandInDB.audio
            //  audioPath = audioFolder + audioPath;
        }
        if (videoPath.length > 0) {
            var videoFileName = myMedia.data.media.filter(function(item) { return (item.type == 'Video' && item.id == videoPath); });
            videoPath = videoFolder + videoFileName[0].video; //commandInDB.video
            //  videoPath = videoFolder + videoPath
        }
        var AVElements = {
            image: imagePath,
            sound: audioPath,
            video: videoPath,
            followText: followText
        };
        var playType = GetAlertsAudioVideoVariables(AVElements);

        var alertMsg = {
            dateid: new Date().toString() + Math.floor((Math.random() * 100) + 1).toString(),
            commandName: "",
            user_id: user_id.toString(),
            userName: UserName,
            image: AVElements.image,
            sound: AVElements.sound,
            video: AVElements.video,
            following: "Y",
            type: "follow",
            play: playType,
            text: AVElements.followText
        };
        try {
            console.log('follow event triggered');
            //valid alert
            if (playType > 0) {
                addAlertToDB(dbAlerts, alertMsg);
            }

        } catch (error) {
            console.log('error in follow message in chatbotbeam2.js' + error);
        }
    }

    function HostEvent(data, audioFolder, imageFolder, videoFolder, myHostAlerts) {

        let UserName = ""
        if (data.info == undefined) {
            UserName = "UserNotFound";
        } else {
            UserName = data.info.hoster.token;
        }
        //randomize the alert number
        var randomAlertNumber = randomNumberFrom0(myHostAlerts.data.hostalerts.length);
        var imagePath = myHostAlerts.data.hostalerts[randomAlertNumber].image;
        var audioPath = myHostAlerts.data.hostalerts[randomAlertNumber].audio;
        var videoPath = myHostAlerts.data.hostalerts[randomAlertNumber].video;
        var hostText = myHostAlerts.data.hostalerts[randomAlertNumber].text;
        if (imagePath.length > 0) {
            var imageFileName = myMedia.data.media.filter(function(item) { return (item.type == 'Image' && item.id == imagePath); });
            imagePath = imageFolder + imageFileName[0].image; // commandInDB.image
            //   imagePath = imageFolder + imagePath;
        }
        if (audioPath.length > 0) {
            var audioFileName = myMedia.data.media.filter(function(item) { return (item.type == 'Audio' && item.id == audioPath); });
            audioPath = audioFolder + audioFileName[0].audio; //commandInDB.audio
            //  audioPath = audioFolder + audioPath;
        }
        if (videoPath.length > 0) {
            var videoFileName = myMedia.data.media.filter(function(item) { return (item.type == 'Video' && item.id == videoPath); });
            videoPath = videoFolder + videoFileName[0].video; //commandInDB.video
            //  videoPath = videoFolder + videoPath
        }
        var AVElements = {
            image: imagePath,
            sound: audioPath,
            video: videoPath,
            hostText: hostText
        };
        var playType = GetAlertsAudioVideoVariables(AVElements);

        var alertMsg = {
            dateid: new Date().toString() + Math.floor((Math.random() * 100) + 1).toString(),
            commandName: "",
            user_id: "No ID on host",
            userName: UserName,
            image: AVElements.image,
            sound: AVElements.sound,
            video: AVElements.video,
            following: "",
            type: "host",
            play: playType,
            text: AVElements.hostText
        };
        try {
            console.log('host event triggered');
            //valid alert
            if (playType > 0) {
                addAlertToDB(dbAlerts, alertMsg);
            }

        } catch (error) {
            console.log('error in follow message in chatbotbeam2.js' + error);
        }
    }

    function CommandAlertEvent(commandInDB, UserName, videoFolder, soundFolder, imageFolder) {

        var imagePath = "";
        var audioPath = "";
        var videoPath = "";
        if (commandInDB.image.length > 0) {
            //get file name from myMedia
            var imageFileName = myMedia.data.media.filter(function(item) { return (item.type == 'Image' && item.id == commandInDB.image); });
            imagePath = imageFolder + imageFileName[0].image; // commandInDB.image
        }
        if (commandInDB.audio.length > 0) {
            var audioFileName = myMedia.data.media.filter(function(item) { return (item.type == 'Audio' && item.id == commandInDB.audio); });
            audioPath = soundFolder + audioFileName[0].audio; //commandInDB.audio
        }
        if (commandInDB.video.length > 0) {
            var videoFileName = myMedia.data.media.filter(function(item) { return (item.type == 'Video' && item.id == commandInDB.video); });
            videoPath = videoFolder + videoFileName[0].video; //commandInDB.video
        }
        var playType = GetCommandAudioVideoVariables(commandInDB);
        var alertMsg = {
            dateid: new Date().toString() + Math.floor((Math.random() * 100) + 1).toString(),
            command_name: commandInDB.id,
            user_id: "",
            userName: UserName,
            image: imagePath,
            sound: audioPath,
            video: videoPath, //"../media/videos/sound1.mp3",
            following: "",
            type: "commandAlert",
            play: playType,
            text: ""
        };
        try {
            console.log('command event triggered');
            //valid command (something to play)
            if (playType > 0) {
                addAlertToDB(dbAlerts, alertMsg);
            }

        } catch (error) {
            console.log('error in follow message in chatbotbeam2.js' + error);
        }
    }
    //need to work on this one (for both alerts and commands 
    // for alerts it just deletes the first alert with the persons name which is not necessarily the correct alert 
    //and commands does nothing as the userName variable is null
    // need to compile a data object with dateid and type (alert , commandAlert) to ensure it deletes the correct one
    function GetFirstOneAndDeletesIt(dbAlerts, dateidIn, typeIn) {
        //item in json deletion
        //  dbAlerts.delete("/alerts" + userName);
        //array item deletion
        //gets entire array
        var alertsInQueue = dbAlerts.data.alerts;
        if (alertsInQueue != undefined) {
            for (var i = 0, len = alertsInQueue.length; i < len; i++) {
                //array = alertsinqueue and index = i
                var iii = alertsInQueue[i];
                var string = "/alerts[" + i + "]"
                    //gets the correct alert and removes it from the pile
                if (iii != undefined) {
                    if (iii.dateid == dateidIn) {
                        dbAlerts.delete(string);
                    }
                }
            }
        }
    };
    //save UI Theme setting
    function saveUIThemeSetting(myUITheme, element, color) {
        console.log('Saving Theme');
        var iii = myUITheme.data.uitheme[0];
        if (iii != undefined) {
            let uiSaveResult = false;
            switch (element) {
                case "outside":
                    myUITheme.data.uitheme[0].outside = color;
                    myUITheme.save();
                    uiSaveResult = true;
                    //myUITheme.data.theme
                    //return saved event to UI so save is confirmed, not an alert box but a toast of some sort.
                    break;
                case "inside":
                    myUITheme.data.uitheme[0].inside = color;
                    myUITheme.save();
                    uiSaveResult = true;
                    break;
                case "searchbg":
                    myUITheme.data.uitheme[0].searchbg = color;
                    myUITheme.save();
                    uiSaveResult = true;
                    break;
                case "bgcolor":
                    myUITheme.data.uitheme[0].bgcolor = color;
                    myUITheme.save();
                    uiSaveResult = true;
                    break;
                case "panelheadertextcolor":
                    myUITheme.data.uitheme[0].panelheadertextcolor = color;
                    myUITheme.save();
                    uiSaveResult = true;
                    break;
                case "buttontextcolor":
                    myUITheme.data.uitheme[0].buttontextcolor = color;
                    myUITheme.save();
                    uiSaveResult = true;
                    break;
                case "buttoncolor":
                    myUITheme.data.uitheme[0].buttoncolor = color;
                    myUITheme.save();
                    uiSaveResult = true;
                    break;
                case "combocolour":
                    myUITheme.data.uitheme[0].combocolour = color;
                    myUITheme.save();
                    uiSaveResult = true;
                    break;
                case "combotextcolor":
                    myUITheme.data.uitheme[0].combotextcolor = color;
                    myUITheme.save();
                    uiSaveResult = true;
                    break;
                default:
                    break;
            }
            if (uiSaveResult) {
                io.emit('uisaveresult', true);
            } else {
                io.emit('uisaveresult', false);
            }
        }
    };
    //last in list is the oldest alert so it triggers as first in first out
    function GetLastFromList(dbAlerts, message) {
        //item in json deletion
        //  dbAlerts.delete("/alerts" + userName);
        //array item deletion
        //gets entire array
        var alertsInQueue = dbAlerts.data.alerts;
        if (alertsInQueue != undefined) {
            if (alertsInQueue.length > 0) {
                //array = alertsinqueue and index = i
                var LastItem = alertsInQueue[alertsInQueue.length - 1];
                if (LastItem.type == "follow") {
                    io.emit('playAlert', LastItem);
                }
                if (LastItem.type == "host") {
                    io.emit('playAlert', LastItem);
                }
                if (LastItem.type == "commandAlert") {
                    io.emit('playCommand', LastItem);
                }
            }
        }
    };
    //not used atm to see if I can use the alert queueing system
    function GetCommandAudioVideoVariables(commandInDB) {
        var audioFile = "";
        var videoFile = "";
        var imageFile = "";
        var type = 0;
        if (commandInDB.audio.length > 0) {
            audioFile = commandInDB.audio;
        }
        if (commandInDB.video.length > 0) {
            videoFile = commandInDB.video
        }
        if (commandInDB.image.length > 0) {
            imageFile = commandInDB.image
        }
        // audio and video (not possible)
        if (audioFile.length > 0 && videoFile.length > 0 && imageFile.length == 0) {
            type = 0;
        }
        // audio , video and image
        else if (audioFile.length > 0 && videoFile.length > 0 && imageFile.length && 0) {
            type = 0;
        }
        // audio and image
        else if (audioFile.length > 0 && videoFile.length == 0 && imageFile.length > 0) {
            type = 1;
        }
        // audio only 
        else if (audioFile.length > 0 && videoFile.length == 0 && imageFile.length == 0) {
            type = 2;
        }
        //  video only
        else if (audioFile.length == 0 && videoFile.length > 0 && imageFile.length == 0) {
            type = 3;
        }
        // image only
        else if (audioFile.length == 0 && videoFile.length == 0 && imageFile.length > 0) {
            type = 4;
        } else {
            type = 0;
        }
        return type;
    }

    function GetAlertsAudioVideoVariables(alert) {
        var audioFile = "";
        var videoFile = "";
        var imageFile = "";
        var type = 0;
        if (alert.sound.length > 0) {
            audioFile = alert.sound;
        }
        if (alert.video.length > 0) {
            videoFile = alert.video
        }
        if (alert.image.length > 0) {
            imageFile = alert.image
        }
        // audio and video (not possible)
        if (audioFile.length > 0 && videoFile.length > 0 && imageFile.length == 0) {
            type = 0;
        }
        // audio , video and image
        else if (audioFile.length > 0 && videoFile.length > 0 && imageFile.length && 0) {
            type = 0;
        }
        // audio and image
        else if (audioFile.length > 0 && videoFile.length == 0 && imageFile.length > 0) {
            type = 1;
        }
        // audio only 
        else if (audioFile.length > 0 && videoFile.length == 0 && imageFile.length == 0) {
            type = 2;
        }
        //  video only
        else if (audioFile.length == 0 && videoFile.length > 0 && imageFile.length == 0) {
            type = 3;
        }
        // image only
        else if (audioFile.length == 0 && videoFile.length == 0 && imageFile.length > 0) {
            type = 4;
        } else {
            type = 0;
        }
        return type;
    }
    //this initialises all the data for the bot
    function initBeamData() {
        if (bc != null) {
            bc.getStreamerFollows(authDB.data.streamer.userId);
            bc.getfollowers(authDB.data.streamer.channelId);
            bc.getChatUsers(authDB.data.streamer.channelId);
            someData = ["potato", "carrot"];
            // addAlltimers(myTimers);
            addAlltimersSchedule(myTimers);
        } else {
            //no connection to mixer
        }
        //addTimers(someData)
        /*    for (var i in someData) {
                var item = someData[i];
                employees.accounting.push({
                    "firstName": item.firstName,
                    "lastName": item.lastName,
                    "age": item.age
                });
            }*/
    };

    function addAlertToDB(dbAlerts, alertMSG) {
        //adds item to queue
        var alertsInQueue = Object.keys(dbAlerts.getData("/alerts")).length;
        console.log("Alerts in queue: " + alertsInQueue);
        //add to queue
        dbAlerts.push("/alerts[]", alertMSG, true);
    };

    function addTimers(someData) {
        var tensecs = 20000;
        var counter = 0;
        var msgtxt = "test"; //document.querySelector('#timer');
        // var myVar = setInterval(function(){waiting(argument)}, 1000);
        for (var i in someData) {
            counter = counter + 1
            tensecs = tensecs + tensecs
            startTimer(msgtxt + counter, tensecs);
        }
    };

    function startTimer(message, duration) {
        // var timer = duration,
        //   minutes, seconds;
        setInterval(function() {
            SendMessageToBeam(message, bc, bcBot, "streamer");
        }, duration);
    };
    // function addAlltimers(myTimers) {
    //     timers.length = 0;
    //     myTimers.reload();
    //     var message = "";
    //     var duration = 1000;
    //     for (var timerCnt = 0, len = myTimers.data.timers.length; timerCnt < len; timerCnt++) {
    //         message = myTimers.data.timers[timerCnt].text;
    //         duration = myTimers.data.timers[timerCnt].interval;
    //         addToArray(message, duration);
    //     };
    // };
    function addAlltimersSchedule(myTimers) {
        myTimers.reload();
        if (myTimers.data.timers != undefined) {
            var intervalCooldown = 0;
            for (var timerCnt = 0, len = myTimers.data.timers.length; timerCnt < len; timerCnt++) {
                var duration2 = myTimers.data.timers[timerCnt].interval;
                let textForTimer = myTimers.data.timers[timerCnt].text;
                //add minute to duration e.g. if timer is 5 minutes and its the 3rd timer this will be 8 minutes
                duration2 = duration2 + intervalCooldown;
                //the boolean at the end false = repeat , true = once
                Scheduler.add(function(myTimers) { SendMessageToBeam(textForTimer, bc, bcBot, "streamer") }, null, duration2 / 10, true);
                //interval between timers 
                //(first timer doesn't have an interval because interval increments after add is called)
                intervalCooldown = intervalCooldown + 60000; //hardcoded to 1 minute for now
            };
        }
    }

    function addToArray(message, duration) {
        /*     timers.push(setTimeout(function run() {
                console.log("adding timer" + message);
                SendMessageToBeam(message);
                setTimeout(run, duration);
            }, duration)); */
        timers.push(
            setInterval(function() {
                SendMessageToBeam(message, bc, bcBot, "bot");
            }, duration)
        );
    }
    // function stopAlltimers() {
    //     for (var i = 0; i < timers.length; i++) {
    //         clearInterval(timers[i]);
    //     }
    //     timers.length = 0;
    //     //  timers = null;
    // };
    function stopAllTimersSchedule() {
        Scheduler.halt()
    }

    function getLetterFullDateTimeString(dateIn) {
        var dayWeek = getWeekDayName(dateIn.getDay());
        var dayNo = getDayName(dateIn.getDate());
        var monthName = getDateMonthName(dateIn.getMonth());
        var yearstr = dateIn.getFullYear();
        var hoursValue = dateIn.getHours() + ':' + dateIn.getMinutes() + ':' + dateIn.getSeconds();
        return dayWeek + ' ' + dayNo + ' ' + monthName + ' ' + yearstr + ' ' + hoursValue;
    }
    //TODO do like 07-Mar-2018 11:10:02
    function getFullDateTimeString(dateIn) {
        //var i = new Date();
        var datetimeString = "";
        var dayWeek = getWeekDayName(dateIn.getDay());
        var dayNo = getDayName(dateIn.getDate());
        var monthName = getDateMonthName(dateIn.getMonth());
        var yearstr = dateIn.getFullYear();
        var hoursValue = dateIn.getHours() + ':' + dateIn.getMinutes() + ':' + dateIn.getSeconds();
        console.log(dayWeek);
        console.log(dayNo);
        console.log(monthName);
        return dayweek + ' ' + dayNo + ' ' + monthName + ' ' + yearstr + ' ' + hoursValue;
    }
    class CommandObject {
        constructor(data) {
                var objt = BuildCommand(data);
                //TODO build command object from chat command
                this.cid = objt.cid;
                this.cpermission = objt.cpermission;
                if (objt.cuser == undefined) {
                    objt.cuser = "";
                }
                this.cuser = objt.cuser;
                this.caudio = objt.caudio;
                this.cvideo = objt.cvideo;
                this.cimage = objt.cimage;
                this.ctext = objt.ctext;
                this.ccooldown = objt.ccooldown; //not in use at present
                this.cenabled = objt.cenabled; //always enable by default
            }
            /* sayHi() {
                 alert(this.name);
             } */
    }
    class NoteObject {
        constructor(data) {
                var objt = BuildCommand(data);
                //TODO build command object from chat command
                this.cid = objt.cid;
                this.cpermission = objt.cpermission;
                if (objt.cuser == undefined) {
                    objt.cuser = "";
                }
                this.cuser = objt.cuser;
                this.caudio = objt.caudio;
                this.cvideo = objt.cvideo;
                this.cimage = objt.cimage;
                this.ctext = objt.ctext;
                this.ccooldown = objt.ccooldown; //not in use at present
                this.cenabled = objt.cenabled; //always enable by default
            }
            /* sayHi() {
                 alert(this.name);
             } */
    }
    //this will work for both edit and add commands via chat
    function BuildCommand(data) {
        var dataCopy = data;
        //sets the api number
        var specialVarsCount = 0;
        var cName = "";
        var cPerms = ""; //dataCopy.split(' ')[2];
        var cgfx = "";
        var csfx = "";
        var cimg = "";
        var cUser = "";
        var commandText = ""; // this is the text that goes in the text property in command object
        var commandVariables = dataCopy.split(' ');
        if (commandVariables[0].substr(0, 1) == "!") {
            //valid commandadd name
            commandVariables.shift();
        }
        if (commandVariables[0].substr(0, 1) == "!") {
            //valid command name
            cName = commandVariables[0];
            commandVariables.shift();
        }
        if (commandVariables[0].substr(0, 1) == "+") {
            //valid perms
            cPerms = commandVariables[0];
            commandVariables.shift();
        }
        //!CommandAdd!commandName +m
        // $channelInfo$target[$target has $sparks sparks and is a level $level]
        // $caster has been on
        // for $uptime
        // $gfx(gfx.gif)
        // $sfx(audio.mp3)
        // $img(img.png)
        //join to make datacopy hold the command variables, we will then remove special stuff from command variables
        dataCopy = commandVariables.join(' ');
        //gets special variables in brackets
        var specialVariablesArray = dataCopy.match(/ *\[[^\]]*]/g);
        specialVariablesArray.forEach(element => {
            commandVariables = dataCopy.replace(/ *\[[^\]]*]/, '');
        });
        /*     if (cName.substr(0, 1) == "!") {
                //valid command name
            }
            if (cPerms.substr(0, 1) == "+") {
                //valid command name
            } */
        commandVariables = commandVariables.split(' ');
        //join again after removing special variables so commandvariables now have sfx , gfx , img and text
        for (var i = 0, len = commandVariables.length; i < len; i++) {
            commandText = commandText + commandVariables[i] + ' ';
        }
        commandText = commandText.replace(/  +/g, ' ');
        var commandObjectJson = {
            cid: cName,
            cpermission: cPerms,
            ctext: commandText,
            cenabled: "Y"
        };
        return commandObjectJson;
    };

    function SaveAuth(data) {
        userInfo("streamer", data.access_token, data.refresh_token, null)
        console.log('test');
    }

    function userInfo(type, accessToken, refreshToken, authedForClips = false) {
        authDB.reload();
        // Request user info and save out everything to auth file.
        request({
            url: 'https://mixer.com/api/v1/users/current',
            auth: {
                'bearer': accessToken
            }
        }, function(err, res) {
            let data = JSON.parse(res.body);
            let otherType = type.toLowerCase() === "bot" ? "streamer" : "bot";
            //let otherLoggedIn = service.accounts[otherType].isLoggedIn;
            // let otherUsername = service.accounts[otherType].username;
            let otherLoggedIn = false;
            let otherUsername = type;
            if (otherLoggedIn && otherUsername === data.username) {
                //  utilityService.showErrorModal('You cannot sign into the same account for both Streamer and Bot. The bot account should be a seperate account. If you dont have a seperate account, simply dont use the Bot account feature, it is not required.');
            } else {
                // Push all to db.
                authDB.push('./' + type + '/username', data.username);
                authDB.push('./' + type + '/userId', data.id);
                authDB.push('./' + type + '/channelId', data.channel.id);
                authDB.push('./' + type + '/avatar', data.avatarUrl);
                authDB.push('./' + type + '/accessToken', accessToken);
                authDB.push('./' + type + '/refreshToken', refreshToken);
                authDB.push('./' + type + '/authedForClips', authedForClips === true);
                // Request channel info
                // We do this to get the sub icon to use in the chat window.
                request({
                    url: 'https://mixer.com/api/v1/channels/' + data.username
                }, function(err, res) {
                    let data = JSON.parse(res.body);
                    // Push all to db.
                    if (data.partnered === true) {
                        authDB.push('./' + type + '/subBadge', data.badge.url);
                    } else {
                        authDB.push('./' + type + '/subBadge', false);
                    }
                    if (type === "streamer") {
                        authDB.push('./' + type + '/partnered', data.partnered);
                        //service.accounts.streamer.partnered = data.partnered;
                        let groups = data.user.groups;
                        let canClip = groups.some(g =>
                            g.name === "Partner " ||
                            g.name === "VerifiedPartner" ||
                            g.name === "Staff" ||
                            g.name === "Founder");
                        //service.accounts.streamer.canClip = canClip;
                        authDB.push('./' + type + '/canClip', canClip);
                    }
                    // Style up the login page.
                    /*                $q.resolve(true, () => {
                                       service.loadLogin();
                                       $rootScope.showSpinner = false;
                                   }); */
                });
            }
        });
    }
    //need a permission (i.e. who is allowed to add note and a note type (i.e. private,public))
    function BuildNote(data) {
        var dataCopy = data;
        var cName = "";
        var cPerms = ""; //dataCopy.split(' ')[2];
        var cUser = "";
        var commandText = "" // this is the text that goes in the text property in command object
        var commandVariables = dataCopy.split(' ');
        if (commandVariables[0].substr(0, 1) == "!") {
            //valid commandadd name
            commandVariables.shift();
        }
        if (commandVariables[0].substr(0, 1) == "!") {
            //valid command name
            cName = commandVariables[0];
            commandVariables.shift();
        }
        if (commandVariables[0].substr(0, 1) == "+") {
            //valid perms
            cPerms = commandVariables[0];
            commandVariables.shift();
        }
        //join to make datacopy hold the command variables, we will then remove special stuff from command variables
        dataCopy = commandVariables.join(' ');
        //gets special variables in brackets
        var specialVariablesArray = dataCopy.match(/ *\[[^\]]*]/g);
        specialVariablesArray.forEach(element => {
            commandVariables = dataCopy.replace(/ *\[[^\]]*]/, '');
        });
        /*     if (cName.substr(0, 1) == "!") {
                //valid command name
            }
            if (cPerms.substr(0, 1) == "+") {
                //valid command name
            } */
        commandVariables = commandVariables.split(' ');
        //join again after removing special variables so commandvariables now have sfx , gfx , img and text
        for (var i = 0, len = commandVariables.length; i < len; i++) {
            // $gfx(gfx.gif)
            // $sfx(audio.mp3)
            // $img(img.png)
            if (commandVariables[i].substr(0, 4) == "$gfx") {
                cgfx = commandVariables[i].replace('$gfx', '').replace('(', '').replace(')', '');
                commandVariables[i] = "";
            }
            if (commandVariables[i].substr(0, 4) == "$sfx") {
                csfx = commandVariables[i].replace('$sfx', '').replace('(', '').replace(')', '');
                commandVariables[i] = "";
            }
            if (commandVariables[i].substr(0, 4) == "$img") {
                cimg = commandVariables[i].replace('$img', '').replace('(', '').replace(')', '');
                commandVariables[i] = "";
            }
        }
        commandText = commandText.replace(/  +/g, ' ');
        var commandObjectJson = {
            cid: cName,
            cpermission: cPerms,
            ctext: commandText,
            cenabled: "Y"
        };
        return commandObjectJson;
    };
    var Scheduler = (function() {
        var tasks = [];
        var minimum = 10;
        var timeoutVar = null;
        var startTimers = false;
        var output = {
            add: function(func, context, timer, once) {
                var iTimer = parseInt(timer);
                context = context && typeof context === 'object' ? context : null;
                if (typeof func === 'function' && !isNaN(iTimer) && iTimer > 0) {
                    tasks.push([func, context, iTimer, iTimer * minimum, once]);
                }
            },
            remove: function(func, context) {
                for (var i = 0, l = tasks.length; i < l; i++) {
                    if (tasks[i][0] === func &&
                        (tasks[i][1] === context || tasks[i][1] == null)) {
                        tasks.splice(i, 1);
                        return;
                    }
                }
            },
            halt: function() {
                if (timeoutVar) {
                    clearInterval(timeoutVar);
                }
            }
        };
        var schedule = function() {
            for (var i = 0, l = tasks.length; i < l; i++) {
                if (tasks[i] instanceof Array) {
                    tasks[i][3] -= minimum;
                    if (tasks[i][3] < 0) {
                        tasks[i][3] = tasks[i][2] * minimum;
                        tasks[i][0].apply(tasks[i][1]);
                        if (tasks[i][4]) {
                            tasks.splice(i, 1);
                        }
                    }
                }
            }
            //added this so that once tasks are finished they loop again in the same sequence
            if (tasks.length <= 0) {
                if (myTimers.data.timers != undefined) {
                    if (myTimers.data.timers.length > 0) {
                        addAlltimersSchedule(myTimers);
                    }
                }
            }
        };
        timeoutVar = setInterval(schedule, minimum);
        return output;
    })();
    exports.SendCommandListToBot = SendCommandListToBot;
    exports.SetStreamerAuth = SetStreamerAuth;
    exports.SaveAuth = SaveAuth;
}());