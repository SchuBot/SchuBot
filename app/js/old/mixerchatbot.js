//requires
let util = require('util');
let events = require('events');
let botConfig = require('../config.js');
var request = require('request');
var JsonDB = require('node-json-db');
const Mixer = require('@mixer/client-node');

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

let authTokenReconnect;

//module
let beamchatbot = function(authToken, chatConnected) {

    if (authToken) {

        console.log('accessing beam chat js ' + authToken);

        /*         const BeamClient = require('beam-client-node');
                const BeamSocket = require('beam-client-node/lib/ws'); */


        const ws = require('ws');

        const colors = require('colors');
        //  const client = new BeamClient();

        const client = new Mixer.Client(new Mixer.DefaultRequestRunner());

        //let userInfo;
        let self = this;

        let socket;



        // With OAuth we don't need to login, the OAuth Provider will attach
        // the required information to all of our requests after this call.
        /*         client.use('oauth', {
                    tokens: {
                        //access: botConfig.beam.ownerchatoauth,
                        //access: botConfig.beam.botoauth,
                        access: authToken,
                        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
                    },
                }); */

        client.use(new Mixer.OAuthProvider(client, {
            tokens: {
                access: authToken,
                expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
            },
        }));

        // Get's the user we have access to with the token
        userInfo = connectToBeam(client, authToken, createChatSocket, self, false, chatConnected);

        authTokenReconnect = authToken;

        /**
         * Creates a beam chat socket and sets up listeners to various chat events.
         * @param {any} userId The user to authenticate as
         * @param {any} channelId The channel id to join
         * @param {any} endpoints An endpoints array from a beam.chat.join call.
         * @param {any} authkey An authentication key from a beam.chat.join call.
         * @returns {Promise.<>}
         */

        //  var messagessent = 0;
        function createChatSocket(userId, channelId, endpoints, authkey, chatConnected) {

            if (userId == null) {

            }

            socket = new Mixer.Socket(ws, endpoints).boot();

            console.log('accessing beam chat socket js');

            socket.on('UserJoin', data => {
                self.emit('UserJoin', data);

            });
            socket.on('UserLeave', data => {
                self.emit('UserLeave', data);
            });

            socket.on('ChatMessage', data => {
                // messagessent = messagessent + 1;
                //console.log('Message Sent from Beam ' + messagessent + ' times');

                try {
                    self.emit('ChatMessage', data);
                } catch (error) {
                    console.log('error sending to beam' + error);
                }

            });

            socket.on('error', error => {

                //console.log('socket error, Socket info is: ' + JSON.stringify(socket));
                //need to work on connection retry but connect immediately everytime it errors out



                if (!chatConnected) {
                    console.log(' Reconnecting to chat...');
                    connectToBeam(client, authTokenReconnect, createChatSocket, self, true, chatConnected);
                }


                //userInfo = connectToBeam(client, authTokenReconnect, createChatSocket, self, true);

                // self.emit('error', error);
            });
            socket.on('PollStart', data => {
                self.emit('PollStart', data);
            });
            socket.on('PollEnd', data => {
                self.emit('PollEnd', data);
            });

            // Purge Message
            // Provides a moderator object if messages purged due to a ban.
            socket.on('PurgeMessage', data => {

                //if purge has moderator, it was a timeout/purge
                if (data.moderator !== undefined) {
                    //this was purge or timeout
                    self.emit('PurgeMessage', data);

                } else {
                    //otherwise it was the result of a ban
                    self.emit('PurgeMessageBan', data);
                }

            });

            socket.on('DeleteMessage', data => {
                self.emit('DeleteMessage', data);
            });

            socket.on('ClearMessages', data => {
                self.emit('ClearMessages', data);
            });
            socket.on('UserUpdate', data => {
                self.emit('UserUpdate', data);
            });

            //don't think this one is ever fired
            socket.on('UserTimeout', data => {
                self.emit('UserTimeout', data);
            });



            return socket.auth(channelId, userId, authkey)
                .then(() => {

                    console.log('logged into beam chat');
                    chatConnected = true;
                    //   console.log(colors.yellow('Beam Chat Login'));

                });


            // socket.auth(channelId, userId, authkey)
            // .then(() => {
            //     console.log('You are now authenticated!');
            //     // Send a chat message
            //     return socket.call('msg', ['Hello world!']);
            // })
            // .catch(error => {
            //     console.error('Oh no! An error occurred.');
            //     console.error(error);
            // });
        }

        //exports
        self.say = function(msg) {

            socket.call('msg', [`${msg}`]);
        }

        self.whisper = function(username, msg) {
            console.log('in whisper function' + msg);
            socket.call('whisper', [username, `${msg}`]);
        }

        self.poll = function(q, a, t) {
            socket.call('vote:start', [q, a, t]);
        }

        self.mod = function(q, a, t) {
            socket.call('vote:start', [q, a, t]);
        }

        self.clienthtml = function(msg) {
            try {

                if (socket.status == 1) {
                    // console.log('sending msg to Mixer' + JSON.stringify(msg));
                    socket.call('msg', [`${msg}`]);
                } else {

                }


            } catch (error) {
                console.log('error in beamchat.js self.clienthtml' + error)
            }

        }

        self.addDBRow = function(rowType, username, createdDate, updatedDate) {
            addToDB(rowType, username, createdDate, updatedDate);
        }

        self.getclient = function() {
            self.emit('beam client', client);
        }

        self.getfollowers = async function() {

            let allDone = false;
            let page = 0;
            var requestSize = 40;

            followers = [];
            followers = {
                followers: []
            };

            while (!allDone) {
                await client.request('GET', `channels/${schuChanID}/follow`, {
                    qs: {
                        page,
                        limit: requestSize,
                        /* order: 'token:desc',*/
                        fields: 'avatarUrl,followed,id,username,channel',
                    },
                }).then(res => {

                    if (res.body.length >= 1) {
                        addfollowerItem(res);
                    }

                    if (res.body.length <= 0) {
                        allDone = true;
                        self.emit('FollowerCount', followers.followers);

                    }
                    page = page + 1;
                });
            }
        }

        //sends chat users to browser
        self.getChatUsers = async function() {

            let allDone = false;
            let page = 0;
            var requestSize = 40;

            chatUsers = [];

            while (!allDone) {
                await client.request('GET', `/chats/${schuChanID}/users`, {
                    qs: {
                        page,
                        limit: 100,
                        /*order: 'userName:asc', */
                        fields: 'userId,userName,userRoles',
                    },
                }).then(res => {


                    if (res.body.length >= 1) {
                        addChatUserItem(res);
                    }


                    if (res.body.length <= 0) {
                        allDone = true;

                        chatUsers = removeDuplicates(chatUsers);
                        self.emit('ChatUserCount', chatUsers);

                    }
                    page = page + 1;
                });
            }
        }


        const removeDuplicates = (values) => {
            let concatArray = values.map(eachValue => {
                return Object.values(eachValue).join('')
            })
            let filterValues = values.filter((value, index) => {
                return concatArray.indexOf(concatArray[index]) === index

            })
            return filterValues
        }


        // Gets users channel is following /users/{user}/follows
        //sends streamer follows to browser
        self.getStreamerFollows = async function() {

            let allDone = false;
            let page = 0;
            var requestSize = 40;

            myArray = [];

            following = [];
            following = {
                following: []
            };

            while (!allDone) {
                await client.request('GET', `/users/${schuUserId}/follows`, {
                    qs: {
                        page,
                        limit: 100,
                        /* order: 'token:desc',*/
                        fields: 'id,token,userId',
                    },
                }).then(res => {

                    if (res.body.length >= 1) {
                        addFollowingItem(res);
                    }


                    if (res.body.length <= 0) {
                        allDone = true;
                        self.emit('FollowingCount', following.following);

                    }
                    page = page + 1;
                });
            }
        }


        function addfollowerItem(res) {

            res.body.forEach(function(element) {

                var friendlyDate = new Date(element.followed.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }).replace(/ /g, '-');


                followers.followers.push({
                    "id": element.id,
                    "username": element.username,
                    "followedDt": element.followed.createdAt,
                    "followedDtFriendly": friendlyDate
                });

            }, this);
        }

        function addChatUserItem(res) {
            res.body.forEach(function(element) {
                //console.log(element.username);
                var item = element.userName + ' - ' + element.userRoles[0] + ' - ' + element.userId
                chatUsers.push(item);
            }, this);
        }

        function addFollowingItem(res) {

            res.body.forEach(function(element) {

                //unfortunately we can't find out from your following list when you actually followed them :( 
                following.following.push({
                    "id": element.id,
                    "token": element.token,
                    "userId": element.userId,

                });

                // streamerFollows.push(following);
            }, this);
        }

        function addToDB(rowType, username, createdDate, updatedDate) {



            if (type == "follower") {
                console.log("follower " + username + " on: " + createdDate)
                addfollowerToDB(username, createdDate, updatedDate);
            }

            if (type == "following") {
                addfollowerToDB(username, createdDate, updatedDate);
            }
        }

        function addfollowingToDB(followingUsername, createdDate, updatedDate) {

            var username = "" + followingUsername + "";

            db.push("/following", {
                username: {
                    "id": "userId",
                    "createdAt": "2017-07-07 00:00:00",
                    "updatedAt": "2017-07-07 00:00:00",
                    "followers": 6,
                }
            }, false);

            var numDBFollowing = Object.keys(db.getData("/following")).length;

            console.log("Following: " + numDBFollowers);

        }

        function addfollowerToDB(followUsername, createdDate, updatedDate) {

            var username = "" + followUsername + "";

            db.push("/followers/", {
                username: {
                    "id": "userId",
                    "createdAt": "2017-07-07 00:00:00",
                    "updatedAt": "2017-07-07 00:00:00",
                    "updatedAt": 5,
                }
            }, false);

            var numDBFollowers = Object.keys(db.getData("/followers")).length;

            console.log("Number Of Followers: " + numDBFollowers);

            var data = db.getData("/followers");

            //Deleting data 
            // db.delete("/followers/username");

            //Save the data (useful if you disable the saveOnPush) 
            // db.save();

            //In case you have a exterior change to the databse file and want to reload it 
            //use this method 
            db.reload();
        }
    }
};

beamchatbot.prototype = new events.EventEmitter;

module.exports = beamchatbot;
//function connectToBeam(client, userInfo, authToken, createChatSocket, self) {
function connectToBeam(client, authToken, createChatSocket, self, useAuth, chatConnected) {

    // console.log("use auth value is: " + useAuth);
    // console.log("use magic token is: " + authToken);
    if (useAuth) {
        client.use(new Mixer.OAuthProvider(client, {
            tokens: {
                access: authToken,
                expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
            },
        }));

    }


    client.request('GET', `users/current`)
        .then(response => {

            console.log('Getting Current User data response 1 user id: ' + response.body.id + ' username:' + response.body.username);
            userInfo = response.body;
            //console.log(JSON.stringify(userInfo));

            console.log('response 1 ' + userInfo.id + ' getting user info ');
            //console.log(userInfo.channel.id);
            //channel id
            beamChannelID = userInfo.channel.id;
            numFollowers = userInfo.channel.numFollowers;


            //return client.chat.join(beamChannelID);

            return new Mixer.ChatService(client).join(schuChanID);
        })
        .then(response => {
            const body = response.body;
            //these are to be removed
            /*             console.log('User ' + userInfo.id + ' has joined channel ' + beamChannelID);
                        console.log('User ' + userInfo.id + ' special something ' + authToken); */
            // console.log(body)
            // return createChatSocket(userInfo.id, chanID, body.endpoints, body.authkey);
            return createChatSocket(userInfo.id, beamChannelID, body.endpoints, authToken, chatConnected);
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