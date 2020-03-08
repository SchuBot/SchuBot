//requires
let util = require('util');
let events = require('events');
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

/* variables used for testing */
var channelId = 582310;
var userId = 949494; //shoryuken userid

var foxyChanID = 540276;
var schuChanID = 582310;
var schuUserId = 862913;

let userInfo;

let authTokenReconnectBot;

const log = require('electron-log');


//module
let beamchatbot = function(authTokenBot, chatConnectedBot, streamerChannel, authDB) {

    if (authTokenBot) {

        console.log('mixer bot token exists ' + authTokenBot);

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

            console.log('bot client id is: ' + userId);
            if (userId == null) {

            }

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
                    console.log('error sending to beam' + error);
                }

            });

            socketBot.on('error', error => {

                //console.log('socket error, Socket info is: ' + JSON.stringify(socket));
                //need to work on connection retry but connect immediately everytime it errors out
                console.log('Chat Error...' + error.message);
                if (!chatConnectedBot) {
                    console.log(' Reconnecting to chat...');
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

                //if purge has moderator, it was a timeout/purge
                if (data.moderator !== undefined) {
                    //this was purge or timeout
                    self.emit('PurgeOrTimeoutMessage', data);

                } else {
                    //otherwise it was the result of a ban
                    self.emit('UserBanned', data);
                }

            });

            socketBot.on('DeleteMessage', data => {
                self.emit('DeleteMessage', data);
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

                    log.info('Bot ' + userId + ' has joined channel ' + streamerChannel);

                    self.emit('botLoggedIn', authDB.data.bot.username);

                    chatConnectedBot = true;
                    isConnected = true;
                    //   console.log(colors.yellow('Beam Chat Login'));

                });


        }

        self.clienthtml2 = function(msg) {
            try {

                if (socketBot.status == 1) {
                    // console.log('sending msg to Mixer' + JSON.stringify(msg));
                    socketBot.call('msg', [`${msg}`]).catch(error => { console.log('Bot client html2 caught', error.message) });
                } else {

                }


            } catch (error) {
                console.log('error in beamchatbot.js self.clienthtml' + error)
            }

        }

        //exports
        self.botSay = function(msg) {

            socketBot.call('msg', [`${msg}`]).catch(error => {
                log.info('Bot Say caught', error.message)
            });
        }

        self.say = function(msg) {

            socketBot.call('msg', [`${msg}`]).catch(error => {
                log.info('Bot Say caught', error.message)
            });
        }

        self.whisper = function(username, msg) {
            console.log('in whisper function' + msg);
            socketBot.call('whisper', [username, `${msg}`]).catch(error => { console.log('Bot Whisper caught', error.message) });
        }

        self.poll = function(q, a, t) {
            socketBot.call('vote:start', [q, a, t]).catch(error => { console.log('Bot Poll caught', error.message) });
        }


    }
};

beamchatbot.prototype = new events.EventEmitter;

module.exports = beamchatbot;
//function connectToBeam(client, userInfo, authToken, createChatSocket, self) {
function connectToBeamBot(clientBot, authTokenBot, createChatSocketBot, self, useAuth, chatConnectedBot, streamerChannel, botName) {

    console.log('connecting to mixer chat');

    if (useAuth) {
        console.log('Use bot Auth in connectToBeamBot method ' + useAuth);
        clientBot.use(new Mixer.OAuthProvider(client, {
            tokens: {
                access: authTokenBot,
                expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
            },
        }));

    }


    clientBot.request('GET', `users/current`)
        .then(response => {

            console.log('Getting Current User data response 1 user id: ' + response.body.id + ' username:' + response.body.username);
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
            console.log('error in chat connection request: ' + error);
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
                        self.emit('FollowerCount', followers.followers);
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