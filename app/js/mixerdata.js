//requires

var JsonDB = require('node-json-db');
const Mixer = require('@mixer/client-node');
let EventEmitter = require('events').EventEmitter;

var followers = [];
var followers = {
    followers: []
};

var following = [];
var following = {
    following: []
};

var chatUsers = [];


//module
class mixerdata extends EventEmitter {

    constructor(authToken, log, io) {
        super();
        if (authToken) {
            //+ authToken
            log.info('Streamer Token obtained for mixer data.');
            const colors = require('colors');
            const mixerClient = new Mixer.Client(new Mixer.DefaultRequestRunner());
            //let userInfo;
            let self = this;
            // With OAuth we don't need to login, the OAuth Provider will attach
            // the required information to all of our requests after this call.
            mixerClient.use(new Mixer.OAuthProvider(mixerClient, {
                tokens: {
                    access: authToken,
                    expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
                },
            }));
            //exports
            self.addDBRow = function(rowType, username, createdDate, updatedDate) {
                addToDB(rowType, username, createdDate, updatedDate);
            };
            self.getfollowers = async function(channelID) {
                let allDone = false;
                let page = 0;
                var requestSize = 40;
                followers = [];
                followers = {
                    followers: []
                };
                while (!allDone) {
                    await mixerClient.request('GET', `channels/${channelID}/follow`, {
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
                            log.info('sending follower count to UI');
                            io.emit('followerCount', followers.followers);

                        }
                        page = page + 1;
                    });
                }
            };
            //sends chat users to browser
            self.getChatUsers = async function(channelID) {
                let allDone = false;
                let page = 0;
                chatUsers = [];
                // subage https://mixer.com/api/v1/users/862913/subscriptions?where=resourceId:eq:850263
                while (!allDone) {
                    await mixerClient.request('GET', `/chats/${channelID}/users`, {
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
                            //chatUsers = removeDuplicates(chatUsers);
                            log.info('sending chat user count to UI');
                            io.emit('ChatUserCount', chatUsers);

                        }
                        page = page + 1;
                    });
                }
            };

            // Gets users channel is following /users/{user}/follows
            //sends streamer follows to browser
            self.getStreamerFollows = async function(userID) {
                let allDone2 = false;
                let page = 0;

                following = [];
                following = {
                    following: []
                };
                while (!allDone2) {
                    await mixerClient.request('GET', `/users/${userID}/follows`, {
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
                            allDone2 = true;
                            io.emit('followingCount', following.following);
                            log.info('sent following count to UI');
                        }
                        page = page + 1;
                    });
                }
            };
            self.doesFollowerExist = function(userName) {
                var doesUsernameExist = checkIfFollowerExists(userName);
                return doesUsernameExist;
            };

            const removeDuplicates = (values) => {
                let concatArray = values.map(eachValue => {
                    return Object.values(eachValue).join('');
                });
                let filterValues = values.filter((value, index) => {
                    return concatArray.indexOf(concatArray[index]) === index;
                });
                return filterValues;
            };

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

                    if (element.userRoles[0] != 'Banned') {
                        //console.log(element.username);
                        var item = element.username + ' - ' + element.userRoles[0] + ' - ' + element.userId;
                        chatUsers.push(item);
                    }

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
                var db = new JsonDB("myDataBase", true, true);
                if (type == "follower") {
                    log.info("follower " + username + " on: " + createdDate);
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
                log.info("Following: " + numDBFollowers);
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
                log.info("Number Of Followers: " + numDBFollowers);
                var data = db.getData("/followers");
                //Deleting data 
                // db.delete("/followers/username");
                //Save the data (useful if you disable the saveOnPush) 
                // db.save();
                //In case you have a exterior change to the databse file and want to reload it 
                //use this method 
                //Check this 22/05/2020
                db.reload();
            }

            function checkIfFollowerExists(userName) {
                var followerExists = followers.followers.filter(function(item) { return (item.username == userName); });
                //if exists it returns the command if not the length of var = 0
                return followerExists;
            }
        }
    }
}

module.exports = mixerdata;