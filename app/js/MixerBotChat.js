//requires
let util = require('util');
let EventEmitter = require('events').EventEmitter;
let botConfig = require('./config.js');
var request = require('request');
var JsonDB = require('node-json-db');
const Mixer = require('@mixer/client-node');
const ws = require('ws');

let beamChannelID;
let numFollowers;

var followers = [];
var followers = {
    followers: []
};

var following = [];
var following = {
    following: []
};

var chatUsers = [];

let userInfo;

let authTokenReconnectBot;

const log = require('electron-log');


//module
class MixerBotChat extends EventEmitter {
    constructor(authTokenBot, chatConnectedBot, streamerChannel, authDB) {
        super();
        if (authTokenBot) {

            //log.info('mixer bot token exists ' + authTokenBot);
            const colors = require('colors');
            const clientBot = new Mixer.Client(new Mixer.DefaultRequestRunner());
            //let userInfo;
            var self = this;
            let socketBot;
            // With OAuth we don't need to login, the OAuth Provider will attach
            // the required information to all of our requests after this call.
            clientBot.use(new Mixer.OAuthProvider(clientBot, {
                tokens: {
                    access: authTokenBot,
                    expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
                },
            }));
            // Get's the user we have access to with the token
            userInfo = connectToBeamBot(clientBot, authTokenBot, createChatSocketBot, self, false, chatConnectedBot, streamerChannel, authDB.data.bot.username);
            authTokenReconnectBot = authTokenBot;
            /**
             * Creates a beam chat socket and sets up listeners to various chat events.
             * @param {any} userId The user to authenticate as
             * @param {any} channelId The channel id to join
             * @param {any} endpoints An endpoints array from a beam.chat.join call.
             * @param {any} authkey An authentication key from a beam.chat.join call.
             * @returns {Promise.<>}
             */
            //  var messagessent = 0;
            function createChatSocketBot(userId, streamerChannel, endpoints, authkey, chatConnectedBot) {
                log.info('bot client id is: ' + userId);
                if (userId == null) {}
                socketBot = new Mixer.Socket(ws, endpoints).boot();
                // console.log('accessing beam chat socket js');
                socketBot.on('UserJoin', data => {
                    self.emit('UserJoin', data);
                });
                socketBot.on('UserLeave', data => {
                    self.emit('UserLeave', data);
                });
                socketBot.on('ChatMessage', data => {
                    try {
                        self.emit('ChatMessage', data);
                    } catch (error) {
                        log.error('error sending to beam' + error);
                    }
                });
                socketBot.on('error', error => {
                    //console.log('socket error, Socket info is: ' + JSON.stringify(socket));
                    //need to work on connection retry but connect immediately everytime it errors out
                    log.error('Chat Error...' + error.message);
                    if (!chatConnectedBot) {
                        log.info(' Reconnecting to chat...');
                        connectToBeamBot(clientBot, authTokenReconnect, createChatSocketBot, self, true, chatConnectedBot, authDB.data.streamer.channelId, authDB.data.bot.username);
                    }
                });
                socketBot.on('PollStart', data => {
                    self.emit('PollStart', data);
                });
                socketBot.on('PollEnd', data => {
                    self.emit('PollEnd', data);
                });
                // Purge Message
                // Provides a moderator object if messages purged due to a ban.
                socketBot.on('PurgeMessage', data => {

                    /* 
                                        "moderator":{
                                            "user_name":"Schuster",
                                            "user_id":862913,
                                            "user_roles":["Owner"],
                                            "user_level":121},
                                            "user_id":949494,
                                            "cause":
                                                {
                                                    "type":"timeout"
                                                    ,"durationString":"5m"
                                                } */






                    //if purge has moderator, it was a timeout/purge
                    if (data.cause.type == "timeout") {
                        //this was purge or timeout
                        self.emit('MixerTimeout', data);
                    } else if (data.cause.type == "ban") {
                        //otherwise it was the result of a ban
                        self.emit('MixerBan', data);
                    } else if (data.cause.type == "globaltimeout") {
                        self.emit('MixerTimeout', data);
                    }



                });
                socketBot.on('DeleteMessage', data => {
                    self.emit('MixerDelete', data);
                });
                socketBot.on('ClearMessages', data => {
                    self.emit('ClearMessages', data);
                });
                socketBot.on('UserUpdate', data => {
                    self.emit('UserUpdate', data);
                });
                //don't think this one is ever fired
                socketBot.on('UserTimeout', data => {
                    self.emit('UserTimeout', data);
                });
                return socketBot.auth(streamerChannel, userId, authkey)
                    .then(() => {
                        log.info('Bot UserId: ' + userId + ' has joined channel ' + streamerChannel);
                        self.emit('botLoggedIn', authDB.data.bot.username);

                        //   console.log(colors.yellow('Beam Chat Login'));
                    });
            }
            self.clienthtml2 = function(msg) {
                try {
                    if (socketBot.status == 1) {
                        // console.log('sending msg to Mixer' + JSON.stringify(msg));
                        socketBot.call('msg', [`${msg}`]).catch(error => { log.error('Bot client html2 caught', error.message); });
                    } else {}
                } catch (error) {
                    log.error('error in beamchatbot.js self.clienthtml' + error);
                }
            };
            //exports
            self.botSay = function(msg) {
                socketBot.call('msg', [`${msg}`]).catch(error => {
                    log.info('Bot Say caught', error.message);
                });
            };
            self.say = function(msg) {
                socketBot.call('msg', [`${msg}`]).catch(error => {
                    log.error('Bot Say caught', error.message);
                });
            };
            self.whisper = function(username, msg) {
                log.info('in whisper function' + msg);
                socketBot.call('whisper', [username, `${msg}`]).catch(error => { log.error('Bot Whisper caught', error.message); });
            };
            self.poll = function(q, a, t) {
                socketBot.call('vote:start', [q, a, t]).catch(error => { log.error('Bot Poll caught', error.message); });
            };
        }
    }
}

module.exports = MixerBotChat;

//function connectToBeam(client, userInfo, authToken, createChatSocket, self) {
function connectToBeamBot(clientBot, authTokenBot, createChatSocketBot, self, useAuth, chatConnectedBot, streamerChannel, botName) {

    log.info('connecting to mixer chat');

    if (useAuth) {
        log.info('Use bot Auth in connectToBeamBot method ' + useAuth);
        clientBot.use(new Mixer.OAuthProvider(client, {
            tokens: {
                access: authTokenBot,
                expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
            },
        }));

    }


    clientBot.request('GET', `users/current`)
        .then(response => {

            log.info('Getting Current User data response 1 user id: ' + response.body.id + ' username:' + response.body.username);
            userInfo = response.body;
            //console.log(JSON.stringify(userInfo));

            //  console.log('response 1 ' + userInfo.id + ' getting user info ');
            //console.log(userInfo.channel.id);
            //channel id
            beamChannelID = userInfo.channel.id;
            numFollowers = userInfo.channel.numFollowers;


            //return clientBot.chat.join(streamerChannel);
            return new Mixer.ChatService(clientBot).join(streamerChannel);
        })
        .then(response => {
            const body = response.body;


            return createChatSocketBot(userInfo.id, streamerChannel, body.endpoints, body.authkey, chatConnectedBot);
        })
        .catch(error => {
            log.error('error in chat connection request: ' + error);
            self.emit('socketerror', error);
        });
    // return userInfo;
}

/* self.getChatUsers = function() {
    let page = 0;
    var totalFollowers = 0;
    var requestSize = 40;
    var requestsToCompletion = 0;
    var numToGetAllFollowers = 0;
    var remainingFollowersToGet = 0;

    const run = (page) => {
        return client.request('GET', `/chats/${schuChanID}/users`, {
            qs: {
                page,
                limit: 100,
                order: 'userName:asc', 
                fields: 'userId,userName,userRoles',
            },
        }).then(res => {

            //do something with the response
            return run(page + 1);
        });
    };
    return run(0);

} 

   let page = 0;
            var totalFollowers = 0;
            var requestSize = 100;
            var requestsToCompletion = 0;
            var numToGetAllFollowers = 0;
            var remainingFollowersToGet = 0;

            //var myChanId = beamChannelID;

            const run = (page) => {

                return client.request('GET', `channels/${schuChanID}/follow`, {
                    qs: {
                        page,
                        limit: requestSize,
                     
                        fields: 'avatarUrl,followed,id,username,channel',
                        
                    },
                }).then(res => {

                    addfollowerItem(res);

                    //totalFollowers = res.headers["x-total-count"];
                    totalFollowers = numFollowers; //res.body.channel["numFollowers"];

                    // gets runs required
                    requestsToCompletion = totalFollowers - requestSize;
                    //  console.log('requestsToCompletion: ' + requestsToCompletion);
                    if (page == 0) {

                        if (requestsToCompletion > 0) {
                            numToGetAllFollowers = Math.ceil(requestsToCompletion / requestSize);
                        } else {
                            numToGetAllFollowers = 0;
                        }
                    }

                    if (numToGetAllFollowers == 0) {
                        //  console.log('numFollowers: ' + res.headers["x-total-count"]);
                        self.emit('F-ollowerCount', followers.followers);
                        return;
                    }
                    numToGetAllFollowers = numToGetAllFollowers - 1;

                    return run(page + 1);
                });
            };

            return run(0);

*/

//kill node
//taskkill /F /IM node.exe