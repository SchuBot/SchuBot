//requires
let util = require('util');
let events = require('events');
let botConfig = require('../config.js');
var request = require('request');
var JsonDB = require('node-json-db');

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

//module
let beamchatbot = function(authTokenBot, chatConnectedBot, streamerChannel) {

    if (authTokenBot) {

        console.log('accessing beam chat js ' + authTokenBot);

        const BeamClient = require('beam-client-node');
        const BeamSocket = require('beam-client-node/lib/ws');
        const colors = require('colors');
        const clientBot = new BeamClient();

        //let userInfo;
        let self = this;

        let socketBot;



        // With OAuth we don't need to login, the OAuth Provider will attach
        // the required information to all of our requests after this call.
        clientBot.use('oauth', {
            tokens: {
                //access: botConfig.beam.ownerchatoauth,
                //access: botConfig.beam.botoauth,
                access: authTokenBot,
                expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
            },
        });

        // Get's the user we have access to with the token
        userInfo = connectToBeamBot(clientBot, authTokenBot, createChatSocketBot, self, false, chatConnectedBot, streamerChannel);

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

            socketBot = new BeamSocket(endpoints).boot();

            console.log('accessing beam chat socket js');

            socketBot.on('UserJoin', data => {
                self.emit('UserJoin', data);

            });
            socketBot.on('UserLeave', data => {
                self.emit('UserLeave', data);
            });

            socketBot.on('ChatMessage', data => {
                // messagessent = messagessent + 1;
                //console.log('Message Sent from Beam ' + messagessent + ' times');

                try {
                    self.emit('ChatMessage', data);
                } catch (error) {
                    console.log('error sending to beam' + error);
                }

            });

            socketBot.on('error', error => {

                //console.log('socket error, Socket info is: ' + JSON.stringify(socket));
                //need to work on connection retry but connect immediately everytime it errors out

                if (!chatConnectedBot) {
                    console.log(' Reconnecting to chat...');
                    connectToBeamBot(clientBot, authTokenReconnect, createChatSocketBot, self, true, chatConnectedBot, streamerChannel);
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
                    self.emit('PurgeMessage', data);

                } else {
                    //otherwise it was the result of a ban
                    self.emit('PurgeMessageBan', data);
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

                    console.log('logged into beam chat with ' + userId + ' onto channel ' + streamerChannel);
                    chatConnectedBot = true;
                    //   console.log(colors.yellow('Beam Chat Login'));

                });
        }

        self.clienthtml2 = function(msg) {
            try {

                if (socketBot.status == 1) {
                    // console.log('sending msg to Mixer' + JSON.stringify(msg));
                    socketBot.call('msg', [`${msg}`]);
                } else {

                }


            } catch (error) {
                console.log('error in beamchatbot.js self.clienthtml' + error)
            }

        }

        //exports
        self.botSay = function(msg) {

            socketBot.call('msg', [`${msg}`]);
        }

    }
};

beamchatbot.prototype = new events.EventEmitter;

module.exports = beamchatbot;
//function connectToBeam(client, userInfo, authToken, createChatSocket, self) {
function connectToBeamBot(clientBot, authTokenBot, createChatSocketBot, self, useAuth, chatConnectedBot, streamerChannel) {

    // console.log("use auth value is: " + useAuth);
    // console.log("use magic token is: " + authToken);
    if (useAuth) {
        clientBot.use('oauth', {
            tokens: {
                //access: botConfig.beam.ownerchatoauth,
                //access: botConfig.beam.botoauth,
                access: authTokenBot,
                expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
            },
        });

    }


    clientBot.request('GET', `users/current`)
        .then(response => {

            console.log('Getting Current User data response 1 user id: ' + response.body.id + ' username:' + response.body.username);
            userInfo = response.body;
            //console.log(JSON.stringify(userInfo));

            console.log('response 1 ' + userInfo.id + ' getting user info ');
            //console.log(userInfo.channel.id);
            //channel id
            beamChannelID = userInfo.channel.id;
            numFollowers = userInfo.channel.numFollowers;


            return clientBot.chat.join(streamerChannel);
        })
        .then(response => {
            const body = response.body;
            //these are to be removed
            console.log('User ' + userInfo.id + ' has joined channel ' + schuChanID);
            console.log('bot body auth key is ' + body.authkey);
            console.log('bot auth key is ' + authTokenBot);
            /*         console.log('User ' + userInfo.id + ' special something ' + authToken); */
            // console.log(body)
            // return createChatSocket(userInfo.id, chanID, body.endpoints, body.authkey);
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