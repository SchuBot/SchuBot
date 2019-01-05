let events = require('events');


class currencyManager {

    constructor() {

        let self = this;

        self.createTimers = function(currency, currencyUsers) {
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
                    const onlineinterval = element.onlinepayintervalminutes;
                    const offlineinterval = element.offlinepayintervalminutes;
                    if (onlineinterval > 0) {
                        /*                         var currencyObject = {
    
                                                    id: element.id,
                                                    permission: onlineinterval,
                                                    type: "Online"
    
                                                }; */
                        setTimeout(function() { OnlinePayOut(onlineinterval, element, currencyUsers); }, 1000 * onlineinterval);
                    }
                    if (offlineinterval > 0) {

                        //not used at the moment but will be used in future
                        // setTimeout(function() { OfflinePayOut(offlineinterval, element, currencyUsers); }, 1000 * offlineinterval);
                    }
                }
            });
        };



        //, currencyUserTypes
        self.addOnlinePointsToUsers = function(currency, currencyUsers) {



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
            currencyUsers.reload();
            if (currency.enabled === "Y") {
                //get point variables, make this better by getting the user type
                var viewerpoints = currency.viewerpointsbonus;
                var minutesToAdd = currency.onlinepayintervalminutes;

                var count = 0;
                currencyUsers.data.currencyUsers.forEach(element => {



                    // console.log("updating points and hours (minutes)");
                    var currentPoints = element.points;
                    var currentHours = element.hours;



                    var minutesToAdd = currency.onlinepayintervalminutes;
                    var newhours = currentHours + (minutesToAdd / 60);


                    var pointsToAdd = viewerpoints;
                    var newPoints = currentPoints + pointsToAdd;



                    // console.log(element.username + ' points is: ' + newPoints.toString());
                    // console.log(element.username + ' hours is: ' + newhours.toString());

                    /*             


            "id": "50898908098-1",
            "iddescription": "the above is a combination of the user id and currency id",
            "userid": "1",
            "currencyid": "1",
            "currencyiddescription": "the currency id is to add points to the correct currency",
            "username": "Schuster",
            "hours": 859.8166666667763,
            "points": 50367,
            "currentrank": "Rank 1",
            "nextrank": "Rank 2",
            "type": "Regular"


                                        } */

                    // cmd.cenabled
                    currencyUsers.data.currencyUsers[count].hours = newhours;
                    currencyUsers.data.currencyUsers[count].points = newPoints;
                    currencyUsers.save();
                    // db.delete(("/commands[" + i + "]"));    


                    count = count + 1;

                    self.addPointsToUserByCurrency("1", currencyUsers, "1", 1000);

                });
            }
            /*             myReaddir(fs, folder)
                            .then(function(data) {
                                console.log(data);
                                // need to ensure that the files don't duplicate
                                io.emit('sendSoundFilesToDropDown', data);
                                // return new fileOps.prototype.emit('sendFiles', data, type);
                            })
                            .catch((err) => console.log(err)); */
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


        function OnlinePayOut(onlineinterval, currency, currencyUsers) {
            //self.emit('addOnlineCurrencyPoints', currency);

            self.addOnlinePointsToUsers(currency, currencyUsers);
            //console.log("Online Payout Triggered");
            setTimeout(function() { OnlinePayOut(onlineinterval, currency, currencyUsers); }, 60000 * onlineinterval);

        };

        //not called at the moment but will be implemented
        function OfflinePayOut(offlineinterval, currency, currencyUsers) {
            //self.emit('addOfflineCurrencyPoints', currency);
            self.addOfflinePointsToUsers(currency, currencyUsers);
            console.log("Offline Payout Triggered");
            setTimeout(function() { OfflinePayOut(offlineinterval, currency, currencyUsers); }, 60000 * offlineinterval);

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


        self.addPointsToUserByCurrency = function(currencyID, currencyUsers, UserId, pointsToAdd) {

            var count = 0;



            currencyUsers.reload();

            var userCurrency = currencyUsers.data.currencyUsers.filter(function(item) {
                return (item.userid == UserId && item.currencyid === currencyID);
            });

            if (userCurrency.length > 0) {
                currencyUsers.data.currencyUsers.forEach(element => {
                    if (element.currencyid == currencyID && element.userid == UserId) {
                        currencyUsers.data.currencyUsers[count].points = currencyUsers.data.currencyUsers[count].points + pointsToAdd;
                        //element.currencyUsers[count].points = element.currencyUsers[count].points + pointsToAdd;
                        currencyUsers.save();
                    }
                    count = count + 1;
                });

            }


        };


    }
}

currencyManager.prototype = new events.EventEmitter;
module.exports = currencyManager;