//requires
let util = require('util');
let EventEmitter = require('events').EventEmitter;
let botConfig = require('./config.js');
var request = require('request');
var JsonDB = require('node-json-db');
const Mixer = require('@mixer/client-node');
const ws = require('ws');

const log = require('electron-log');

log.transports.file.level = 'info';
log.transports.file.format = '{h}:{i}:{s}:{ms} {text}'
log.transports.file.maxSize = 5 * 1024 * 1024

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
//var channelId = 582310;
var userId = 949494; //shoryuken userid

var foxyChanID = 540276;
var schuChanID = 582310;
var schuUserId = 862913;

let userInfo;
let authTokenReconnect;


//module
//authTokenBot, chatConnectedBot, streamerChannel, authDB
class MixerStreamerChat extends EventEmitter {






    constructor(authToken, chatConnected, authDB) {

        super();



        if (authToken) {
            //+ authToken
            log.info('Streamer Token obtained to connect to chat.');
            const colors = require('colors');
            const client = new Mixer.Client(new Mixer.DefaultRequestRunner());
            //let userInfo;
            let self = this;
            let socket;
            // With OAuth we don't need to login, the OAuth Provider will attach
            // the required information to all of our requests after this call.
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
                //schuChanID = channelId;
                if (userId == null) {}
                // const socket = new Mixer.Socket(ws, endpoints).boot();
                socket = new Mixer.Socket(ws, endpoints).boot();
                log.info('accessing beam chat socket js');
                socket.on('UserJoin', data => {
                    self.emit('UserJoin', data);
                });
                socket.on('UserLeave', data => {
                    self.emit('UserLeave', data);
                });
                socket.on('ChatMessage', data => {
                    // messagessent = messagessent + 1;
                    //log.info('Message Sent from Beam ' + messagessent + ' times');
                    try {
                        self.emit('ChatMessage', data);
                    } catch (error) {
                        log.info('error sending to beam' + error);
                    }
                });
                socket.on('error', error => {
                    //log.info('socket error, Socket info is: ' + JSON.stringify(socket));
                    //need to work on connection retry but connect immediately everytime it errors out
                    if (!chatConnected) {
                        log.info(' Reconnecting to chat...');
                        connectToBeam(client, authTokenReconnect, createChatSocket, self, true, chatConnected);
                    }
                    //userInfo = connectToBeam(client, authTokenReconnect, createChatSocket, self, true);
                    // self.emit('error', error);
                });
                socket.on('PollStart', data => {
                    // self.emit('PollStart', data);
                });
                socket.on('PollEnd', data => {
                    //  self.emit('PollEnd', data);
                });
                // Purge Message
                // Provides a moderator object if messages purged due to a ban.
                socket.on('PurgeMessage', data => {
                    /*                     //if purge has moderator, it was a timeout/purge
                                        if (data.moderator !== undefined) {
                                            //this was purge or timeout
                                            //  self.emit('PurgeOrTimeoutMessage', data);
                                        } else {
                                            //otherwise it was the result of a ban
                                            //  self.emit('UserBanned', data);
                                        } */
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
                        log.info('StreamerId: ' + userInfo.id + ' has joined channel ' + channelId);
                        //log.info('logged into beam chat');
                        chatConnected = true;
                        //   log.info(colors.yellow('Beam Chat Login'));
                        self.emit('streamerLoggedIn', authDB.data.streamer.username);
                        //self.emit('streamerAuthenticated');
                    });
            }
            //exports
            self.say = function(msg) {
                if (socket != undefined) {
                    socket.call('msg', [`${msg}`]).catch(error => {
                        log.info('Owner Say caught', error.message);
                    });
                } else {
                    //reauth required
                }
            };
            self.whisper = function(username, msg) {
                log.info('in whisper function' + msg);
                socket.call('whisper', [username, `${msg}`]).catch(error => {
                    log.info('Owner whisper caught', error.message);
                });
            };
            self.poll = function(q, a, t) {
                socket.call('vote:start', [q, a, t]).catch(error => {
                    log.info('Owner poll caught', error.message);
                });
            };
            self.mod = function(userid) {
                client.request('PATCH', `/channels/${channelId}/users/${userid}`, {
                    body: {
                        "add": ["Mod"]
                    },
                }).then(res => {
                    //do something with the response
                    return res;
                }).catch(error => {
                    log.info('Error Modding someone :- ' + error);
                });
            };
            self.timeout = function(data) {
                log.info('timing out ' + data.username + ' for ' + data.duration);
                socket.call('timeout', [data.username, data.duration])
                    .catch(error => {
                        log.info('Error : - Timeout caught', error.message);
                    });
            };
            self.ban = function(userid, channelId) {
                client.request('PATCH', `/channels/${channelId}/users/${userid}`, {
                    body: {
                        "add": ["Banned"]
                    },
                }).then(res => {
                    //do something with the response
                    return res;
                }).catch(error => {
                    log.info('Ban Error:- ' + error);
                });
            };
            self.unmod = function(userid, channelId) {
                client.request('PATCH', `/channels/${channelId}/users/${userid}`, {
                    body: {
                        "remove": ["Mod"]
                    },
                }).then(res => {
                    //do something with the response
                    return res;
                }).catch(error => {
                    log.info('unmod error:-' + error);
                });
            };
            self.clienthtml = function(msg) {
                try {
                    if (socket.status == 1) {
                        // log.info('sending msg to Mixer' + JSON.stringify(msg));
                        socket.call('msg', [`${msg}`]);
                    } else {}
                } catch (error) {
                    log.info('error in beamchat.js self.clienthtml' + error);
                }
            };


            self.addDBRow = function(rowType, username, createdDate, updatedDate) {
                addToDB(rowType, username, createdDate, updatedDate);
            };
            self.getclient = function() {
                self.emit('beam client', client);
            };


            // self.getfollowers = async function(channelID) {
            //     let allDone = false;
            //     let page = 0;
            //     var requestSize = 40;
            //     followers = [];
            //     followers = {
            //         followers: []
            //     };
            //     while (!allDone) {
            //         await client.request('GET', `channels/${channelID}/follow`, {
            //             qs: {
            //                 page,
            //                 limit: requestSize,
            //                 /* order: 'token:desc',*/
            //                 fields: 'avatarUrl,followed,id,username,channel',
            //             },
            //         }).then(res => {
            //             if (res.body.length >= 1) {
            //                 addfollowerItem(res);
            //             }
            //             if (res.body.length <= 0) {
            //                 allDone = true;
            //                 self.emit('followerCount', followers.followers);
            //             }
            //             page = page + 1;
            //         });
            //     }
            // };
            // //sends chat users to browser
            // self.getChatUsers = async function(channelID) {
            //     let allDone = false;
            //     let page = 0;
            //     var requestSize = 40;
            //     chatUsers = [];
            //     // subage https://mixer.com/api/v1/users/862913/subscriptions?where=resourceId:eq:850263
            //     while (!allDone) {
            //         await client.request('GET', `/chats/${channelID}/users`, {
            //             qs: {
            //                 page,
            //                 limit: 100,
            //                 /*order: 'userName:asc', */
            //                 fields: 'userId,userName,userRoles',
            //             },
            //         }).then(res => {
            //             if (res.body.length >= 1) {
            //                 addChatUserItem(res);
            //             }
            //             if (res.body.length <= 0) {
            //                 allDone = true;
            //                 chatUsers = removeDuplicates(chatUsers);
            //                 self.emit('ChatUserCount', chatUsers);
            //             }
            //             page = page + 1;
            //         });
            //     }
            // };
            // const removeDuplicates = (values) => {
            //     let concatArray = values.map(eachValue => {
            //         return Object.values(eachValue).join('');
            //     });
            //     let filterValues = values.filter((value, index) => {
            //         return concatArray.indexOf(concatArray[index]) === index;
            //     });
            //     return filterValues;
            // };
            // // Gets users channel is following /users/{user}/follows
            // //sends streamer follows to browser
            // self.getStreamerFollows = async function(userID) {
            //     let allDone = false;
            //     let page = 0;
            //     var requestSize = 40;
            //     myArray = [];
            //     following = [];
            //     following = {
            //         following: []
            //     };
            //     while (!allDone) {
            //         await client.request('GET', `/users/${userID}/follows`, {
            //             qs: {
            //                 page,
            //                 limit: 100,
            //                 /* order: 'token:desc',*/
            //                 fields: 'id,token,userId',
            //             },
            //         }).then(res => {
            //             if (res.body.length >= 1) {
            //                 addFollowingItem(res);
            //             }
            //             if (res.body.length <= 0) {
            //                 allDone = true;
            //                 self.emit('followingCount', following.following);
            //             }
            //             page = page + 1;
            //         });
            //     }
            // };
            // self.doesFollowerExist = function(userName) {
            //     var doesUsernameExist = checkIfFollowerExists(userName);
            //     return doesUsernameExist;
            // };

            // function addfollowerItem(res) {
            //     res.body.forEach(function(element) {
            //         var friendlyDate = new Date(element.followed.createdAt).toLocaleDateString('en-GB', {
            //             day: 'numeric',
            //             month: 'short',
            //             year: 'numeric'
            //         }).replace(/ /g, '-');
            //         followers.followers.push({
            //             "id": element.id,
            //             "username": element.username,
            //             "followedDt": element.followed.createdAt,
            //             "followedDtFriendly": friendlyDate
            //         });
            //     }, this);
            // }

            // function addChatUserItem(res) {
            //     res.body.forEach(function(element) {
            //         //log.info(element.username);
            //         var item = element.userName + ' - ' + element.userRoles[0] + ' - ' + element.userId;
            //         chatUsers.push(item);
            //     }, this);
            // }

            // function addFollowingItem(res) {
            //     res.body.forEach(function(element) {
            //         //unfortunately we can't find out from your following list when you actually followed them :( 
            //         following.following.push({
            //             "id": element.id,
            //             "token": element.token,
            //             "userId": element.userId,
            //         });
            //         // streamerFollows.push(following);
            //     }, this);
            // }

            // function addToDB(rowType, username, createdDate, updatedDate) {
            //     var db = new JsonDB("myDataBase", true, true);
            //     if (type == "follower") {
            //         log.info("follower " + username + " on: " + createdDate);
            //         addfollowerToDB(username, createdDate, updatedDate);
            //     }
            //     if (type == "following") {
            //         addfollowerToDB(username, createdDate, updatedDate);
            //     }
            // }

            // function addfollowingToDB(followingUsername, createdDate, updatedDate) {
            //     var username = "" + followingUsername + "";
            //     db.push("/following", {
            //         username: {
            //             "id": "userId",
            //             "createdAt": "2017-07-07 00:00:00",
            //             "updatedAt": "2017-07-07 00:00:00",
            //             "followers": 6,
            //         }
            //     }, false);
            //     var numDBFollowing = Object.keys(db.getData("/following")).length;
            //     log.info("Following: " + numDBFollowers);
            // }

            // function addfollowerToDB(followUsername, createdDate, updatedDate) {
            //     var username = "" + followUsername + "";
            //     db.push("/followers/", {
            //         username: {
            //             "id": "userId",
            //             "createdAt": "2017-07-07 00:00:00",
            //             "updatedAt": "2017-07-07 00:00:00",
            //             "updatedAt": 5,
            //         }
            //     }, false);
            //     var numDBFollowers = Object.keys(db.getData("/followers")).length;
            //     log.info("Number Of Followers: " + numDBFollowers);
            //     var data = db.getData("/followers");
            //     //Deleting data 
            //     // db.delete("/followers/username");
            //     //Save the data (useful if you disable the saveOnPush) 
            //     // db.save();
            //     //In case you have a exterior change to the databse file and want to reload it 
            //     //use this method 
            //     db.reload();
            // }

            // function checkIfFollowerExists(userName) {
            //     var followerExists = followers.followers.filter(function(item) { return (item.username == userName); });
            //     //if exists it returns the command if not the length of var = 0
            //     return followerExists;
            // }



















        }


        //function connectToBeam(client, userInfo, authToken, createChatSocket, self) {



    }


}


module.exports = MixerStreamerChat;

function connectToBeam(client, authToken, createChatSocket, self, useAuth, chatConnected) {

    // log.info("use auth value is: " + useAuth);
    // log.info("use magic token is: " + authToken);
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

            log.info('Getting Current User data response 1 user id: ' + response.body.id + ' username:' + response.body.username);
            userInfo = response.body;
            //log.info(JSON.stringify(userInfo));

            //  log.info('response 1 ' + userInfo.id + ' getting user info ');
            //log.info(userInfo.channel.id);
            //channel id
            beamChannelID = userInfo.channel.id;
            numFollowers = userInfo.channel.numFollowers;


            return new Mixer.ChatService(client).join(beamChannelID);

        })
        .then(response => {
            const body = response.body;
            //these are to be removed
            /*             log.info('User ' + userInfo.id + ' has joined channel ' + beamChannelID);
                        log.info('User ' + userInfo.id + ' special something ' + authToken); */
            // log.info(body)
            // return createChatSocket(userInfo.id, chanID, body.endpoints, body.authkey);

            return createChatSocket(userInfo.id, beamChannelID, body.endpoints, body.authkey, chatConnected);
        })
        .catch(error => {
            log.info('error in chat connection request: ' + error);
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
                    //  log.info('requestsToCompletion: ' + requestsToCompletion);
                    if (page == 0) {

                        if (requestsToCompletion > 0) {
                            numToGetAllFollowers = Math.ceil(requestsToCompletion / requestSize);
                        } else {
                            numToGetAllFollowers = 0;
                        }
                    }

                    if (numToGetAllFollowers == 0) {
                        //  log.info('numFollowers: ' + res.headers["x-total-count"]);
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