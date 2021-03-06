let events = require('events');

//this is obtained from the current users in chat
let currencyUsersList = [];
//database actions
class currencyManager {

    constructor(io, log) {

        let self = this;

        self.createTimers = function(currency, currencyUserDBList) {
            // var currencyTimers = [];
            currency.reload();
            currency.data.currency.forEach(element => {
                const isEnabled = element.enabled;
                //get all enabled currencies
                if (isEnabled === "Y") {
                    //create a timer for each currency to start generating points / hours
                    /* "ranksbasedon": "points",
                    "onlinepayintervalminutes": 5,
                    "offlinepayintervalminutes": 5, */
                    //const onlineinterval = element.onlinepayintervalminutes;
                    //const offlineinterval = element.offlinepayintervalminutes;

                    //currencyPerMinOnline
                    //currencyPerMinOffline
                    var onlineinterval = 1
                    var offlineinterval = 0

                    if (onlineinterval > 0) {
                        /*                         var currencyObject = {
    
                                                    id: element.id,
                                                    permission: onlineinterval,
                                                    type: "Online"
    
                                                }; */
                        console.log('currency triggered');
                        //online interval is the timer period (not used for now)
                        //element is the currency being processed
                        setTimeout(function() { OnlinePayOut(onlineinterval, element, currencyUsersList, currencyUserDBList); }, 1000 * onlineinterval);
                    }
                    if (offlineinterval > 0) {


                        //not used at the moment but will be used in future
                        // setTimeout(function() { OfflinePayOut(offlineinterval, element, currencyUsers); }, 1000 * offlineinterval);
                    }
                }
            });
        };


        //Currency is global on/off
        //this method is called everytime a user enters the chat
        self.addChatUserToCurrency = function(userId, userName) {
            currencyUsersList.push({ userId: userId, userName: userName });
        }

        //this method is called everytime a user exits the chat
        self.removeChatUserFromCurrency = function(userId, userName) {
            //find user and remove it
        }

        //, currencyUserTypes
        self.addOnlinePointsToUsers = function(currency, currencyUsers, currencyUserDBList) {



            //currency example
            /*                 "id": "2",
    
                            "currencyname": "Points",
                            "commandname": "!Points2",
                            "info": "ranks based on hours or points",
                            "ranksbasedon": "points",
                            "onlinepayintervalminutes": 5,
                            "offlinepayintervalminutes": 5,
                            "defaultpointsperminute": "2",
                            "defaultrank": "None",
                            "activeuserbonuspoints": "2",
                            "regularbonuspoints": "1",
                            "moderatorbonuspoints": "3",
                            "subscriberbonuspoints": "4",
                            "onfollowbonuspoints": "5",
                            "onsubscribebonuspoints": "6",
                            "donationbonuspoints": "7",
                            "multiplybydonationamount": "N",
                            "ranks": [
                                { "name": "Test2 Rank", "requirement": 50 },
                                { "name": "Test2 Rank 2", "requirement": 100 }
                            ] */
            //userTypes
            /*
            Viewer - This is a new viewer, not yet a regular
            Regular - This is a regular viewer that comes in streams often
            Moderator - Moderator of the channel
            Subscriber - Channel Subscriber (Not to be confused with Youtube Subscriber which is equivalent to Mixer Follow)
            */

            if (currency.enabled === "Y") {
                //get point variables, make this better by getting the user type
                //var viewerpoints = currency.viewerpointsbonus;
                //var minutesToAdd = currency.onlinepayintervalminutes;

                //var count = 0;
                currencyUsersList.forEach(currencyUser => {

                    var minutesToAdd = 1;

                    var CPM = parseFloat(0);
                    if (currency.currencyPerMin != "") {
                        CPM = parseFloat(currency.currencyPerMin);
                    }
                    var pointsToAdd = CPM;

                    self.addPointsToUserByCurrency(currency.id, currencyUsers, currencyUser.userId, pointsToAdd, minutesToAdd, currencyUserDBList, currencyUser.userName);

                });
            }

        };

        self.addOfflinePointsToUsers = function(currencyUsers) {
            //currencyUsers.reload();
            /*             myReaddir(fs, folder)
                            .then(function(data) {
                                console.log(data);
                                // need to ensure that the files don't duplicate
                                io.emit('sendSoundFilesToDropDown', data);
                                // return new fileOps.prototype.emit('sendFiles', data, type);
                            })
                            .catch((err) => console.log(err)); */
        };


        function OnlinePayOut(onlineinterval, currency, currencyUsers, currencyUserDBList) {
            //self.emit('addOnlineCurrencyPoints', currency);

            //is streamer Online (TODO)
            if (1 == 1) {
                self.addOnlinePointsToUsers(currency, currencyUsers, currencyUserDBList);
                //console.log("Online Payout Triggered");
                setTimeout(function() { OnlinePayOut(onlineinterval, currency, currencyUsers, currencyUserDBList); }, 60000 * onlineinterval);

            }

        };

        //not called at the moment but will be implemented
        function OfflinePayOut(offlineinterval, currency, currencyUsers) {
            //self.emit('addOfflineCurrencyPoints', currency);
            //is streamer not online
            if (1 == 2) {
                self.addOfflinePointsToUsers(currency, currencyUsers);
                //console.log("Offline Payout Triggered");
                setTimeout(function() { OfflinePayOut(offlineinterval, currency, currencyUsers); }, 60000 * offlineinterval);

            }

        };


        //GAME IDEAS (Need to build games and UI module)
        //SPIN idea use roll the dice with just one dice and run it 3 times to emulate scorp's Spin game DING DONG DING style
        // SPIN the wheel (this is in spin.js just needs work)
        // ROll the dice (similar to spin but totals the dice to determine WIN/LOSS)
        // HEIST (No sampel yet, need to built one)
        // BlackJack (No Sample yet, need to build one)
        // Poker ?? :yolo (Maybe version 2 of the bot)
        // Guess the Number Game ?? (Need to think on this one)





        //Need to put this game in its own class (spin.js is a sample and can possibly replace this)
        //games (TODO - replace userName with userID) spin is always against the first currency for now
        // Future development:
        // look into improving this to work with multiple currencies (maybe by adding a games list and which currency to use)
        // e.g. !spin uses currency 1 and !spin2 uses currency 2, use a UI module to provide this functionality 
        // and internally workout which currency to subtract / add points

        function SpinCurrency(currencyUsers, userNameIn, points, winpercentage, payoutfactor) {

            // Spin is against the first currency
            var user = currencyUsers.data.currencyUsers.filter(function(item) {
                return (item.username == userNameIn && item.currencyid == 1);
            });



            /*             "id": "50898908098-1",
                        "iddescription": "the above is a combination of the user id and currency id",
                        "userid": "1",
                        "currencyid": "1",
                        "currencyiddescription": "the currency id is to add points to the correct currency",
                        "username": "Schuster",
                        "hours": 859.8166666667763,
                        "points": 50367,
                        "currentrank": "Rank 1",
                        "nextrank": "Rank 2",
                        "type": "Regular" */


            //if length > 0 then user exists in list of users , else its a user with no point / new viewer
            if (user.length > 0) {

                var currentUserPoints = user.points;

            } else {
                //add viewer with little or no points
            }


        };


        //ROLL THE DICE GAME (Need to put this in its own class I think along with all the other games)
        //(can easily be any size and number of dice but keeping it simple)

        //To Implement(TODO)
        // winpaypercent is the minimum percent to roll to win
        // payout factor is the amount multiplier to payout in points to the person betting
        // pointsbet is the number of points bet by the person betting
        function rollTheDice(die, dice, winpaypercent, payoutfactor, pointsbet) {


            die = 6;
            dice = 3;

            var roll = 0;
            for (loop = 0; loop < dice; loop++) {
                roll = roll + Math.round(Math.random() * (die - 1)) + 1;
            }


            var maxnumberyoucanroll = die * dice;

            //so must get at least half to win i.e. in 3 die 6 sides 9 is minimum
            var minnumbertowin = maxnumberyoucanroll * 0.5;

            //added for greater flexibility
            if (roll >= minnumbertowin) {


            }


        };


        self.addPointsToUserByCurrency = function(currencyID, currencyUsers, UserId, pointsToAdd, minutesToAdd, currencyUserDBList, userName) {

            var count = 0;

            currencyUserDBList.reload();

            let userCurrencyIndex = currencyUserDBList.data.currencyUsers.findIndex(obj => obj.userid == UserId && obj.currencyid == currencyID)

            if (userCurrencyIndex >= 0) {

                var currentPoints = currencyUserDBList.data.currencyUsers[userCurrencyIndex].points;
                var currentMinutes = currencyUserDBList.data.currencyUsers[userCurrencyIndex].hours;
                var minutesToAddInHours = (minutesToAdd / 60);
                currencyUserDBList.data.currencyUsers[userCurrencyIndex].userName = userName;
                currencyUserDBList.data.currencyUsers[userCurrencyIndex].points = currentPoints + pointsToAdd;
                currencyUserDBList.data.currencyUsers[userCurrencyIndex].hours = (currentMinutes + (minutesToAdd / 60));
                currencyUserDBList.save();

            } else {
                var currencyuserObject = { currencyid: currencyID, userid: UserId, userName: userName, points: parseFloat(pointsToAdd), hours: (minutesToAdd / 60) }
                currencyUserDBList.push('/currencyUsers[]', currencyuserObject);
            }

        };


        self.CreateAmendCurrency = function(Newcurrency, data, action) {

            let currencyObject = Newcurrency.data.currency.filter(function(item) { return (item.id == data.id); });

            if (action == 'Add') {
                //add object

                Newcurrency.push('/currency[]', data);

            } else {

                let currencyIndexNum = Newcurrency.data.currency.findIndex(obj => obj.id == data.id)

                Newcurrency.data.currency[currencyIndexNum].currencyName = data.currencyName;
                Newcurrency.data.currency[currencyIndexNum].currencyPerMin = data.currencyPerMin;
                Newcurrency.data.currency[currencyIndexNum].currencyRatio = data.currencyRatio;
                Newcurrency.data.currency[currencyIndexNum].currencyBasedOn = data.currencyBasedOn;
                Newcurrency.data.currency[currencyIndexNum].currencyParentId = data.currencyParentId;
                Newcurrency.data.currency[currencyIndexNum].currencyParentName = data.currencyParentName;
                Newcurrency.data.currency[currencyIndexNum].enabled = data.enabled;

                Newcurrency.save();

            }



        };

        self.CreateAmendParentCurrency = function(parentCurrency, data) {

            let parentCurrencyObject = parentCurrency.data.parentCurrency.filter(function(item) { return (item.id == data.id); });
            if (parentCurrencyObject.length == 0) {
                parentCurrency.push('/parentCurrency[]', { currencyId: data.id, currencyName: data.currencyName });
            }


        };

        self.CreateAmendCurrencyRank = function(Newcurrency, data, action) {

            let currencyObject = Newcurrency.data.currency.filter(function(item) { return (item.id == data.id); });

            if (action.toLowerCase() == 'add') {
                //add object
                Newcurrency.push('/currency[]', data);


            } else {

                let currencyIndexNum = Newcurrency.data.currency.findIndex(obj => obj.id == data.id)

                if (!Newcurrency.data.currency[currencyIndexNum].hasOwnProperty('ranks')) {
                    //if no ranks tag in file it includes it when adding the rank 
                    Newcurrency.push(`/currency[${currencyIndexNum}]/ranks[]`, { name: data.currencyRankName, amount: data.currencyRankAmount }, true);
                } else {
                    let rankIndex = Newcurrency.data.currency[currencyIndexNum].ranks.findIndex(obj => obj.name == data.currencyRankName)

                    if (rankIndex >= 0) {
                        // adds rank for currency at rank index
                        Newcurrency.push(`/currency[${currencyIndexNum}]/ranks[${rankIndex}]`, { name: data.currencyRankName, amount: data.currencyRankAmount }, true);
                    } else {
                        // //adds new rank for currency index (if no rank found)
                        Newcurrency.push(`/currency[${currencyIndexNum}]/ranks[]`, { name: data.currencyRankName, amount: data.currencyRankAmount }, true);
                    }
                }

            }

        };

        self.ReselectRank = function(Newcurrency, currencyId, currencyName) {

            let currencyObject = Newcurrency.data.currency.filter(function(item) { return (item.id == currencyId); });

            if (currencyObject.length > 0) {

                return currencyObject[0].ranks;
            } else {
                return undefined;
            }

        };


        self.DeleteRank = function(Newcurrency, currencyId, RankName) {


            let currencyObject = Newcurrency.data.currency.filter(function(item) { return (item.id == currencyId); });


            if (currencyObject.length > 0) {

                let rankIndexNum = Newcurrency.data.currency[currencyIndexNum].ranks.findIndex(obj => obj.name == RankName)

                Newcurrency.delete(("/currency[" + i + "]/ranks[" + rankIndexNum + "]"));

                return currencyObject[0].ranks;
            } else {
                return undefined;
            }

        };


        self.deleteCurrencyFromList = function(Newcurrency, currencyID) {

            for (var i = 0, len = Newcurrency.data.currency.length; i < len; i++) {
                //array = alertsinqueue and index = i
                var iii = Newcurrency.data.currency[i].id;

                if (iii == currencyID) {
                    Newcurrency.delete(("/currency[" + i + "]"));
                    break;
                }
            }
        }

        self.DeleteParentCurrencyFromCurrency = function(Newcurrency, currencyId, parentCurrency) {



            //get currency being deleted


            let currencyObject = Newcurrency.data.currency.filter(function(item) { return (item.currencyParentId == currencyId && item.id != currencyId); });


            if (currencyObject.length > 0) {
                let count = 0;

                Newcurrency.data.currency.forEach(element => {
                    if (element.currencyParentId == currencyId) {
                        Newcurrency.data.currency[count].currencyParentId = "default";
                        Newcurrency.data.currency[count].currencyParentName = "";
                        Newcurrency.data.currency[count].currencyRatio = "";
                        //element.currencyUsers[count].points = element.currencyUsers[count].points + pointsToAdd;
                        Newcurrency.save();

                        //send update to UI
                        io.emit('addSaveSingleCurrency2', Newcurrency.data.currency[count]);
                    }
                    count = count + 1;
                });


            }

            /*             let parentCurrencyObject = parentCurrency.data.parentCurrency.filter(function(item) { return (item.currencyId == currencyId); });


                        if (parentCurrencyObject.length > 0) {

                            let ii = parentCurrency.data.parentCurrency.findIndex(obj => obj.currencyId == currencyId)

                            parentCurrency.delete(("/parentCurrency[" + ii + "]"));

                        } */

        };

        self.DeleteParentCurrency = function(currencyId, parentCurrency) {

            let parentCurrencyObject = parentCurrency.data.parentCurrency.filter(function(item) { return (item.currencyId == currencyId); });


            if (parentCurrencyObject.length > 0) {

                let ii = parentCurrency.data.parentCurrency.findIndex(obj => obj.currencyId == currencyId)

                parentCurrency.delete(("/parentCurrency[" + ii + "]"));

            }

            return parentCurrency;

        }



        self.GetParentCurrencies = function(parentCurrency) {


            let data = parentCurrency.data.parentCurrency;


            if (data.length > 0) {

                return parentCurrency.data.parentCurrency;
            } else {
                return undefined;
            }

        };

        self.addChatUserForCurrency = function(userId, userName) {

            currencyUsersList.push({ userId: userId, userName: userName });

        }

        self.removeChatUserForCurrency = function(userId) {

            currencyUsersList = currencyUsersList.filter(function(element) {
                return element.userId !== userId;
            });


            //currencyUsersList.push({ userId: userId, userName: userName });

        }


    }
}

currencyManager.prototype = new events.EventEmitter;
module.exports = currencyManager;