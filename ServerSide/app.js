//
(function() {
    //github access token for schubot 61ea34e9ffd423d3ebc9f5bf4ca19f43f7763c1c
    //
    //
    //
    //

    //https://mixer.com/api/v2/emotes/global?legacy=true  emotes location
    'use strict';
    const dateNow = Date.now();

    const MixerStreamerChat = require('../app/js/MixerStreamerChat.js');

    const TwitchChatClient = require('../app/js/TwitchChatClient.js');

    const TwitchWebhooks = require('../app/js/TwitchWebhooks.js');

    const MixerBotChat = require('../app/js/MixerBotChat.js');
    const mixerdata = require('../app/js/mixerdata.js');
    const constellation = require('../app/js/constellation.js');
    const commandHandler = require('../app/js/commandHandler.js');
    const fileOps = require('../app/js/fileOps');
    const setSavedTheme = require('../app/js/setSavedTheme');
    const modMonitor = require('../app/js/modMonitor');
    const currencyManager = require('../app/js/currencyManager');



    const Mixer = require('@mixer/client-node');

    const request = require("request");

    const fetch = require("node-fetch");

    const colors = require('colors');

    const loki = require('lokijs');
    //const install_postgres = require('../ServerSide/install_postgress.js');


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
    var querystring = require('querystring');
    var https = require("https");

    ////const server = require('http').createServer(app);
    //var app = require('express').createServer();
    //var io = require('socket.io')(app);
    ////const io = require('socket.io')(server);
    var express = require('express');
    var appex = express();

/* test somethign 


*/


appex.use(morgan('dev'));

//console.log(__dirname);

var pathdir = __dirname.replace("ServerSide", "");


//appex.use(express.static(pathdir + '/resources/media'));
//appex.use(serveStatic(__dirname + '/resources/media'));

//  app.set('views', path.join(__dirname, '/views'));
appex.set('view engine', 'ejs');
appex.set('views', pathdir + '/views');


appex.use(express.static(pathdir + '/public'));
/////////////////////////////app.use(express.static(__dirname + '/public/build'));
///////////////////////////////////////app.use(express.static(__dirname + '/vendors'));
// app.use(express.static(__dirname + '/views'));
appex.use(express.static(pathdir + '/public/img'));
appex.use(express.static(pathdir + '/resources/media'));

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

//console.log('Server attempting to run: ' + port);


//app.use(passport.session()); // persistent login sessions
appex.use(flash()); // use connect-flash for flash messages stored in session





      

    
                //return d = new TwitchChannelObject(json.data[0]);
    





    //var server = require('http').createServer(appex);
    require('../app/routes/routes.js')(appex);

    var server = require('http').createServer(appex);




//


var id = '147299544';
// Send Twitch webhooks subscription
const tokeno = 'lx71o93103qho7pc2onpz2ktprnsrp';

// Twitch client id
var clientID = 'gp762nuuoqcoxypju8c569th9wz7q5'
// Content type of data to send
var contentType = 'application/json'
var hostname = 'http://localhost:8081'
var leaseSeconds = 86000;

function subUnsub(userId, subUnsubAction, res) {
    let resolvePromise;
    let rejectPromise;
    const promise = new Promise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
    if (!userId) {
      console.warn("No channel to subscribe to.");
      res && endWithCode(res, 404);
      return Promise.reject("No channel to subscribe to.");
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client-id': clientID,
        'Authorization': `Bearer ${tokeno}`
      }
    };
    const twitchReq = https.request(
      'https://api.twitch.tv/helix/webhooks/hub',
      options, (twitchRes) => {
        bodify(twitchRes, body => {
          console.info(`${subUnsubAction}d to ${userId} with HTTP status ${twitchRes.statusCode}`);
          if (twitchRes.statusCode.toString().startsWith('2')) {
            resolvePromise();
          } else {
            rejectPromise();
          }
          res && endWithCode(res, 200);
        });
      });
    twitchReq.on('error', console.error);
    const callbackUrl = `${hostname}/webhooks`;
    console.log('callbackUrl', callbackUrl);
    //const topic = `https://api.twitch.tv/helix/streams?user_id=${userId}`;
    const topic = `https://api.twitch.tv/helix/users/follows?first=1&to_id=${userId}`
    console.info(`${subUnsubAction} `, topic);
    twitchReq.write(JSON.stringify({
      "hub.callback": callbackUrl,
      "hub.mode": subUnsubAction,
      "hub.topic": topic,
      "hub.secret": 'testsecret',
      "hub.lease_seconds": leaseSeconds,
    }));
    twitchReq.end();
    return promise;
  }

  function bodify(req, cb) {
    let body = '';
    req
      .on('data', chunk => body += chunk)
      .on('end', () => {
        if (!body) return cb(null);
        try {
          cb(JSON.parse(body), body)
        } catch (e) {
          console.warn('body could not be parsed', e);
          cb(null);
        }
      });
  }


  async function subscribeToAllChannels(res) {
    const success = [];
    const failure = [];
    
      try {
        
        await subUnsub(147299544, 'subscribe');
        //console.info(`Subscribed to ${c.displayName} (147299544)`);
        success.push(147299544);
 
      } catch (e) {
        //console.error(`Couldn't subscribe to ${c.displayName} (147299544)`)
        failure.push(147299544);
      }
    
    setTimeout(() => subscribeToAllChannels(), leaseSeconds * 1000);
    res && endWithCode(res, 200, {success, failure});
  } 

  function endWithCode(res, code, payload) {
    res.statusCode = code;
    res._events.end(payload)
  }



function getFollowersFromWebHookOld()
{

        //var https = require('http');
        var str = '';
      
        const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'client-id': clientID,
              'Authorization': `Bearer ${tokeno}`
            }
          };

        callback = function(response) {

            response.on('data', function (chunk) {
              str += chunk;
            });
          
            response.on('end', function () {
              console.log(req.data);
              console.log(str);
              // your code here if you want to use the results !
            });
        }
          
        var req = https.request(`https://api.twitch.tv/helix/users/follows?first=1&to_id=${id}`,options, callback()).end();
      
}



  function getFollowersFromWebHook()
  {

    const options = {
        url: `https://api.twitch.tv/helix/users/follows?first=1&to_id=${id}`,
        method: 'GET',
        headers: {
        'User-Agent': 'request',
          'Content-Type': 'application/json',
          'client-id': clientID,
          'Authorization': `Bearer ${tokeno}`
        }
      };
      
      function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
          const info = JSON.parse(body);
          console.log(info + " Stars");
          console.log(info + " Forks");
        }
      }
      
      request(options, callback);


/* 

    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'client-id': clientID,
          'Authorization': `Bearer ${tokeno}`
        }
      };


      request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body.url);
        console.log(body.explanation);
      });


    https.get(`https://api.twitch.tv/helix/users/follows?first=1&to_id=${id}`,options, (resp) => {}
  let data = '';
 */
/*   // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data).explanation);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
}); */

  }


//



    const io = require('socket.io')(server);

    var fs = require('mz/fs');
    const log = require('electron-log');
    log.transports.file.level = 'info';
    log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';
    log.transports.file.maxSize = 5 * 1024 * 1024;
    // = 582310
    let streamerChannel = null;
    let bc;
    var bcBot;
    var mixerData;
    var co;
    var ch;
    let botName = null
    let cm;
    let twitchChat;
    let webhooks;

    log.info('Server attempting to run: ' + port);

    ////////THIS IS THE STUFF FOR THE NEW DB
    //     /* 
    //         // mongo db stuffs
    //         let mongo = require('mongodb');
    //         var MongoClient = require('mongodb').MongoClient;
    //         var url = "mongodb://localhost:27017/mydb";

    //         MongoClient.connect(url, function(err, db) {
    //             if (err) {
    //                 log.error(err);
    //             }

    //             var dbo = db.db("mydb");
    //             dbo.createCollection("customers", function(err, res) {
    //                 if (err) {
    //                     log.error(err);
    //                 }
    //                 console.log("Collection created!");
    //                 db.close();
    //             });
    //         }); */


    //     /*     MongoClient.connect(url, function(err, db) {
    //             if (err) throw err;
    //             var dbo = db.db("mydb");
    //             var myobj = { name: "Company Inc", address: "Highway 37" };
    //             dbo.collection("customers").insertOne(myobj, function(err, res) {
    //                 if (err) throw err;
    //                 console.log("1 document inserted");
    //                 db.close();
    //             });
    //         }); */


    /* webhook subscriptions

    


    //http://techfort.github.io/LokiJS/ 
    // loki stuffs for stuff that we can keep in memory like: following , recent followers, recent chat messages , temp currency
    let in_mem_db = new loki('example.db');
    var tmp_users = in_mem_db.addCollection('users');
    var tmp_currency = in_mem_db.addCollection('users');
    tmp_users.insert({
        userId: 50,
        userName: 'Username'
    });

    // hours is a unit of time in minutess
    tmp_currency.insert({
        currencyId: 1,
        userId: 50,
        username: 'Username',
        hours: 1,
        points: 0
    });


    // alternatively, insert array of documents
    tmp_users.insert([{ name: 'Thor', age: 35 }, { name: 'Loki', age: 30 }]);


    // /*     var pgInstall = new install_postgres();
    //     pgInstall.runCommand(log); */

    //     // var results = users.find({ age: {'$gte': 35} });

    //     // var odin = users.findOne({ name:'Odin' });

    //     // var results2 = users.where(function(obj) {
    //     //     return (obj.age >= 35);
    //     // });

    //     // var results3 = users.chain().find({ age: {'$gte': 35} }).simplesort('name').data();





    let dbAlerts = new JsonDB("./resources/jsondbfiles/myAlerts", true, true);
    let userCommands = new JsonDB("./resources/jsondbfiles/myCommands", true, true);
    let myFollowAlerts = new JsonDB("./resources/jsondbfiles/myFollowAlerts", true, true);
    let myHostAlerts = new JsonDB("./resources/jsondbfiles/myHostAlerts", true, true);
    let myMedia = new JsonDB("./resources/jsondbfiles/myMedia", true, true);
    let myTriggers = new JsonDB("./resources/jsondbfiles/myTriggers", true, true);
    let currencyUsers = new JsonDB("./resources/jsondbfiles/currencyUsers", true, true);
    let currencyUserTypes = new JsonDB("./resources/jsondbfiles/currencyUserTypes", true, true);
    let currency = new JsonDB("./resources/jsondbfiles/currency", true, true);
    let myTimers = new JsonDB("./resources/jsondbfiles/myTimers", true, true);
    let myModeratorMonitor = new JsonDB("./resources/jsondbfiles/myModeratorMonitor", true, true);
    let myNotes = new JsonDB("./resources/jsondbfiles/myNotes", true, true);
    let myQuotes = new JsonDB("./resources/jsondbfiles/myQuotes", true, true);
    let myUITheme = new JsonDB("./resources/jsondbfiles/myUITheme", true, true);
    let authDB = new JsonDB("./resources/jsondbfiles/auth", true, true);
    let Newcurrency = new JsonDB("./resources/jsondbfiles/Newcurrency", true, true);
    let parentCurrency = new JsonDB("./resources/jsondbfiles/parentCurrency", true, true);

    let NewcurrencyUsers = new JsonDB("./resources/jsondbfiles/NewcurrencyUsers", true, true);


    //https://github.com/Belphemur/node-json-db this is info on jsondb



    //
    //
    //alert(hello);
    dbAlerts.reload();
    userCommands.reload();
    myFollowAlerts.reload();
    myHostAlerts.reload();
    myMedia.reload();
    myTriggers.reload();
    Newcurrency.reload();
    NewcurrencyUsers.reload();
    parentCurrency.reload();
    currency.reload();
    currencyUsers.reload();
    currencyUserTypes.reload();
    myTimers.reload();
    myModeratorMonitor.reload();
    myNotes.reload();
    myQuotes.reload();
    myUITheme.reload();
    authDB.reload();

    initializeData();


    cm = new currencyManager(io, log);
    cm.createTimers(Newcurrency, NewcurrencyUsers);


    let chatConnectedBot = false;
    let chatConnected = false;
    let timers = [];

    var globalFollowers = [];

    // this variable is to warn the caster only once about re-auth (could be improved)
    let unauthenticatedCounter = 0;
    //var followAlertList = [];

    const soundFolder = './resources/media/sounds/';
    const videoFolder = './resources/media/videos/';
    const imageFolder = './resources/media/images/';

    const alertsoundFolder = '../media/sounds/';
    const alertvideoFolder = '../media/videos/';
    const alertimageFolder = '../media/images/';

    var dateIn = new Date();
    ////////////////////////////////var dateStringTest = getLetterFullDateTimeString(dateIn);
    ///////////////////////////////// console.log(dateStringTest);

    //require('../config/passport')(passport);


/* commented out

    appex.use(morgan('dev'));

    //console.log(__dirname);

    var pathdir = __dirname.replace("ServerSide", "");


    //appex.use(express.static(pathdir + '/resources/media'));
    //appex.use(serveStatic(__dirname + '/resources/media'));

    //  app.set('views', path.join(__dirname, '/views'));
    appex.set('view engine', 'ejs');
    appex.set('views', pathdir + '/views');


    appex.use(express.static(pathdir + '/public'));
    /////////////////////////////app.use(express.static(__dirname + '/public/build'));
    ///////////////////////////////////////app.use(express.static(__dirname + '/vendors'));
    // app.use(express.static(__dirname + '/views'));
    appex.use(express.static(pathdir + '/public/img'));
    appex.use(express.static(pathdir + '/resources/media'));

    //console.log(JSON.stringify(passport));

    appex.use(cookieParser());


    appex.use(bodyParser.json());
    appex.use(bodyParser.urlencoded({ extended: false }));


    //app.use(passport.initialize());

    //console.log('Server attempting to run: ' + port);
    log.info('Server attempting to run: ' + port);

    //app.use(passport.session()); // persistent login sessions
    appex.use(flash()); // use connect-flash for flash messages stored in session

    require('../app/routes/routes.js')(appex);

*/ 

    /*    app.use(session({
           secret: 'anystringoftext',
           saveUninitialized: true,
           resave: true
       })); */


/* webhook function */

    //console.log(passport.GetAuthData);
    //socket.io stuff
    //sockets
    var connections = 0;
    var isConnected = false;
    var initialiseMixerData = false;
    let startupBotDataSent = false;

    // ../media/sounds/sound1.mp3 - sound path
    //../media/images/alert.gif - images path

    subscribeToAllChannels();



    server.listen(port, function() {
        log.info('Webserver Listening on port: ' + port);
        //  console.log(colors.magenta('Webserver Listening on port: ' + port));
    });




    getFollowersFromWebHook();

    io.on('connection', function(socket) {



        // console.log('Auth Token is ' + xd);
        connections = connections + 1;
        socket.name = socket.id;

        //console.info(`Client connected [id=${socket.id}]`);
        log.info(`Client connected [id=${socket.id}]`);

        /*   console.log('connected ' + connections + ' times');
         *  console.log('connected with', `${socket.name} IP: ${socket.handshake.address}`)
         */

        socket.on('disconnect', function() {

            //console.info(`Client gone [id=${socket.id}]`);
            log.info(`Client disconnected [id=${socket.id}]`);
            //commented this out 04/09/2018
            //socket.disconnect;
            //  console.log("Socket status:" + socket.connected);

        });

        socket.on('beamClient', function(client) {
            //console.log('beamClient line 141 chatbot');
            log.info('beamClient line 141 chatbot');
        });

        socket.on('message', function(message, sendType) {
            try {
                //SendMessageToTwitch(message, bc, bcBot, sendType);
                //hardcoded to streamer for now till I get a bot account
                //from UI
                SendMessageToTwitch(message, twitchChat, bcBot, 'Streamer')
            } catch (error) {
                log.info('error in main line 148 message event ' + error.message);

            }

        });

        socket.on('alertFinished', function(dateid, type) {
            try {
                //simply deletes the alert from the queue with the given name
                GetFirstOneAndDeletesIt(dbAlerts, dateid, type);
            } catch (error) {
                log.info('alertFinished event error ' + error.message);
            }

        });

        socket.on('alertCommandFinished', function(dateid, type) {
            try {

                GetFirstOneAndDeletesIt(dbAlerts, dateid, type);
            } catch (error) {
                log.info('error getting next alert in sequence');
            }

        });

        socket.on('saveUIThemeSetting', function(element, color) {

            try {
                saveUIThemeSetting(myUITheme, element, color);
            } catch (error) {
                log.info('error saving UI Theme Setting');
            }

        });

        socket.on('getNextAlertInList', function(message) {
            try {

                GetLastFromList(dbAlerts, message);
            } catch (error) {
                log.error('getNextAlertInList error ' + error.message);
            }

        });

        socket.on('error', function(message) {
            try {
                log.info('error in server websocket ' + message);
                // socket.join; //not sure why this is here
            } catch (error) {
                log.error('catch: error in server websocket' + error.message);
            }

        });

        socket.on('stopTimers', function(message) {
            try {
                //  stopAlltimers();
                stopAllTimersSchedule();
            } catch (message) {
                log.error('error stopping timers');
            }

        });

        socket.on('startTimers', function(message) {
            try {
                log.info('Starting timers');
                //addAlltimers(myTimers);
                addAlltimersSchedule(myTimers);
            } catch (error) {
                log.error('error starting timers' + error.message);
            }

        });

        socket.on('addSaveCommand', function(cmdObject) {
            try {

                log.info('Saving UI Command');

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
                log.error('error saving command' + error.message);
            }

        });

        socket.on('addSaveCurrency', function(currObject) {

            try {

                log.info('Saving UI Currency');

                var commandExists = checkCurrencyUIExists(Newcurrency, currObject);

                if (commandExists.length == 0) {

                    //processAddUICurrency actually adds the db entry
                    processAddUICurrency(Newcurrency, currObject, 'Add');
                    io.emit('addSaveSingleCurrency', currObject);

                    //add parent entry
                    processAddParentCurrencyDBEntry(parentCurrency, currObject);

                    sendParentCurrenciesToUI(parentCurrency);

                } else {
                    processAddUICurrency(Newcurrency, currObject, 'Edit');
                    io.emit('addSaveSingleCurrency', currObject);
                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error saving command' + error.message);
            }



        });


        socket.on('addSaveCurrencyRank', function(currObject) {

            try {

                log.info('Saving UI Currency Rank');

                //for now this is just checking that the currency exists
                var commandExists = checkCurrencyUIExists(Newcurrency, currObject);

                if (commandExists.length == 0) {
                    //if no currency then popup a message saying save currency first
                    // and if no don't add else add
                } else {
                    processAddUICurrencyRank(Newcurrency, currObject, 'Edit');
                    io.emit('addSaveSingleCurrencyRank', currObject);
                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error saving command' + error.message);
            }



        });





        socket.on('reselectRank', function(currencyId, currencyName) {

            let ranks = processReselectRanks(Newcurrency, currencyId, currencyName);

            io.emit('currencyRanksSelect', ranks, currencyId)
        });


        /*         socket.on('getParentCurrencies', function() {

                    let parentCurrencies = processGetParentCurrencies(parentCurrency);
                    io.emit('receiveCurrency', parentCurrencies);
                    counter = counter + 1;
                    log.info("selection clicked" + counter);

                }); */

        socket.on('checkForOutstandingNotes', function() {
            try {

                log.info('Getting Outstanding Notes');

                var notesExists = getOutstandingNotes(myNotes);

                if (notesExists.length > 0) {
                    //outstanding notes

                    io.emit('outstandingNotes', true);

                } else {

                    //no outstanding notes

                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error getting outstanding notes - ' + error.message);
            }

        });

        socket.on('deleteCommand', function(cmdObject) {
            try {

                log.info('Deleting UI Command');

                var commandExists = checkCommandUIExists(userCommands, cmdObject);

                if (commandExists.length > 0) {

                    var commandID = cmdObject.id;

                    deleteCommandFromList(userCommands, commandID);

                    io.emit("RemoveCommandFromTable", cmdObject.id.replace("!", "x"));

                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error deleting command' + error.message);
            }

        });


        socket.on('deleteCurrency', function(currencyObject) {
            try {

                log.info('Deleting UI Currency');

                var currencyExists = checkCurrencyUIExists(Newcurrency, currencyObject);

                if (currencyExists.length > 0) {

                    var currencyID = currencyObject.id;

                    cm.DeleteParentCurrencyFromCurrency(Newcurrency, currencyID, parentCurrency);

                    cm.DeleteParentCurrency(currencyID, parentCurrency);

                    cm.deleteCurrencyFromList(Newcurrency, currencyID);



                    io.emit("RemoveCurrencyFromTable", currencyObject.id);

                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error deleting currency' + error.message);
            }

        });


        socket.on('deleteCurrencyRank', function(currObject) {

            try {

                log.info('Deleting UI Currency');

                //tr = $('<tr id="ID' + currencyId + "RNK" + data.name + '" class /> ');

                var currencyExists = checkCurrencyUIExists(Newcurrency, currObject);

                if (currencyExists.length > 0) {

                    deleteCurrencyRankFromList(Newcurrency, currObject);

                    io.emit("RemoveCurrencyRankFromTable", currObject.id, currObject.currencyRankName.replace(/ /g, ''));

                }

            } catch (error) {
                log.error('error deleting rank' + error.message);
            }




        });

        socket.on('addSaveTrigger', function(cmdObject) {
            try {

                log.info('Saving UI Trigger');

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
                log.error('error saving trigger - ') + error.message;
            }

        });

        socket.on('addSaveNote', function(cmdObject) {
            try {

                log.info('Saving UI Note');

                var commandExists = checkNoteUIExists(myNotes, cmdObject);

                if (commandExists.length == 0) {

                    processAddUINote(myNotes, cmdObject);
                    io.emit('addSaveSingleNote', cmdObject);
                } else {
                    processEditUINote(myNotes, cmdObject);
                    io.emit('addSaveSingleNote', cmdObject);
                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error saving note - ' + error.message);
            }

        });

        socket.on('deleteTrigger', function(cmdObject) {
            try {

                log.info('Deleting UI trigger');

                var commandExists = checkTriggerUIExists(myTriggers, cmdObject);

                if (commandExists.length > 0) {

                    deleteTriggerFromList(myTriggers, cmdObject);

                    io.emit("RemoveTriggerFromTable", cmdObject.id);

                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error deleting trigger - ' + error.message);
            }

        });

        socket.on('deleteNote', function(cmdObject) {
            try {



                var commandExists = checkNoteUIExists(myNotes, cmdObject);

                if (commandExists.length > 0) {

                    deleteNoteFromList(myNotes, cmdObject);

                    io.emit("RemoveNoteFromTable", cmdObject.id);

                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error deleting note - ' + error.message);
            }

        });

        socket.on('completeNote', function(cmdObject) {
            try {

                var commandExists = checkNoteUIExists(myNotes, cmdObject);

                if (commandExists.length > 0) {

                    completeNoteFromList(myNotes, cmdObject);
                    io.emit('addSaveSingleNote', cmdObject);

                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error completing note - ' + error.message);
            }

        });

        socket.on('addSaveTimer', function(cmdObject) {
            try {

                var commandExists = checkTimerUIExists(myTimers, cmdObject);

                if (commandExists.length == 0) {
                    processAddUITimer(cmdObject);
                    io.emit('addSaveSingleTimer', cmdObject);
                } else {
                    processEditUITimer(cmdObject);
                    io.emit('addSaveSingleTimer', cmdObject);
                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error saving timer - ' + error.message);
            }

        });

        socket.on('deleteTimer', function(cmdObject) {
            try {

                var commandExists = checkTimerUIExists(myTimers, cmdObject);

                if (commandExists.length > 0) {

                    deleteTimerFromList(myTimers, cmdObject);
                    io.emit("RemoveTimerFromTable", cmdObject.id);

                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error deleting timer');
            }

        });

        socket.on('addEditAlert', function(objAlert) {
            try {


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
                log.error('error saving alert - ' + error.message);
            }
        });

        socket.on('deleteAlert', function(cmdObject) {
            try {



                var alertExists = checkAlertUIExists(myHostAlerts, myFollowAlerts, cmdObject);

                if (alertExists.length > 0) {

                    deleteAlertFromList(myHostAlerts, myFollowAlerts, cmdObject);

                    io.emit("RemoveAlertFromTable", cmdObject);

                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error deleting alert ' + error.message);
            }

        });

        socket.on('addSaveMedia', function(cmdMedia) {
            try {


                var mediaExists = checkMediaUIExists(myMedia, cmdMedia);

                if (mediaExists.length == 0) {
                    processAddUIMedia(cmdMedia);
                } else {
                    processEditUIMedia(myMedia, cmdMedia);
                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error saving media' + error.message);
            }

        });




        socket.on('deleteMedia', function(cmdMedia) {


            try {



                var mediaExists = checkMediaUIExists(myMedia, cmdMedia);

                if (mediaExists.length > 0) {

                    deleteMediaFromList(myMedia, cmdMedia);

                    //io.emit("RemoveMediaFromTable", cmdMedia);

                }

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error deleting media ' + error.message);
            }

        });



        socket.on('TimeoutMixerUser', function(data) {
            try {


                if (bc != null) {
                    bc.timeout(data);
                }

            } catch (error) {
                log.error('error timing out user ' + error.message);
            }

        });

        socket.on('BanMixerUser', function(data) {
            try {


                if (bc != null) {
                    bc.ban(data.userid, authDB.data.streamer.channelId);
                }


                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error banning user ' + error.message);
            }

        });


        socket.on('addUserToCurrencyManagerList', function(userID, userName) {
            try {

                cm.addChatUserForCurrency(userID, userName);

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error adding currency user to list ' + error.message);
            }

        });

        socket.on('removeUserFromCurrencyManagerList', function(userID) {
            try {

                cm.removeChatUserForCurrency(userID);

                // io.emit('addSaveCommandResult', cmdObject);
            } catch (error) {
                log.error('error removing currency user from list ' + error.message);
            }

        });







        if (!startupBotDataSent) {
            loadBotData()
            loadBotCurrencyAndTimers()
                //initBeamData(authDB);
                //ConnectToBeamAndConsellation();

            ConnectToTwitch();

            //gets mixer data
            initTwitchData(authDB);
            startupBotDataSent = true;
        }

        //performRefreshMixerWithRefreshToken(authDB, "streamer");


    });

    function loadBotData() {
        log.info('Loading Bot Data');

        SendUIThemeToBot(myUITheme);
        /*         LoadSoundFiles(soundFolder);
                LoadVideoFiles(videoFolder);
                LoadImageFiles(imageFolder); */
        LoadMediaFiles(soundFolder, videoFolder, imageFolder);
        SendCommandListToBot(userCommands);
        SendMediaListToBot(myMedia);
        SendHostAlertsToBot(myHostAlerts);
        SendFollowAlertsToBot(myFollowAlerts);
        SendKeywordsToBot(myTriggers);
        SendNotesToBot(myNotes);
        SendTimersToBot(myTimers);
        SendCurrencyToBot(Newcurrency);

    }

    function loadBotCurrencyAndTimers() {
        addAlltimersSchedule(myTimers);
        StartCurrency();
        sendParentCurrenciesToUI(parentCurrency);
    }

    //this initialises all the mixer data for the bot
    function initBeamData(authDB) {

        //get followage
        //https://mixer.com/api/v1/channels/channelId/follow?where=id:eq:UserId&limit=1&page=0&noCount=1

        //if (bc != null && bc != undefined) {

        // if there is no streamer id then this means fresh install
        if (authDB.data.streamer.userId > 0) {

            mixerData = new mixerdata(authDB.data.streamer.accessToken, log, io);

            try {
                mixerData.getStreamerFollows(authDB.data.streamer.userId);

                mixerData.getfollowers(authDB.data.streamer.channelId);

                mixerData.getChatUsers(authDB.data.streamer.channelId);
            } catch (error) {
                log.info(error.message);
            }




        }

    }


    function initTwitchData(authDB) {

        //get followage
        //https://mixer.com/api/v1/channels/channelId/follow?where=id:eq:UserId&limit=1&page=0&noCount=1

        //if (bc != null && bc != undefined) {

        // if there is no streamer id then this means fresh install
        if (authDB.data.streamer.userId > 0) {

            /*             mixerData = new mixerdata(authDB.data.streamer.accessToken, log, io);

                        try {
                            mixerData.getStreamerFollows(authDB.data.streamer.userId);

                            mixerData.getfollowers(authDB.data.streamer.channelId);

                            mixerData.getChatUsers(authDB.data.streamer.channelId);
                        } catch (error) {
                            log.info(error.message);
                        } */

        }

    }

    /* 
        function sendSMS() {
            var request = require('request');

            request.post('https://textbelt.com/text', {
                form: {
                    phone: '+447840172451',
                    message: 'Hello world',
                    key: 'textbelt',
                },
            }, function(err, httpResponse, body) {
                if (err) {
                    console.error('Error:', err);
                    return;
                }
                *console.log(JSON.parse(body));
            })
        }; */

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


    function deleteCurrencyRankFromList(Newcurrency, currObject) {

        let currencyIndex = Newcurrency.data.currency.findIndex(obj => obj.id == currObject.id);

        if (currencyIndex >= 0) {

            let rankIndex = Newcurrency.data.currency[currencyIndex].ranks.findIndex(obj => obj.name == currObject.currencyRankName)

            Newcurrency.delete(("/currency[" + currencyIndex + "]/ranks[" + rankIndex + "]"));
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


    function deleteMediaFromList(myMedia, cmdObject) {

        for (var i = 0, len = myMedia.data.media.length; i < len; i++) {

            //array = alertsinqueue and index = i
            var iii = myMedia.data.media[i].id;

            if (iii == cmdObject.id) {

                myMedia.delete(("/media[" + i + "]"));
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

    function StartCurrency(cm) {
        //cm2 = new currencyManager(io, log);
        //cm2.createTimers(Newcurrency, NewcurrencyUsers);
        //cm.addChatUserForCurrency(12345, "Schuster");

    }

    function initializeData() {


        // check for backup (set backup folder)

        //initially the json fields will be empty so we need to populate the theme as a minimum

    }

    /*     function ConnectToBeamAndConsellation() {

            log.info('Connecting to Mixer and Constellation');

            //if either streamer or bot is not connected then reconnect
            if (!chatConnected || !chatConnectedBot) {

                authDB.reload();
                log.info('Auth File Loaded');

                CreateBeamObjects(authDB.data.streamer.accessToken, null, authDB.data.streamer.username, chatConnected, authDB.data.streamer.username, authDB.data.bot.username, globalFollowers, authDB);
                //console.log('streamer connected to socket ' + connections + ' times');





                CreateBeamBotObjects(authDB.data.bot.accessToken, null, authDB.data.bot.username, chatConnectedBot, authDB.data.streamer.username, authDB.data.bot.username, authDB.data.streamer.channelId, authDB);


              

            } else {
                //io.emit('authenticated', 'false');
                log.info('IO reconnected');
                //initBeamData();
            }
        }
     */

    function ConnectToTwitch() {

        log.info('Connecting to Twitch');

        //if either streamer or bot is not connected then reconnect
        if (!chatConnected || !chatConnectedBot) {

            authDB.reload();
            log.info('Auth File Loaded');

            //uncomment when token is saved to authDB
            //CreateTwitchObjects(authDB.data.streamer.accessToken, null, authDB.data.streamer.username, chatConnected, authDB.data.streamer.username, authDB.data.bot.username, globalFollowers, authDB);

            CreateTwitchObjects("SampleToken", null, authDB.data.streamer.username, chatConnected, authDB.data.streamer.username, authDB.data.bot.username, globalFollowers, authDB);


            //console.log('streamer connected to socket ' + connections + ' times');


            /*       if (bc != null) {
                      *console.log('getting client');
                      bc.getclient();
                  } */


            //uncomment when bot account is done
            //CreateBeamBotObjects(authDB.data.bot.accessToken, null, authDB.data.bot.username, chatConnectedBot, authDB.data.streamer.username, authDB.data.bot.username, authDB.data.streamer.channelId, authDB);


            /*             //this will not load unless beam is connected, need to fix this
                        initBeamData();

                        //start timers on connection
                        someData = ["potato", "carrot"];
                        // addAlltimers(myTimers);
                        addAlltimersSchedule(myTimers); */

        } else {
            //io.emit('authenticated', 'false');
            log.info('IO reconnected');
            //initBeamData();
        }
    }

    //this sends list of file names down to page, need to add some stuff so that I can make this dynamic
    //function LoadFiles(folder, fileType) { ....
    //might want to send file type to just have one function on client side to load relevant element
    function LoadSoundFiles(folder) {


        var fsOps = new fileOps(io ,log);

        fsOps.getFilesInSoundFolder(fs, folder);

    }

    //this sends list of file names down to page, need to add some stuff so that I can make this dynamic
    //function LoadFiles(folder, fileType) { ....
    //might want to send file type to just have one function on client side to load relevant element
    function LoadVideoFiles(folder) {

        var fsOps = new fileOps(io,log);

        fsOps.getFilesInVideoFolder(fs, folder);

    }

    function LoadImageFiles(folder) {

        var fsOps = new fileOps(io,log);

        fsOps.getFilesInImageFolder(fs, folder);

    }

    function LoadMediaFiles(AudioFolder, VideoFolder, ImageFolder) {

        var fsOps = new fileOps(io,log);

        fsOps.getAllMedia(fs, AudioFolder, VideoFolder, ImageFolder);
    }

    function SendCommandListToBot(userCommands) {

        var fsOps = new fileOps(io,log);
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

        var fsOps = new fileOps(io,log);
        fsOps.sendMediaToUi(audioMedia, imageMedia, videoMedia);

        //  io.emit('loadCommandsToList', userCommands);

    }

    function SendUIThemeToBot(myUITheme) {

        var uiThemeSettings = new setSavedTheme(io);
        uiThemeSettings.sendThemeToUI(myUITheme);
        uiThemeSettings.sendUIPreferences();

    }

    function SendHostAlertsToBot(myHostAlerts) {

        var fsOps = new fileOps(io,log);
        fsOps.sendHostAlertsToUI(myHostAlerts.data.hostalerts);

        //  io.emit('loadCommandsToList', userCommands);

    }

    function SendFollowAlertsToBot(myFollowAlerts) {

        var fsOps = new fileOps(io,log);
        fsOps.sendFollowAlertsToUI(myFollowAlerts.data.followalerts);

        //  io.emit('loadCommandsToList', userCommands);

    }

    function SendKeywordsToBot(myTriggers) {

        var fsOps = new fileOps(io,log);
        fsOps.sendKeywordsToUI(myTriggers.data.triggers);

        //  io.emit('loadCommandsToList', userCommands);

    }

    function SendNotesToBot(myNotes) {

        var fsOps = new fileOps(io,log);
        fsOps.sendNotesToUI(myNotes.data.notes);

        //  io.emit('loadCommandsToList', userCommands);

    }

    function SendTimersToBot(myTimers) {

        var fsOps = new fileOps(io,log);
        fsOps.sendTimersToUI(myTimers.data.timers);

        //  io.emit('loadCommandsToList', userCommands);

    }

    function SendCurrencyToBot(Newcurrency) {

        var fsOps = new fileOps(io,log);
        fsOps.sendCurrencyToUI(Newcurrency.data.currency);

        //  io.emit('loadCommandsToList', userCommands);

    }

    function AddMonitorAction(myModeratorMonitor, data, type) {

        var modMon = new modMonitor(io);
        modMon.addModeratorAction(myModeratorMonitor, data, type);

    }

    //this is when they auth
    function ConnectOnLogin(IsStreamer, authData) {
        // let streamerToken = undefined;
        // let botToken = undefined;
        // authDB.reload();

        if (IsStreamer) {
            //streamerToken = authDB.data.streamer.accessToken;
            checkStreamerTokenAndConnect(authData, authData.access_token, authData);
        } else {
            // botToken = authDB.data.bot.accessToken;
            checkBotTokenAndConnect(authData, authData.access_token, authData);
        }

    }


    function ConnectToTwitchOnLogin(IsStreamer, authData) {
        // let streamerToken = undefined;
        // let botToken = undefined;
        // authDB.reload();

        if (IsStreamer) {
            //streamerToken = authDB.data.streamer.accessToken;
            checkStreamerTokenAndConnect(authData, authData.access_token, authData);
        } else {
            // botToken = authDB.data.bot.accessToken;
            checkBotTokenAndConnect(authData, authData.access_token, authData);
        }

    }

    function SaveAuthToken(IsStreamer, Data) {
        // let streamerToken = undefined;
        // let botToken = undefined;
        // authDB.reload();
        console.log(Data);


        fetch(
                'https://api.twitch.tv/helix/users', {
                    "headers": {
                        "Client-ID": "t7kyrxjq326tij087ax7o8a6y686d8",
                        "Authorization": "Bearer " + Data.access_token
                    }
                }
            )
            .then(resp => resp.json())
            .then(resp => {

                log.info('Twitch User Logged in ' + resp.data[0])

                if (IsStreamer) {
                    SaveTwitchAuth('Streamer', Data.accessToken, null, login, null, resp.data[0]);
                }


                //document.getElementById('user_data').innerHTML = '<p>Your Public Twitch Profile from Helix:</p>';
                //var table = document.createElement('table');
                //document.getElementById('user_data').append(table);
                //for (var key in resp.data[0]) {
                //    var tr = document.createElement('tr');
                //    table.append(tr);
                //    var td = document.createElement('td');
                //    td.textContent = key;
                //    tr.append(td);
                //    var td = document.createElement('td');
                //    td.textContent = resp.data[0][key];
                //    tr.append(td); 
                //}
            })
            .catch(err => {
                console.log(err);
                document.getElementById('user_data').textContent = 'Something went wrong';
            });



    }


    //authDB, isStreamer , isConnected, authDB, _log, io

    //pass Token to here
    function checkTwitchStreamerTokenAndConnect(authData, Token, authDBData) {

        authDB.reload();
        twitchChat = new TwitchChatClient(Token, true, chatConnected, authDB, log, io);
        ch = new commandHandler(authDB.data.streamer.username, authDB.data.streamer.channelId, log , twitchChat , Token);


        //my twitch user id   
        var User = 147299544;
        const client_id = 'gp762nuuoqcoxypju8c569th9wz7q5';
        const OAuthToken = 'lx71o93103qho7pc2onpz2ktprnsrp';

        var FollowEventsTopic = 'https://api.twitch.tv/helix/users/follows?first=1&to_id=' + `${User}`;

        //webhooks = new TwitchWebhooks(OAuthToken , client_id , log);
        //var xyz = webhooks.subscribeFollows( FollowEventsTopic);



        twitchChat.on('CONNECTED', function(data) {
            try {

                log.info('ConnectedToChat');


            } catch (error) {
                log.error('error in mixer chat follow ' + error.message);
            }

        });




        twitchChat.on('PRIVMSG', function(data) {
            try {





                //message from twitch chat
                sendMessageToChatWindowTwitch(data, false)

            } catch (error) {
                log.error('error in twitch chat ' + error.message);
            }

        });



        twitchChat.on('*', function(data) {
            try {

                log.info('Got Message From Chat', data);

            } catch (error) {
                log.error('error in mixer chat follow ' + error.message);
            }

        });

        ch.on('CommandData', function(data) {

            // io.emit('message', UserName + ' [' + data.user_roles[0] + '] - ' + t);
            if (chatConnectedBot) {
                //send message to twitch as bot 
                let twitchChatBot = undefined;
                sendTwitchMessage(data , 'streamer' , twitchChatBot , undefined)
            } else {
                //send message to twitch chat as streamer

                sendTwitchMessage(data , 'streamer' , twitchChat , undefined)
            }

        });



    }

    function checkStreamerTokenAndConnect(authData, Token, authDBData) {

        let type = "streamer";

        const client = new Mixer.Client(new Mixer.DefaultRequestRunner());
        // /oauth/token/introspect
        client.request('POST', `/oauth/token/introspect`, {
            body: {
                "token": `${Token}`
            },
        }).then(res => {

            //do something with the response
            log.info('Checking Token');
            //log.info('Response Token :-' + JSON.stringify(res));


            //maybe check status code to retry if server is busy or not responding
            const validToken = res.body.active;

            if (validToken) {

                //no authData don't save auth as token is valid but bot is only reconnecting not re-authing
                if (authData != null) {
                    log.info('Saving Streamer Auth');
                    SaveAuth(type, Token, authData.refresh_token, res.body.username, authData.access_token_expiry_date);


                }


                log.info("streamer connected status - " + chatConnected);
                if (bc != null) {
                    log.info('beam object found no need to reconnect to chat');
                }


                if (bc == undefined || bc == null) {

                    log.info('Streamer Connecting to Chat....');

                    authDB.reload();
                    //streamer object
                    bc = new MixerStreamerChat(Token, chatConnected, authDB);


                    co = new constellation(authDB.data.streamer.channelId, log);
                    ch = new commandHandler(res.body.username, authDB.data.streamer.channelId, log);


                    io.emit('streamerAuthenticated');

                    bc.on('TriggerFollow', function(data) {
                        try {


                            FollowEvent(data, alertsoundFolder, alertimageFolder, alertvideoFolder, myFollowAlerts);
                        } catch (error) {
                            log.error('error in mixer chat follow ' + error.message);
                        }

                    });


                    /*                     bc.on('ChatUserCount', function(data) {

                                            *console.log('bc chat user count');
                                            io.emit('chatusercount', data);
                                        }); */

                    bc.on('error', function(data) {
                        log.error('streamer chat connection error - ' + data.message);
                    });

                    /*                     bc.on('ChatMessage', function(data) {

                                            if (data.message.meta.whisper) {
                                                sendMessageToChatWindow(data, true);
                                            } else {
                                                sendMessageToChatWindow(data, false);
                                            }



                                        }); */

                    bc.on('streamerLoggedIn', function(data) {

                        var item = data + ' - Owner - ' + authDB.data.streamer.userId;

                        io.emit('streamerLoggedIn', data, item);

                        chatConnected = true;

                        log.info("Streamer User Connected to chat")



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
                                //io.emit('message', UserName + ' [' + data.user_roles[0] + '] - ' + t);


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
                                log.info('constellation update: ' + JSON.stringify(data));
                                io.emit('update', data);


                                break;
                            case ('followed'):
                                log.info('A user has followed ' + JSON.stringify(data, null, 2));
                                if (data.info.following == true) {
                                    // if (bl.check(data.info.user.username) == false) {

                                    //    bc.say(`User ${data.info.user.username} Followed the Channel! `)
                                    //io.emit('followed', data);



                                    io.emit('followed', data);

                                    try {

                                        log.info('Constellation Follow Alert');
                                        //const soundFolder = './views/media/sounds/';
                                        //const gfxFolder = './views/media/graphics/';
                                        //const imageFolder = './views/media/images/';
                                        // images = list of images 
                                        // sounds = list of sounds
                                        // followGfx = list of gfx

                                        //  io.emit('followed', data);
                                        //this adds the follow to an alert queue
                                        //, images, sounds, followGfx

                                        if (myFollowAlerts.data.followalerts.length > 0) {
                                            FollowEvent(data, alertsoundFolder, alertimageFolder, alertvideoFolder, myFollowAlerts);
                                        } else {
                                            log.info('You have no follow alerts setup', 'You have no follow alerts setup');
                                        }



                                    } catch (error) {
                                        log.error('follow alert error in app.js ' + error.message);
                                    }


                                    //  }
                                } else {


                                    sendTriggerToMixer(bcBot, `User ${data.info.user.username} UnFollowed the Channel!`, true);
                                    // bcBot.say(`User ${data.info.user.username} UnFollowed the Channel!`)
                                    io.emit('unfollowed', data);

                                }
                                break;
                            case ('hosted'):
                                if (data.info.hoster != null) { //user is hosting you
                                    log.info("person hosted" + data.info.hoster.token);
                                    log.info("hosted data" + data);
                                }
                                if (data.info.hostee != null) { //user is being hosted

                                }
                                //console.log(data.info); //hoster/hostee for possibles.
                                //  if (bl.check(data.info.hoster.token) == false) {
                                HostEvent(data, alertsoundFolder, alertimageFolder, alertvideoFolder, myHostAlerts);

                                bcBot.say(`User ${data.info.hoster.token} hosted  the Channel! `);
                                log.info('viewersCurrent: ' + data.info.hoster.viewersCurrent);
                                io.emit('hosted', data);

                                //    }
                                break;
                            case ('subscribed'):
                                log.info("User Subscribed -" + data.info);
                                io.emit('subscribed', data);
                                break;
                            case ('resubscribed'):
                                log.info("User Resubscribed - " + data.info);
                                io.emit('resubscribed', data);
                                break;
                            default: //dont trigger anything.
                                log.info('unknown event triggered in constellation - ' + data.info);
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

                log.info('refresh Token Required access token expired');

                refreshTwitchToken(authDB, "streamer");


            }


            // return true;

        }).catch(error => {
            log.error('checkStreamerTokenAndConnect error' + error);
            //  return false;

        });


    }


    function checkStreamerTwitchTokenAndConnect(authData, Token, authDBData) {

        let type = "streamer";



        //do something with the response
        log.info('Checking Token');
        //log.info('Response Token :-' + JSON.stringify(res));




        //maybe check status code to retry if server is busy or not responding
        const validToken = res.body.active;

        if (validToken) {

            //no authData don't save auth as token is valid but bot is only reconnecting not re-authing
            if (authData != null) {
                log.info('Saving Streamer Auth');
                SaveAuth(type, Token, authData.refresh_token, res.body.username, authData.access_token_expiry_date);


            }


            log.info("streamer connected status - " + chatConnected);
            if (bc != null) {
                log.info('beam object found no need to reconnect to chat');
            }


            if (bc == undefined || bc == null) {

                log.info('Streamer Connecting to Chat....');

                authDB.reload();
                //streamer object
                bc = new MixerStreamerChat(Token, chatConnected, authDB);


                co = new constellation(authDB.data.streamer.channelId, log);
                ch = new commandHandler(res.body.username, authDB.data.streamer.channelId, log);


                io.emit('streamerAuthenticated');

                bc.on('TriggerFollow', function(data) {
                    try {


                        FollowEvent(data, alertsoundFolder, alertimageFolder, alertvideoFolder, myFollowAlerts);
                    } catch (error) {
                        log.error('error in mixer chat follow ' + error.message);
                    }

                });


                /*                     bc.on('ChatUserCount', function(data) {

                                        *console.log('bc chat user count');
                                        io.emit('chatusercount', data);
                                    }); */

                bc.on('error', function(data) {
                    log.error('streamer chat connection error - ' + data.message);
                });

                /*                 bc.on('ChatMessage', function(data) {

                                    if (data.message.meta.whisper) {
                                        sendMessageToChatWindow(data, true);
                                    } else {
                                        sendMessageToChatWindow(data, false);
                                    }



                                }); */

                bc.on('streamerLoggedIn', function(data) {

                    var item = data + ' - Owner - ' + authDB.data.streamer.userId;

                    io.emit('streamerLoggedIn', data, item);

                    chatConnected = true;

                    log.info("Streamer User Connected to chat")



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
                            //io.emit('message', UserName + ' [' + data.user_roles[0] + '] - ' + t);


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
                            log.info('constellation update: ' + JSON.stringify(data));
                            io.emit('update', data);


                            break;
                        case ('followed'):
                            log.info('A user has followed ' + JSON.stringify(data, null, 2));
                            if (data.info.following == true) {
                                // if (bl.check(data.info.user.username) == false) {

                                //    bc.say(`User ${data.info.user.username} Followed the Channel! `)
                                //io.emit('followed', data);



                                io.emit('followed', data);

                                try {

                                    log.info('Constellation Follow Alert');
                                    //const soundFolder = './views/media/sounds/';
                                    //const gfxFolder = './views/media/graphics/';
                                    //const imageFolder = './views/media/images/';
                                    // images = list of images 
                                    // sounds = list of sounds
                                    // followGfx = list of gfx

                                    //  io.emit('followed', data);
                                    //this adds the follow to an alert queue
                                    //, images, sounds, followGfx

                                    if (myFollowAlerts.data.followalerts.length > 0) {
                                        FollowEvent(data, alertsoundFolder, alertimageFolder, alertvideoFolder, myFollowAlerts);
                                    } else {
                                        log.info('You have no follow alerts setup', 'You have no follow alerts setup');
                                    }



                                } catch (error) {
                                    log.error('follow alert error in app.js ' + error.message);
                                }


                                //  }
                            } else {


                                sendTriggerToMixer(bcBot, `User ${data.info.user.username} UnFollowed the Channel!`, true);
                                // bcBot.say(`User ${data.info.user.username} UnFollowed the Channel!`)
                                io.emit('unfollowed', data);

                            }
                            break;
                        case ('hosted'):
                            if (data.info.hoster != null) { //user is hosting you
                                log.info("person hosted" + data.info.hoster.token);
                                log.info("hosted data" + data);
                            }
                            if (data.info.hostee != null) { //user is being hosted

                            }
                            //console.log(data.info); //hoster/hostee for possibles.
                            //  if (bl.check(data.info.hoster.token) == false) {
                            HostEvent(data, alertsoundFolder, alertimageFolder, alertvideoFolder, myHostAlerts);

                            bcBot.say(`User ${data.info.hoster.token} hosted  the Channel! `);
                            log.info('viewersCurrent: ' + data.info.hoster.viewersCurrent);
                            io.emit('hosted', data);

                            //    }
                            break;
                        case ('subscribed'):
                            log.info("User Subscribed -" + data.info);
                            io.emit('subscribed', data);
                            break;
                        case ('resubscribed'):
                            log.info("User Resubscribed - " + data.info);
                            io.emit('resubscribed', data);
                            break;
                        default: //dont trigger anything.
                            log.info('unknown event triggered in constellation - ' + data.info);
                            break;
                    }
                });


            }
        } else {

            log.info('refresh Token Required access token expired');

            refreshTwitchToken(authDB, "streamer");


        }


        // return true;



    }

    function validateTwitchToken(token) {
        var isValid = True;



        return isValid;
    }

    function checkBotTokenAndConnect(authData, Token, authDBData) {

        let type = "bot";

        const client = new Mixer.Client(new Mixer.DefaultRequestRunner());
        // /oauth/token/introspect
        client.request('POST', `/oauth/token/introspect`, {
            body: {
                "token": `${Token}`
            },
        }).then(res => {

            //do something with the response
            log.info('Checking Token');
            //log.info('Response Token :-' + JSON.stringify(res));



            //maybe check status code to retry if server is busy or not responding
            const validToken = res.body.active;

            if (validToken) {

                //no authData don't save auth as token is valid but bot is only reconnecting not re-authing
                if (authData != null) {
                    log.info('Saving Streamer Auth');
                    SaveAuth(type, Token, authData.refresh_token, res.body.username, authData.access_token_expiry_date);

                }

                if (bcBot == undefined || bcBot == null) {

                    authDB.reload();
                    streamerChannel = authDB.data.streamer.channelId;

                    if (streamerChannel != undefined || streamerChannel != null || streamerChannel != "") {
                        log.info('Bot User Connecting to chat');

                        bcBot = new MixerBotChat(Token, chatConnected, streamerChannel, authDB);

                        bcBot.on('error', function(data) {
                            log.error('Bot Chat Connection Error -' + data.message);
                        });

                        //when a user is modded/banned etc
                        bcBot.on('UserUpdate', function(data) {

                            log.info('A user update has happened: ' + JSON.stringify(data))

                            //remove User from list
                            if (data.hasOwnProperty('roles')) {
                                if (data.roles[0] == 'Banned') {
                                    //banned username
                                    //'Send in banned'
                                }
                            }



                        });

                        bcBot.on('UserTimeout', function(data) {

                            //not sent by mixer chat api atm
                            log.info('A user has been timed out: ' + JSON.stringify(data))

                        });


                        //when a user clears the chat
                        bcBot.on('ClearMessages', function(data) {
                            log.info('A user has cleared chat: ' + JSON.stringify(data))
                                //data.clearer
                            io.emit('MixerMessagesCleared', data);

                        });

                        bcBot.on('MixerTimeout', function(data) {

                            log.info('A user has purged/timedout someone: ' + JSON.stringify(data))
                            AddMonitorAction(myModeratorMonitor, data, "timeout");

                        });

                        bcBot.on('MixerDelete', function(data) {

                            //add row to db
                            data.moderator.user_roles[0]; //role of person deleting
                            data.moderator.user_id; //id of person deleting
                            data.moderator.user_name; //name of person deleting

                            log.info('Message Deleted: ' + JSON.stringify(data))
                            AddMonitorAction(myModeratorMonitor, data, "delete");

                        });


                        bcBot.on('MixerBan', function(data) {
                            //console.info('A user has been banned: ' + JSON.stringify(data))
                            AddMonitorAction(myModeratorMonitor, data, "ban");
                            //data.clearer
                        });

                        bcBot.on('UserJoin', function(data) {

                            let UserName = data.username;

                            //   io.emit('message', UserName + ' [' + data.roles[0] + ']' + ' - has Joined The Channel !!!!!!!!');
                            //io.emit('followed', data);
                            log.info('UserJoin: ' + data.username + ' has joined the chat');

                            if (data.roles[0] !== undefined) {

                                io.emit('UserJoined', UserName + ' - ' + data.roles[0] + ' - ' + data.id);
                            } else {
                                io.emit('UserJoined', UserName + ' - ' + 'No Role Defined' + ' - ' + data.id);
                            }


                        });

                        bcBot.on('UserLeave', function(data) {

                            ///console.log(colors.red(`UserPart`));
                            log.info('User: ' + data.username + ' has left the channel');

                            let UserName = data.username;

                            //  io.emit('message', UserName + ' [' + data.roles[0] + ']' + ' - has Left The Channel :( :( :(');
                            //io.emit('followed', data);

                            log.info("User Part data" + JSON.stringify(data));

                            if (data.roles[0] !== undefined) {
                                io.emit('UserPart', UserName + ' - ' + data.roles[0] + ' - ' + data.id);
                            } else {
                                io.emit('UserPart', UserName + ' - ' + 'No Role Defined' + ' - ' + data.id);
                            }



                        });


                        /*                         bcBot.on('ChatMessage', function(data) {

                                                    if (data.message.meta.whisper) {
                                                        sendMessageToChatWindow(data, true);
                                                    } else {
                                                        sendMessageToChatWindow(data, false);
                                                    }


                                                }); */

                        bcBot.on('botLoggedIn', function(data) {

                            var item = data + ' - Bot - ' + authDB.data.bot.userId;

                            io.emit('botLoggedIn', data, item);

                            chatConnectedBot = true;
                            log.info("Bot User Connected to chat")

                        });

                    } else {
                        // need to authenticate caster account first
                    }

                }



            } else {

                log.info('Re auth Bot:')

                refreshToken(authDB, "bot");
            }


            // return res.body.active;

        }).catch(error => {
            log.error('checkBotTokenAndConnect - ' + error);
            //   return false;

        });


    }


    //TODO needs finishing
    //use refresh token and if this fails then ask user to re-auth
    // function refreshToken(authData, type) {


    //     if (authData != null) {

    //         let streamertokenExpiryDate = authData.data.streamer.accessTokenExpiry;
    //         let bottokenExpiryDate = authData.data.bot.accessTokenExpiry;
    //         let tokenExpiryDate = type === "streamer" ? streamertokenExpiryDate : bottokenExpiryDate;

    //         //check expiry date
    //         if (new Date(tokenExpiryDate).getTime() < Date.now()) {
    //             //auth using refresh token TODO
    //             log.info('Token Expired need to obtain another with Refresh Token');
    //             performRefreshMixerWithRefreshToken(authData, type);

    //         } else {
    //             /*                 //ask user to re-auth as token is expired
    //                             if (type == "streamer") {
    //                                 io.emit('reauthstreamer', 'true');
    //                                 log.info('Re-auth Streamer Needed');
    //                             } else {
    //                                 io.emit('reauthbot', 'true');
    //                                 log.info('Re-auth bot Needed');
    //                             } */
    //         }
    //     } else {
    //         log.info('Could Not Authenticate with Refresh Token as no auth data is available - please re-auth');
    //     }

    // }


    //TODO needs finishing
    //use refresh token and if this fails then ask user to re-auth
    function refreshTwitchToken(authData, type) {


        if (authData != null) {

            let streamertokenExpiryDate = authData.data.streamer.accessTokenExpiry;
            let bottokenExpiryDate = authData.data.bot.accessTokenExpiry;
            let tokenExpiryDate = type === "streamer" ? streamertokenExpiryDate : bottokenExpiryDate;

            //check expiry date
            if (new Date(tokenExpiryDate).getTime() < Date.now()) {
                //auth using refresh token TODO
                log.info('Token Expired need to obtain another with Refresh Token');
                performRefreshMixerWithRefreshToken(authData, type);

            } else {

            }
        } else {
            log.info('Could Not Authenticate with Refresh Token as no auth data is available - please re-auth');
        }

    }

    function performRefreshMixerWithRefreshToken(authDB, type) {

        if (authDB != undefined) {

            //get refresh_token for type
            var refreshToken = authDB.getData('./' + type + '/refreshToken');
            var userName = authDB.getData('./' + type + '/username');



            var options = {
                client_id: '5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d',
                response_type: 'code',
                grant_type: 'refresh_token',
                scopes: ["user:details:self interactive:robot:self chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat chat:bypass_catbot chat:bypass_filter chat:clear_messages chat:giveaway_start chat:poll_start chat:remove_message chat:timeout chat:view_deleted chat:purge channel:details:self channel:update:self channel:clip:create:self"], // Scopes limit access for OAuth tokens.
                //redirectUri: "http://localhost:8081/auth/mixer2"

            };

            /*             var raw_code = /code=([^&]*)/.exec(req.url) || null,
                            code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
                            error = /\?error=(.+)$/.exec(req.url); */

            // If there is a code in the callback, proceed to get token from mixer
            if (1 === 1) {
                // console.log("code recieved: " + code);

                var postData = querystring.stringify({
                    "grant_type": options.grant_type,
                    "client_id": options.client_id,
                    "refresh_token": refreshToken
                });

                var post = {
                    host: "mixer.com",
                    path: "/api/v1/oauth/token",
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': postData.length,
                        "Accept": "application/json"
                    }
                };

                var req = https.request(post, function(response) {
                    var result = '';
                    response.on('data', function(data) {
                        result = result + data;
                    });
                    response.on('end', function() {

                        var invalid_grant = new RegExp("invalid_grant");


                        var raw_code = /code=([^&]*)/.exec(result.toString()) || null,
                            code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
                            error = invalid_grant.exec(result.toString());


                        if (error != null) {
                            log.info('invalid grant');
                            if (type === 'streamer') {
                                //does not work atm 01/10/2019 ??
                                io.emit('reauthstreamer', true);
                            } else {
                                //does not work atm 01/10/2019 ??
                                io.emit('reauthbot', true);
                            }

                            //return false
                        } else {
                            var json = JSON.parse(result.toString());
                            log.info("access token recieved: " + json.access_token);

                            //now set expiry date
                            //set token expiry in milliseconds 
                            // (remove 10 seconds just because)
                            var expiryInSeconds = json.expires_in - 10;
                            var expiryInMilliSeconds = expiryInSeconds * 1000;

                            //get milliseconds from 1970 till now and add milliseconds
                            var milliseconds = Date.now() + expiryInMilliSeconds;

                            //
                            var accessTokenExpiry = new Date(milliseconds);


                            json["access_token_expiry_date"] = accessTokenExpiry;


                            if (type == "streamer") {
                                checkStreamerTokenAndConnect(null, json.access_token, authDB);
                                SaveAuth(type, json.access_token, json.refresh_token, userName, accessTokenExpiry);

                            } else {
                                checkBotTokenAndConnect(null, json.access_token, authDB);
                                SaveAuth(type, json.access_token, json.refresh_token, userName, accessTokenExpiry);

                            }

                            //SaveAuth(type, json.access_token, json.refresh_token, json.username, accessTokenExpiry);


                        }
                        if (response && response.ok) {
                            // Success - Received Token.
                            // Store it in localStorage maybe?
                            log.info("Access Token Recieved for " + type + " - " + response.body.access_token);
                        }


                    });
                    response.on('error', function(err) {
                        log.error("MIXER OAUTH REQUEST ERROR: " + err.message);
                    });
                });

                req.write(postData);
                req.end();

            } else
            if (error) {
                log.info("Oops! Something went wrong and we couldn't refresh token. Please try again.");
            }
        }

    }

    function CreateTwitchObjects(BBBToken, message, channelToken, chatConnected, streamerName, botName, globalFollowers, authDBData) {


        if (BBBToken !== null) {

            if (BBBToken !== "") {
                //check token with introspect upon start of bot
                log.info('Checking Streamer Token');

                checkTwitchStreamerTokenAndConnect(null, BBBToken, authDBData);

            } else {
                //io.emit('unauthenticated', 'false');
                io.emit('reauthstreamer', 'false');
                log.info('ERROR - No Token found for Streamer account please authenticate');
            }



        } else {
            //io.emit('unauthenticated', 'false');
            io.emit('reauthstreamer', 'false');
            log.info('ERROR - No Token found for Streamer account please authenticate');




        }

    }


    // function CreateBeamObjects(BBBToken, message, channelToken, chatConnected, streamerName, botName, globalFollowers, authDBData) {

    //     if (BBBToken !== null) {

    //         if (BBBToken !== "") {
    //             //check token with introspect upon start of bot
    //             log.info('Checking Streamer Token');

    //             checkStreamerTokenAndConnect(null, BBBToken, authDBData);

    //         } else {
    //             //io.emit('unauthenticated', 'false');
    //             io.emit('reauthstreamer', 'false');
    //             log.info('ERROR - No Token found for Streamer account please authenticate');
    //         }



    //     } else {
    //         //io.emit('unauthenticated', 'false');
    //         io.emit('reauthstreamer', 'false');
    //         log.info('ERROR - No Token found for Streamer account please authenticate');




    //     }

    // }

    // function CreateBeamBotObjects(BBBTokenBot, message, channelToken, chatConnected, streamerName, botName, streamerChannel, globalFollowers, authDBData) {

    //     log.info('is bot Connected ?' + isConnected);


    //     if (BBBTokenBot != null) {

    //         if (BBBTokenBot !== "") {
    //             log.info('Checking Bot Token');
    //             checkBotTokenAndConnect(null, BBBTokenBot, authDBData);
    //         } else {
    //             io.emit('reauthbot', 'false');
    //             log.error('No Token found for Bot account please authenticate');
    //         }

    //     } else {
    //         io.emit('reauthbot', 'false');
    //         log.error('No Token found for Bot account please authenticate');


    //     }

    // }

    var MessageQueue = [];
    var currentmessageBeingSent = 0;
    var messageBeingSentID = 0;



    function sendMessageToChatWindowTwitch(data, isWhisper) {

        log.info('Sending Message to Chat window - tags', data.tags);

        let sendMessageBool = true;

        /*   User - A regular user. All Users have this.
                       Pro - A user who has an active Mixer Pro subscription will have this role.
                       Mod - A user will have this role if they are a moderator in the channel involved in this request.
                       GlobalMod - A user will have this role if they are a global moderator on Mixer.
                       Staff - A User will have this role if they are Mixer Staff.
                       Founder - A User will have this role if they are a Mixer Founder.
                       Owner - A user will have this role if they are the owner of the channel involved in this request. */

        // console.info(colors.red(`ChatMessage`));
        // console.info(colors.red(JSON.stringify(data)));

        //log.info('Message is: ' + JSON.stringify(data));
        let UserName = data.username;
        let channelIdMessageIsFor = data.channel;

        //twitch chat variables
        let DisplayName = data.tags.displayName
        let isSubscriber = data.tags.subscriber;
        let isMod = data.tags.mod;
        let badges = data.tags.badges;
        let twitchChatColour = data.tags.color;
        let userID = data.tags.userId;
        let isSelf = data.tags.isSelf;

        //this is to check if message is for caster's channel (turn into a method/fucntion)
        let streamerChannel = authDB.data.streamer.channelId;
        let botChannel = authDB.data.bot.channelId;

        log.info('Sending Message username ' + UserName);

        let t = '';


        //TODO parse message from twitch
        for (var key in data.message.message) {

            t += data.message.message[key].text;
        }

        //remove when twitch message has been processed properly
        t = data.message;

        //check if there is already a message 
        //with that id in the queue if so don't send it
        //obviously the first message is ignored as the queue is empty
        /*         if (MessageQueue.length > 0) {

                    var whereIs = MessageQueue.indexOf(data.id, 0);
                    //if message is already in queue then don't send to window
                    if (whereIs !== -1) {
                        //log.info('Duplicate Message do not send');
                        sendMessageBool = false;
                    }
                } */

        //not a duplicate message so push id to the array
        /*         if (sendMessageBool) {
                    //distinct message (i.e first message of a duplicate(s) or a unique message)
                    MessageQueue.push(data.id);
                }
         */

        //Queue Size (just stores ids for now but could store the entire array in json file somewhere)
        /*         if (MessageQueue.length > 10) {

                    // keep the last 5 messages to allow checking for duplicate messages
                    while (MessageQueue.length > 5) {
                        MessageQueue.pop();
                    }
                } */


        //send message or send first message of a duplicate

        //messageBeingSentID = data.id;


        // log.info('Is Duplicate' + sendMessageBool + ' message id is: ' + data.id + ' - with data ' + t);

        // if (currentmessageBeingSent != messageBeingSentID) {

        //     currentmessageBeingSent = messageBeingSentID;

        //     log.info('previous msg id = ' + currentmessageBeingSent + ' current message id = ' + data.id)

        //if (sendMessageBool) {


        if (data.tags.badges == undefined) {
            log.info(`${data.username}` + ' has no Level Defined')
        } else {
            //  console.info(`${data.user_name}` + ' is level ' + `${data.user_level}` + 'and is a ' + `${data.user_roles[0]}`)
        }

        /*             let UserName = data.user_name;

                    let t = '';

                    for (var key in data.message.message) {

                        t += data.message.message[key].text;
                    } */

        //send message to client window
        // io.emit('message', UserName + ' [' + data.user_roles[0] + '] - ' + t );


        //send message to client window better version
        // TODO get avatar from twitch profile (check API)
        let avatarUrl = data.user_avatar;
        if (avatarUrl == null) {
            avatarUrl = "https://mixer.com/_latest/assets/images/main/avatars/default.png";
        }

        io.emit('message', avatarUrl, 'Chat User', UserName, t, isWhisper);

        /// TODO add these in db and fetch when triggered
        // var splitTxt = '';
        // for (var key in data.message.message) {
        //     splitTxt += data.message.message[key].text;
        // };
        var text = t.split(' ');


        if (t.substr(0, 1) == "!") {

            //send to commandHandler to determine what to send to mixer
            processChatCommand(userCommands, text[0], data.tags.badges, UserName, ch, t, bc);


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
                var triggerResult = sendTriggerToTwitch(twitchChatBot, element, false);
            });



        }
        //}
        // } else {
        //     log.info('Duplicate Message - not sent Message ID: ' + data.id);
        // }
    }

    function confirmedChatMessageFromChatWindow() {

    }

    //change this to be either bot or streamer (this sends timers also)
    // function SendMessageToBeam(message, bc, bcBot, sendType) {

    //     log.info('sending message as ' + sendType)
    //     switch (sendType.toLowerCase()) {
    //         case "bot":
    //             sendMixerMessage(message, sendType, null, bcBot);
    //             break;
    //         case "streamer":
    //             sendMixerMessage(message, sendType, bc, null);
    //             break;
    //         case "timer":
    //             sendMixerMessage(message, sendType, null, bcBot);
    //             break;
    //         default:
    //             break;
    //     }


    // }

    function SendMessageToTwitch(message, bc, bcBot, sendType) {

        log.info('sending message as ' + sendType)
        switch (sendType.toLowerCase()) {
            case "bot":
                sendTwitchMessage(message, sendType, null, bcBot);
                break;
            case "streamer":
                sendTwitchMessage(message, sendType, bc, null);
                ProcessMessageSentFromBotUI(message , 'broadcaster' , 'schusteruk');
                break;
            case "timer":
                sendTwitchMessage(message, sendType, null, bcBot);
                break;
            default:
                break;
        }


    }

    // function sendMixerMessage(message, sendType, bc, bcBot) {

    //     if (sendType.toLowerCase() == "streamer") {
    //         if (bc == null || bc == undefined) {

    //             log.error('Streamer disconnected from chat Could not send message please connect to beam: - ' + message);

    //             //we don't want to emit unauthenticated more than once.
    //             unauthenticatedCounter = unauthenticatedCounter + 1;
    //             if (unauthenticatedCounter < 2) {
    //                 io.emit('unauthenticated', 'false');
    //             }


    //         } else {

    //             unauthenticatedCounter = 0;
    //             bc.say(message);

    //         }

    //     } else if (sendType.toLowerCase() == "bot") {
    //         if (bcBot == null || bcBot == undefined) {

    //             log.error('Bot disconnected from chat Could not send message please Authenticate: - ' + message);

    //             //we don't want to emit unauthenticated more than once.
    //             unauthenticatedCounter = unauthenticatedCounter + 1;
    //             if (unauthenticatedCounter < 2) {
    //                 io.emit('unauthenticated', 'false');
    //             }


    //         } else {
    //             log.info('Sending Messing as Bot');
    //             unauthenticatedCounter = 0;
    //             bcBot.say(message);
    //         }
    //     } else {
    //         // we may want to do something with timers so thats why its in here
    //         if (bcBot == null || bcBot == undefined) {

    //             log.info('Send Timer as Bot: - ' + message) //we don't want to emit unauthenticated more than once.
    //             unauthenticatedCounter = unauthenticatedCounter + 1;
    //             if (unauthenticatedCounter < 2) {
    //                 io.emit('unauthenticated', 'false');
    //             }
    //         } else {
    //             unauthenticatedCounter = 0;
    //             bcBot.say(message);
    //         }
    //     }

    // }



    // this should process the message as per twitch chat trigger
    function sendTwitchMessage(message, sendType, twitchClient, twitchBotClient) {

        if (sendType.toLowerCase() == "streamer") {
            if (twitchClient == null || twitchClient == undefined) {

                log.error('Streamer disconnected from chat Could not send message please connect to beam: - ' + message);

                //we don't want to emit unauthenticated more than once.
                unauthenticatedCounter = unauthenticatedCounter + 1;
                if (unauthenticatedCounter < 2) {
                    io.emit('unauthenticated', 'false');
                }


            } else {

                unauthenticatedCounter = 0;
                

                //send message to twitch from Bot UI (kinda useless comment but here anyway :))
                twitchClient.say(message);

            }

        } else if (sendType.toLowerCase() == "bot") {
            if (bcBot == null || bcBot == undefined) {

                log.error('Bot disconnected from chat Could not send message please Authenticate: - ' + message);

                //we don't want to emit unauthenticated more than once.
                unauthenticatedCounter = unauthenticatedCounter + 1;
                if (unauthenticatedCounter < 2) {
                    io.emit('unauthenticated', 'false');
                }


            } else {
                log.info('Sending Messing as Bot');
                unauthenticatedCounter = 0;
                bcBot.say(message);
            }
        } else {
            // we may want to do something with timers so thats why its in here
            //use bot account but using broadcaster for now
            //if (twitchBotClient == null || twitchBotClient == undefined) {
            if (twitchChat == null || twitchChat == undefined) {

                log.info('Send Timer as Bot: - ' + message) //we don't want to emit unauthenticated more than once.
                unauthenticatedCounter = unauthenticatedCounter + 1;
                if (unauthenticatedCounter < 2) {
                    io.emit('unauthenticated', 'false');
                }
            } else {
                unauthenticatedCounter = 0;
                twitchChat.say(message);
            }
        }

    }

    //change this to be either bot or streamer
    function sendTriggerToMixer(bcBot, message, isWhisper) {


        try {
            if (!isWhisper) {
                var returnResult = bcBot.botSay(message);
            } else {
                var returnResult = bc.whisper(authDB.data.streamer.username, message);
            }

        } catch (error) {
            log.error("sending trigger to mixer error" + error.message);
        } finally {

        }

        return returnResult;


    }


        //change this to be either bot or streamer
        function sendTriggerToTwitch(twitchChatBot, message, isWhisper) {


            try {
                if (!isWhisper) {
                    var returnResult = twitchChat.say(message);
                } else {
                    //TODO add twitch whisper
                    //var returnResult = bc.whisper(authDB.data.streamer.username, message);
                }
    
            } catch (error) {
                log.error("sending trigger to mixer error " + error.message);
            } finally {
    
            }
    
            return returnResult;
    
    
        }
    

    function checkFollowerName(bc, userName) {
        var userExist = bc.doesFollowerExist(userName);
        return userExist;
    }

    function ProcessMessageSentFromBotUI(message , type , user)
    {
        var text = message.split(' ');


            if (message.substr(0, 1) == "!") {

            //send to commandHandler to determine what to send to mixer
            processChatCommand(userCommands, text[0], type, user, ch, message, twitchChat);


            } else {

            //processes triggers
            var outputArray = [];


            //reload triggers in case they have been changed
            myTriggers.reload();
            // triggers to output
            myTriggers.data.triggers.forEach(element => {

                var isTriggerWord = message.includes(element.id, 0);

                if (isTriggerWord) {
                    //also check that the chat message isn't exactly as per the trigger output
                    if (message != element.text) {
                        outputArray.push(element.text);
                    }

                }

            });

            //now send each message to mixer (add first , last , all options in configuration)
            outputArray.forEach(element => {
                var triggerResult = sendTriggerToTwitch(twitchChat, element, false);
            });



        }
    }

    //processes command an emits message to mixer
    function processChatCommand(CommandList, command, user_roles, username, ch, fullcommand, twitchChat) {
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


            // this method processes ! commands (could be a command , note , quote etc..)


            //checks to see if the command is in the list
            var commandInDB = CommandList.data.commands.filter(function(item) { return (item.id == command); });


            //if command exists then check permissions and process command
            if (commandInDB.length > 0) {
                // is command in db ?

                log.info('command found: permission is: ' + commandInDB[0].permission);

                //is user allowed to use command ?
                var userAllowed = isUserPermitted(commandInDB[0].permission, commandInDB[0].user, username, user_roles, twitchChat); // get command's permission and return true is user is allowed otherwise false

                if (userAllowed) {
                    // process command and send to mixer
                    ch.say(username, commandInDB, user_roles, command, fullcommand, authDB.data.streamer.channelId , twitchChat);

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
                    case 'AddCommand':
                        processAddCommand(CommandList, fullcommand);
                        break;
                    case 'EditCommand':
                        processEditCommand(CommandList, fullcommand);
                        break;
                    case 'DeleteCommand':
                        processRemoveCommand(CommandList, fullcommand);
                        break;
                    case 'AddNote':
                        processAddNote(fullcommand);
                        break;
                        //can't edit notes atm
                        /*                     case 'EditNote':
                                                processEditNote(NoteList, fullcommand);
                                                break;
                                            case 'DeleteNote':
                                                processRemoveNote(CommandList, fullcommand);
                                                break; */
                    default:
                        break;
                }

                return false;
            }

        } catch (error) {
            // The error will tell you where the DataPath stopped. In this case test1
            // Since /test1/test does't exist.
            log.error('command ' + command + ' not found');
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


    function processAddUICurrency(Newcurrency, currency, action) {

        //we can mutate the object here
        currency.option1 = "";
        currency.option2 = "";
        //add currency to the file
        //Newcurrency.push("/currency[]", currency, true);

        cm.CreateAmendCurrency(Newcurrency, currency, action);


        //add a rank
        //Newcurrency.push('/currency[0]/ranks[]', { name: "test9", requirement: "50" }, true);
    }

    function processAddParentCurrencyDBEntry(parentCurrency, currency) {


        cm.CreateAmendParentCurrency(parentCurrency, currency);


        //add a rank
        //Newcurrency.push('/currency[0]/ranks[]', { name: "test9", requirement: "50" }, true);
    }

    function processAddUICurrencyRank(Newcurrency, currency, action) {

        currency.option1 = "";
        currency.option2 = "";
        cm.CreateAmendCurrencyRank(Newcurrency, currency, action);



    }

    function sendParentCurrenciesToUI(parentCurrency) {
        let parentCurrencyRows = cm.GetParentCurrencies(parentCurrency);

        if (parentCurrencyRows != undefined) {
            io.emit('receiveParentCurrency', parentCurrencyRows);
        }

    }

    function processReselectRanks(Newcurrency, currencyId, currencyName) {

        let ranks = cm.ReselectRank(Newcurrency, currencyId, currencyName);
        return ranks;
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
        myMedia.push("/media[]", mediaObject, true);
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
                        /*                     myHostAlerts.data.hostalerts[i].audiodur = mediaObject.audiodur;
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

    function processEditUINote(myNotes, fullcommand) {
        //need to work on feedback what happens if its successfull / unsuccessfull
        let commandToEdit = getNoteToAddEditDelUI(fullcommand);

        for (var i = 0, len = myNotes.data.notes.length; i < len; i++) {

            var iii = myNotes.data.notes[i];

            if (iii != undefined) {
                if (iii.id == commandToEdit) {

                    myNotes.data.notes[i].id = fullcommand.id;
                    myNotes.data.notes[i].note = fullcommand.note;
                    myNotes.data.notes[i].todo = fullcommand.todo;
                    myNotes.data.notes[i].priority = fullcommand.priority;
                    myNotes.data.notes[i].private = fullcommand.private;
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

    function checkCurrencyUIExists(Newcurrency, fullcommand) {
        var currencyExists = Newcurrency.data.currency.filter(function(item) { return (item.id == fullcommand.id); });
        //if exists it returns the command if not the length of var = 0
        return currencyExists;
    }

    function getActiveTimers(timerList) {
        var commandExists = timerList.data.timers.filter(function(item) { return (item.enabled == "Y"); });
        //if exists it returns the command if not the length of var = 0
        return commandExists;
    }

    function getOutstandingNotes() {

        var commandExists = myNotes.data.notes.filter(function(item) { return (item.todo == "Y"); });
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

    function processAddNote(fullcommand) {


        //need to work on feedback what happens if its successfull / unsuccessfull
        // its a note no need to check if it exists
        //var commandToCheckFor = checkCommandExists(myNotes, fullcommand);
        //if length = 0 then command does not exist therefore we can add it
        //if (commandToCheckFor.length == 0) {

        var note = new NoteObject(fullcommand);


        var noteObject = {

            id: note.cid,
            todo: note.ctodo,
            note: note.cnote,
            private: note.cprivate,
            priority: note.cpriority

        };
        //push command to the file
        // myNotes
        myNotes.push("/notes[]", noteObject, true);
        io.emit('addSaveSingleNote', noteObject);
        //  CommandList.push("/commands[]", note, true);
        //}
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

    function isUserPermitted(permissionType, specificUser, userThatRunCommand, badges, bc) {

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

//replace(/\//g, '')
            let user_roles = badges.replace(/\/[0-9]/g, '').split(','); 

            for (var i = 0, len = user_roles.length; i < len; i++) {


                var userRole = user_roles[i];

                if (userRole == 'broadcaster') {
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
                CRUDType = 'AddCommand';
                break;
            case ('!CommandEdit'):
                CRUDType = 'EditCommand';
                break;
            case ('!CommandDel'):
                CRUDType = 'DeleteCommand';
                break;
            case ('!NoteAdd'):
                CRUDType = 'AddNote';
                break;
            case ('!NoteEdit'):
                CRUDType = 'EditNote';
                break;
            case ('!NoteDel'):
                CRUDType = 'DeleteNote';
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
    // write this by inserting array using jsonDB push
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

            log.info(arrayOfObjects);

            fs.writeFile('./views/chatusers/users.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
                if (err) throw err
                log.info('AddUserToJoinGame in chatbotbeam2.js Done!')
            });
        });

    }

    function randomNumberFrom1(maxNumber) {

        // Math.floor((Math.random() * 100) + 1).toString()

        // console.log("Random Number to " + maxNumber.toString() + " is: " + Math.floor((Math.random() * maxNumber) + 1).toString());

        return Math.floor((Math.random() * maxNumber) + 1).toString();

    }

    function randomNumberFrom0(maxNumber) {

        // Math.floor((Math.random() * 100) ).toString()

        //  console.log("Random Number 0 to " + maxNumber.toString() + " is: " + Math.floor((Math.random() * maxNumber)).toString());

        return Math.floor((Math.random() * maxNumber));

    }

    //function FollowEvent(data) {
    //, images, sounds, followGfx we could make them random or specific
    // idea makes it so the alert is dynamic so more than one set of images and sound can be played
    function FollowEvent(data, audioFolder, imageFolder, videoFolder, myFollowAlerts) {
        /*  
            "id": "2",
            "audio": "firehorn.mp3",
            "video": "",
            "image": "alert1.gif",
            "text": "Muchas Gracias",
            "enabled": "Y" */

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


        /*     "id": "2",
            "audio": "",
            "audiodur": "",
            "video": "",
            "videodur": "5000",
            "image": "alert1.gif",
            "imagedur": "6000",
            "text": "Muchas Gracias",
            "enabled": "Y" */

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
            log.info('follow event triggered');

            //valid alert
            if (playType > 0) {
                addAlertToDB(dbAlerts, alertMsg);
            }

            /*        app.get('/overlay', function(req, res) {
                       *console.log('got response from overlay')
                       res.render('overlays/overlay.ejs');
                   }); */

            /*io.emit('followalert1');
            io.emit('followalert2');*/


        } catch (error) {
            log.error('error in follow message in chatbotbeam2.js' + error);
        }

    }

    function HostEvent(data, audioFolder, imageFolder, videoFolder, myHostAlerts) {
        /*  
            "id": "2",
            "audio": "firehorn.mp3",
            "video": "",
            "image": "alert1.gif",
            "text": "Muchas Gracias",
            "enabled": "Y" */
        let UserName = ""
        if (data.info == undefined) {
            UserName = "UserNotFound";
        } else {
            UserName = data.info.hoster.token;
        }

        //randomize the alert number

        if (myHostAlerts.data.hostalerts.length > 0) {
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


            /*     "id": "2",
                "audio": "",
                "audiodur": "",
                "video": "",
                "videodur": "5000",
                "image": "alert1.gif",
                "imagedur": "6000",
                "text": "Muchas Gracias",
                "enabled": "Y" */

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
                log.info('host event triggered');

                //valid alert
                if (playType > 0) {
                    addAlertToDB(dbAlerts, alertMsg);
                }

                /*        app.get('/overlay', function(req, res) {
                           *console.log('got response from overlay')
                           res.render('overlays/overlay.ejs');
                       }); */

                /*io.emit('followalert1');
                io.emit('followalert2');*/


            } catch (error) {
                log.error('error in follow message in chatbotbeam2.js' + error);
            }
        } else {
            //
            io.emit('NoAlertsSetup', 'You Have no Alerts setup on the bot');
        }


    }

    function CommandAlertEvent(commandInDB, UserName, videoFolder, soundFolder, imageFolder) {

        /*             var src = "../media/graphics/alert.gif";
                var audiosrc = "../media/sounds/sound1.mp3"; */

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
            log.info('command event triggered');

            //valid command (something to play)
            if (playType > 0) {
                addAlertToDB(dbAlerts, alertMsg);
            }
            /*        app.get('/overlay', function(req, res) {
                       *console.log('got response from overlay')
                       res.render('overlays/overlay.ejs');
                   }); */

            /*io.emit('followalert1');
            io.emit('followalert2');*/


        } catch (error) {
            log.error('error in follow message in app.js' + error);
        }

    };

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

        log.info('Saving Theme');

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

    function addAlertToDB(dbAlerts, alertMSG) {

        //adds item to queue
        var alertsInQueue = Object.keys(dbAlerts.getData("/alerts")).length;

        log.info("Alerts in queue: " + alertsInQueue);

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

            SendMessageToTwitch(message, bc, bcBot, "streamer");

        }, duration);

    };


    function addAlltimersSchedule(myTimers) {
        myTimers.reload();



        if (myTimers.data.timers != undefined) {

            var activeTimers = getActiveTimers(myTimers);

            var intervalCooldown = 0;
            // for (var timerCnt = 0, len = myTimers.data.timers.length; timerCnt < len; timerCnt++) {

            for (var timerCnt = 0, len = activeTimers.length; timerCnt < len; timerCnt++) {

                // var duration2 = myTimers.data.timers[timerCnt].interval;
                // let textForTimer = myTimers.data.timers[timerCnt].text;

                var duration2 = activeTimers[timerCnt].interval;
                let textForTimer = activeTimers[timerCnt].text;

                //add minute to duration e.g. if timer is 5 minutes and its the 3rd timer this will be 8 minutes
                duration2 = duration2 + intervalCooldown;

                //the boolean at the end false = repeat , true = once
                Scheduler.add(function(activeTimers) { SendMessageToTwitch(textForTimer, bc, bcBot, "timer") }, null, duration2 / 10, true);

                //interval between timers 
                //(first timer doesn't have an interval because interval increments after add is called)
                intervalCooldown = intervalCooldown + 60000; //hardcoded to 1 minute for now

            };
        }

    }

    function addToArray(message, duration) {
        /*     timers.push(setTimeout(function run() {
                *console.log("adding timer" + message);
                SendMessageToBeam(message);
                setTimeout(run, duration);
            }, duration)); */

        timers.push(

            setInterval(function() {

                SendMessageToBeam(message, bc, bcBot, "bot");

            }, duration)

        );
    }


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

            var objt = BuildNote(data);

            this.cid = objt.cid;
            this.ctodo = objt.ctodo;
            this.cnote = objt.cnote;
            this.cprivate = objt.cprivate;
            this.cpriority = objt.cpriority;

        }

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



        /*        commandVariables.forEach(function(element) {



                   if (element.contains('$gfx')) {
                       //valid perms
                       commandVariables.shift();
                   }

                   if (element.contains('$sfx')) {
                       //valid perms
                       commandVariables.shift();
                   }

                   if (element.contains('$img')) {
                       //valid perms
                       commandVariables.shift();
                   }

               }); */

        /*         commandVariables.forEach(function(a) {

                    if (typeof(a) == 'string' && a.indexOf('$gfx') > -1) {
                        *console.log(a);
                        commandVariables[a.indexOf('$gfx')].pop();;
                    }

                }) */

        commandVariables.slice().forEach(function iterator(value, index, collection) {
            //console.log("Visiting:", value);
            if (typeof(value) == 'string' && value.indexOf('$gfx') > -1) {
                // Delete current value.
                commandVariables.splice(index, 1);
            }

            if (typeof(value) == 'string' && value.indexOf('$sfx') > -1) {
                // Delete current value.
                commandVariables.splice(index, 1);
            }


            if (typeof(value) == 'string' && value.indexOf('$img') > -1) {
                // Delete current value.
                commandVariables.splice(index, 1);
            }
        });


        commandVariables.forEach(
            function iterator(value, index, collection) {
                //console.log("Visiting:", value);
                if (typeof(value) == 'string' && value.indexOf('$sfx') > -1) {
                    // Delete current value.
                    // --
                    // NOTE: We have already logged this value out, so this action will
                    // affect the length of the collection, but not the logging of this
                    // particular item.
                    commandVariables.splice(index, 1);
                }

            }
        );

        commandVariables.forEach(
            function iterator(value, index, collection) {
                //console.log("Visiting:", value);
                if (typeof(value) == 'string' && value.indexOf('$img') > -1) {
                    // Delete current value.
                    // --
                    // NOTE: We have already logged this value out, so this action will
                    // affect the length of the collection, but not the logging of this
                    // particular item.
                    commandVariables.splice(index, 1);
                }

            }
        );

        commandVariables.forEach(
            function iterator(value, index, collection) {
                //console.log("Visiting:", value);
                if (typeof(value) == 'string' && value.indexOf('$gfx') > -1) {
                    // Delete current value.
                    // --
                    // NOTE: We have already logged this value out, so this action will
                    // affect the length of the collection, but not the logging of this
                    // particular item.
                    commandVariables.splice(index, 1);
                }

            }
        );


        //!CommandAdd!commandName +m
        // $channelInfo$target[$target has $sparks sparks and is a level $level]
        // $caster has been on
        // for $uptime
        // $gfx(gfx.gif)
        // $sfx(audio.mp3)
        // $img(img.png)

        //join to make datacopy hold the command variables, we will then remove special stuff from command variables
        dataCopy = commandVariables.join(' ');


        /*   //gets special variables in brackets
          var specialVariablesArray = dataCopy.match(/ *\[[^\]]*]/g);


          if (specialVariablesArray != null) {
              specialVariablesArray.forEach(element => {
                  commandVariables = dataCopy.replace(/ *\[[^\]]*]/, '');
              });
          } */

        //  commandVariables = commandVariables.split(' ');
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

    function SaveAuth(type, token, refresh_token, username, authTokenExpiry) {
        //type = streamer or bot
        userInfo(type, token, refresh_token, null, username, authTokenExpiry)
    };


    function SaveTwitchAuth(type, token, refresh_token, username, authTokenExpiry, user_data) {
        //type = streamer or bot
        twitchUserInfo(type, token, refresh_token, null, authTokenExpiry, user_data)
    };



    function twitchUserInfo(type, accessToken, refreshToken, authedForClips = false, authTokenExpiry, userData) {



        let otherType = type.toLowerCase() === "bot" ? "streamer" : "bot";

        ////get other username logged in and other username
        //let otherLoggedIn = service.accounts[otherType].isLoggedIn;
        // let otherUsername = service.accounts[otherType].username;

        let otherLoggedIn = false;
        let otherUsername = type;

        if (otherLoggedIn && otherUsername === userData.login) {
            //  utilityService.showErrorModal('You cannot sign into the same account for both Streamer and Bot. The bot account should be a seperate account. If you dont have a seperate account, simply dont use the Bot account feature, it is not required.');
        } else {


            // if streamer account then check if the userId = 0 (i.e. new install) then get streamer data
            // also if userId != 0 and userId != data.userId then different streamer so get streamer data (future function)
            let isNewOrDiffStreamer = false;
            if (type == "streamer") {
                //
                if (authDB.data.streamer.userId == 0) {

                    isNewOrDiffStreamer = true;

                }
            }



            // Push all to db.
            authDB.push('./' + type + '/username', userData.login);
            authDB.push('./' + type + '/userId', userData.id);
            authDB.push('./' + type + '/channelId', userData.login);
            authDB.push('./' + type + '/avatar', userData.profile_image_url);
            authDB.push('./' + type + '/accessToken', accessToken);
            authDB.push('./' + type + '/refreshToken', null);
            authDB.push('./' + type + '/authedForClips', authedForClips === true);
            authDB.push('./' + type + '/accessTokenExpiry', null);


            if (isNewOrDiffStreamer) {
                initTwitchData(authDB);
            }
            authDB.reload();

        }

    };



    function userInfo(type, accessToken, refreshToken, authedForClips = false, username, authTokenExpiry) {



        let otherType = type.toLowerCase() === "bot" ? "streamer" : "bot";

        ////get other username logged in and other username
        //let otherLoggedIn = service.accounts[otherType].isLoggedIn;
        // let otherUsername = service.accounts[otherType].username;

        let otherLoggedIn = false;
        let otherUsername = type;

        if (otherLoggedIn && otherUsername === username) {
            //  utilityService.showErrorModal('You cannot sign into the same account for both Streamer and Bot. The bot account should be a seperate account. If you dont have a seperate account, simply dont use the Bot account feature, it is not required.');
        } else {


            // Request channel info
            // We do this to get the sub icon to use in the chat window.
            request({
                    url: 'https://mixer.com/api/v1/channels/' + username
                }, function(err, res) {
                    let data = JSON.parse(res.body);

                    // if streamer account then check if the userId = 0 (i.e. new install) then get streamer data
                    // also if userId != 0 and userId != data.userId then different streamer so get streamer data (future function)
                    let isNewOrDiffStreamer = false;
                    if (type == "streamer") {
                        //
                        if (authDB.data.streamer.userId == 0) {

                            isNewOrDiffStreamer = true;

                        }
                    }



                    // Push all to db.
                    authDB.push('./' + type + '/username', data.user.username);
                    authDB.push('./' + type + '/userId', data.userId);
                    authDB.push('./' + type + '/channelId', data.id);
                    authDB.push('./' + type + '/avatar', data.user.avatarUrl);
                    authDB.push('./' + type + '/accessToken', accessToken);
                    authDB.push('./' + type + '/refreshToken', refreshToken);
                    authDB.push('./' + type + '/authedForClips', authedForClips === true);
                    authDB.push('./' + type + '/accessTokenExpiry', authTokenExpiry);



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

                    if (isNewOrDiffStreamer) {
                        initBeamData(authDB);
                    }

                    authDB.reload();

                }


            );


        }

    };

    //need a permission (i.e. who is allowed to add note and a note type (i.e. private,public))
    /*     function BuildNoteold(data) {

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



             if (cName.substr(0, 1) == "!") {
                    //valid command name
                }

                if (cPerms.substr(0, 1) == "+") {
                    //valid command name
                } 




            commandText = commandText.replace(/  +/g, ' ');

            var commandObjectJson = {
                cid: cName,
                cpermission: cPerms,
                ctext: commandText,
                cenabled: "Y"
            };

            return commandObjectJson;
        }; */

    //this is called when a note is added in chat
    function BuildNote(data) {

        //var data = document.getElementById('test').value;


        //         "id": "n01810201840",
        //   "todo": "Y",
        //   "note": "either i did it wrong or the timeout 5m button doesn't work"

        var dataCopy = data;

        var cPerms = ""; //dataCopy.split(' ')[2];
        var cPriority = ""; //dataCopy.split(' ')[2];
        var commandText = "" // this is the text that goes in the text property in command object

        var commandVariables = dataCopy.split(' ');

        var cName = ""

        var dayWeek = dateIn.getDay();
        var dayNo = dateIn.getDate();
        var monthName = dateIn.getMonth();
        var yearstr = dateIn.getFullYear();
        var hoursValue = dateIn.getHours() + dateIn.getMinutes() + dateIn.getSeconds();



        cName = 'n' + dayWeek + dayNo + monthName + yearstr + hoursValue;

        if (commandVariables[0].substr(0, 1) == "!") {
            //valid commandadd name
            commandVariables.shift();
        }

        if (commandVariables[0].substr(0, 2) == "+p") {
            //valid command name
            cPerms = commandVariables[0].substr(1, 2);
            commandVariables.shift();
        }

        if (commandVariables[0].substr(0, 2) == "+h") {
            //valid command name
            cPriority = commandVariables[0].substr(1, 2);
            commandVariables.shift();
        }

        if (commandVariables[0].substr(0, 2) == "+l") {
            //valid command name
            cPriority = commandVariables[0].substr(1, 2);
            commandVariables.shift();
        }

        if (commandVariables.length > 0) {
            commandText = commandVariables.join(' ');
        }

        var cTodo = "Y";

        if (cPerms.length > 0) {
            cPerms = true;
        } else {
            cPerms = false;
        }

        if (cPriority.length > 0) {

            switch (cPriority) {
                case "h":
                    //cPriority = "High"
                    cPriority = "Y"
                    break;
                case "m":
                    //cPriority = "Medium"
                    cPriority = "N"
                    break;
                case "l":
                    //cPriority = "Low"
                    cPriority = "N"
                    break;
                default:
                    break;
            }

        } else {
            cPriority = "N";
        }

        log.info("Build Note - " + commandText);

        var commandObjectJson = {
            cid: cName,
            ctodo: cTodo,
            cnote: commandText,
            cprivate: cPerms,
            cpriority: cPriority
        };

        return commandObjectJson;
    };

    //
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
    exports.checkBotTokenAndConnect = checkBotTokenAndConnect;
    exports.checkStreamerTokenAndConnect = checkStreamerTokenAndConnect;
    exports.ConnectOnLogin = ConnectOnLogin;
    exports.SaveAuthToken = SaveAuthToken;

}());