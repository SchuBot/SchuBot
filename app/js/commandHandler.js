//requires
let util = require('util');
let events = require('events');
var request = require('request');
var JsonDB = require('node-json-db');

let beamChannelID;


//module
let commandHandler = function(channelToken) {

    //let userInfo;
    let self = this;


    //exports
    self.say = function(userName, commandJSONData, roles, commandTriggered, fullcommand) {

        //var userName = userNameStr;
        console.log(commandJSONData[0].text.split(' '));

        var commandData = commandJSONData[0];
        var commandToChat = "";
        var target = fullcommand.split(' ')[1];

        processArray(commandData, channelToken, commandTriggered, userName, target).then(function(response) {
            commandToChat = response.join(' ');
            console.log("Success!", response);
            //emit event and send message to mixer
            return self.emit('CommandData', commandToChat);
        }, function(error) {
            console.error("Failed!", error);
            return self.emit('CommandData', error);
        });


    };

};

commandHandler.prototype = new events.EventEmitter;

module.exports = commandHandler;

async function getSubstitutionVariable(userName, variableCommand, array, index, channelToken, target) {

    switch (variableCommand) {
        case "$user":
            text = userName;
            break;
        case "$caster":
            text = channelToken;
            break;
        case "$target":
            text = target;
            break;
        case "$randusr":
            text = getRandomUser();
            break;
        case "$randex":
            text = getRandomUserExceptSelf(userName);
            break;
        case "$uptime":
            text = getUptime(channelToken);
            break;

            /*           case "$readapi":
                      text = getapi(url);
                      break; */

        case "$date":
            text = getDateFromVariable();
            break;
        case "$time":
            text = getTimeFromVariable();
            break;
        default:
            text = variableCommand + ' Not found';
    }

    return text;
}

function getChannelObjectVariable(channelObject, variable) {


    switch (variable) {


        case "$joinedWeeksAgo":
            text = channelObject.joinedWeeksAgo;
            break;

        case "$joinedMonthsAgo":
            text = channelObject.joinedMonthsAgo;
            break;

        case "$joinedDaysAgo":
            text = channelObject.joinedDaysAgo;
            break;

        case "$joinedVer2":
            text = channelObject.joinedVer2;
            break;

        case "$joined":
            text = channelObject.joined;
            break;

        case "$vodsEnabled":
            text = channelObject.vodsEnabled;
            break;

        case "$game":
            text = channelObject.streaming;
            break;

        case "$streaming":
            text = channelObject.streaming;
            break;

        case "$profileLanguage":
            text = channelObject.language;
            break;
        case "$isSuspended":
            text = channelObject.isHosting;
            break;
        case "$isHosting":
            text = channelObject.isHosting;
            break;
        case "$isHostingWhom":
            text = channelObject.isHosting;
            break;
        case "$hasInteractive":
            text = channelObject.interactive;
            break;
        case "$title":
            text = channelObject.channel_title;
            break;
        case "$hasVod":
            text = channelObject.hasVod;
            break;
        case "$featured":
            text = channelObject.featured;
            break;
        case "$numFollowers":
            text = channelObject.token;
            break;

        case "$token":
            text = channelObject.token;
            break;

        case "$online":
            text = channelObject.online;
            break;

        case "$sparks":
            text = channelObject.sparks;
            break;
        case "$level":
            text = channelObject.level;
            break;
        case "$followers":
            text = channelObject.followers;
            break;
        case "$joined":
            text = channelObject.joined;
            break;
        case "$audience":
            text = channelObject.audience;
            break;
        case "$user":
            text = channelObject.token;
            break;
        case "$target":
            text = channelObject.token;
            break;
        case "$caster":
            text = channelObject.token;
            break;
        case "$game":
            text = channelObject.streaming;
            break;
        case "$ispartner":
            text = channelObject.partnered;
            break;
        default:
            text = variable + ' - Not found';
    }

    return text;
}

function getChannelVariable(userName, streamer, msg, variableCommand, target) {
    var text = "";
    switch (variableCommand) {
        case "user":
            text = userName;
            break;
        case "caster":
            text = streamer;
            break;
        case "target":

            if (target != undefined) {
                text = target.replace("@", "");
            } else {
                text = "";
            }

            break;
        default:
            text = variableCommand;
    }

    return text;

}

function getRandomUser() {
    return "random user";
}

function getRandomUserExceptSelf(userName) {
    return userName + "Not";
}

async function getUptime(channelID) {

    var channelIDTest = 582310;
    const fetch = require("node-fetch");
    const url = "https://mixer.com/api/v1/channels/" + `${channelID}` + "/broadcast";
    var d;

    const getUptime = async url => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(
                JSON.stringify(json)
            );
            // console.log('broadcast info is: (below)');

            if (json.startedAt == undefined) {
                return d = "Not currently streaming";
            } else {
                var startedBroadcast = new Date(json.startedAt);
                var today = new Date();

                //var result = Date.daysBetween(startedBroadcast, today);

                return d = Date.daysBetween(startedBroadcast, today);
            }


            // return d = new ChannelUptime(json);
        } catch (error) {
            console.log(error);
            return d = error;
        }
    };
    d = await getUptime(url);

    return d;
}

async function getChannel(channelToken) {

    const fetch = require("node-fetch");
    const url = "https://mixer.com/api/v1/channels/" + `${channelToken}`;
    var d

    const getChannel = async url => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            /*             console.log(
                            JSON.stringify(json)

                        ); */
            return d = new ChannelObject(json);
        } catch (error) {
            console.log(error);
            return d = error;
        }
    };
    d = await getChannel(url);

    return d;

}

async function callApi(apiURL) {

    const fetch = require("node-fetch");
    const url = apiURL;
    var d;

    const callApi = async url => {
        try {
            url = url.replace(",", "");
            const response = await fetch(url);
            const json = await response.text();
            //console.log(JSON.stringify(json));
            // console.log('broadcast info is: (below)');

            return d = json;

            // return d = new ChannelUptime(json);
        } catch (error) {
            console.log(error);
            return d = error;
        }
    };
    d = await callApi(url);

    return d;
}

class ChannelObject {

    constructor(json) {

        var y2k = new Date(json.createdAt) //Month is 0-11 in JavaScript!
        var today = new Date();

        this.token = json.token;
        this.online = json.online;
        this.audience = json.audience;
        this.sparks = json.user.sparks;
        this.level = json.user.level;
        this.channel_title = json.name;
        this.followers = json.numFollowers;
        this.partnered = json.partnered;
        this.featured = json.featured;
        this.hasVod = json.hasVod;
        this.numFollowers = json.numFollowers;
        this.interactive = json.interactive;
        this.isHosting = json.hosteeId;
        this.suspended = json.suspended;
        this.language = json.language;
        this.vodsEnabled = json.vodsEnabled;
        //is partnered ?

        var dayStr = getDayName(new Date(json.createdAt).getDate());
        var monthName = getDateName(new Date(json.createdAt).getMonth());
        var yearstr = new Date(json.createdAt).getFullYear();

        this.joined = dayStr + ' ' + monthName + ' ' + yearstr;
        if (json.type != null) {
            this.streaming = json.type.name;
        } else {
            this.streaming = "Not Streamed Yet!"
        }


        this.joinedVer2 = new Date(json.createdAt).toUTCString();
        this.joinedDaysAgo = Date.DateDiff('d', new Date(json.createdAt), today, 1);
        this.joinedMonthsAgo = Date.DateDiff('m', new Date(json.createdAt), today, 1);
        this.joinedWeeksAgo = Date.DateDiff('w', new Date(json.createdAt), today, 1);


        //
        //console.log('Months since now: ' + Date.DateDiff('m', y2k, today, 1)); //displays 143
        //console.log('Weeks since now: ' + Date.DateDiff('w', y2k, today, 1)); //displays 625

    }

    /* sayHi() {
         alert(this.name);
     } */





}






function getDateName(monthStr) {

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

function getHosts() {
    return "4 channels currently hosting this stream";
}

function getCaster() {
    return "streamer is Schuster";
}

function getDateFromVariable() {
    return Date.now.toString();
}

function getTimeFromVariable() {
    return Date.now.toString();
}

//userName is person who triggered command
async function processArray(commandData, channelName, commandTriggered, userName, target) {

    var channelInfo = null;

    //sets the api number
    var channelAPIVar = 0;
    //
    var APITexts = "";

    // var bracketContents = arrayofstrings.match(/\[(.*?)\]/);
    //extract all bracket data objects
    var bracketContents = commandData.text.match(/ *\[[^\]]*]/g);
    //alert(bracketContents);

    //this now removes all bracket data to do variable substitution later
    commandData = commandData.text.replace(/ *\[[^\]]*]/g, '');

    commandData = commandData.split(' ');

    let result = "";

    for (var i = 0, len = commandData.length; i < len; i++) {
        if (commandData[i].length > 0) {
            if (commandData[i].substr(0, 1) == "$") {

                if (commandData[i].startsWith("$channelInfo")) {

                    // this sets the api call number to return
                    channelAPIVar = channelAPIVar + 1;

                    //gets stuff inside brackets for that api call
                    var bracketContentsString = bracketContents[channelAPIVar - 1];
                    //get channel variable i.e. get $variable after $channelinfo and return the value

                    //get channel for variable i.e. call get channel for the returned variable

                    //  var text = "$channelInfo$target($target is a level $level, joined $mixerJoined and has $sparks sparks)"
                    //gets the channel variable to query
                    var channelVariable = commandData[i].split('(')[0].split('$')

                    var userChannelVariable = channelVariable[2];

                    if (userChannelVariable != undefined) {
                        // work on this schuster
                        //getChannelVariable(userName, streamer, msg, channelTokenVariable);
                        var channel = getChannelVariable(userName, channelName, commandTriggered, userChannelVariable, target);


                        if (channel != undefined || channel != "") {


                            let ChannelObject = await getChannel(channel.replace('@', ''));

                            var commandText = bracketContentsString.replace('[', '').replace(']', '').split(' ');


                            for (var ii = 0, len2 = commandText.length; ii < len2; ii++) {
                                if (commandText[ii].length > 0) {
                                    if (commandText[ii].substr(0, 1) == "$") {

                                        var stripWhiteSpacesAndCommas = commandText[ii].replace(' ', '').replace(',', '');

                                        //here we substitute all the variables


                                        /*                                     getChannelObjectVariable(ChannelObject, stripWhiteSpacesAndCommas).then(function(data) {
                                                                                //  console.log('all is completed', data);
                                                                                result = result + data;
                                                                            }); */
                                        //.then(res => textresult = res).catch(e => Notices.results(e));

                                        // result = result + textresult;
                                        result = result + ' ' + getChannelObjectVariable(ChannelObject, stripWhiteSpacesAndCommas);

                                    } else {
                                        result = result + ' ' + commandText[ii];
                                    }
                                }
                            };
                        } else {
                            result = result + ' target/variable undefined'
                        }

                        //set the command result
                        commandData[i] = result;
                        result = "";

                    } else {
                        return "Invalid syntax or missing variable";
                    }



                } else if (commandData[i].startsWith("$readapi")) {
                    //strip the $readapi and ()
                    var commandTextRoundBrackets = commandData[i].replace('$readapi', '').replace('(', '').replace(')', '');

                    //split & and $ to get just the variables [$&] (uses positive lookahead regex ?=)
                    commandTextRoundBrackets = commandTextRoundBrackets.replace(/(?=[$&])/gi, ",").split(',');

                    //need to work on this method
                    for (var iii = 0, len3 = commandTextRoundBrackets.length; iii < len3; iii++) {
                        if (commandTextRoundBrackets[iii].length > 0) {
                            if (commandTextRoundBrackets[iii].substr(0, 1) == "$") {
                                let resultApiVariable = await getSubstitutionVariable(userName, commandTextRoundBrackets[iii], commandData, i, channelName, target);
                                commandTextRoundBrackets[iii] = resultApiVariable;
                            }

                        }
                        console.log('Hey');
                    }
                    var apiURL = commandTextRoundBrackets.join();
                    let resultReadApi = await callApi(apiURL.replace(",", ""));
                    commandData[i] = resultReadApi;

                } else {
                    let result2 = await getSubstitutionVariable(userName, commandData[i], commandData, i, channelName, target);

                    if (result2 === undefined) {
                        commandData[i] = ' [Variable] - ' + commandData[i].toString() + ' errored or returned no value';
                    } else {
                        commandData[i] = result2;
                    }
                }

            }

        }
    };

    return commandData;

}




/*
Name: jsDate
Desc: VBScript native Date functions emulated for Javascript
Author: Rob Eberhardt, Slingshot Solutions - http://slingfive.com/
Note: see jsDate.txt for more info
*/

// constants
vbGeneralDate = 0;
vbLongDate = 1;
vbShortDate = 2;
vbLongTime = 3;
vbShortTime = 4; // NamedFormat
vbUseSystemDayOfWeek = 0;
vbSunday = 1;
vbMonday = 2;
vbTuesday = 3;
vbWednesday = 4;
vbThursday = 5;
vbFriday = 6;
vbSaturday = 7; // FirstDayOfWeek
vbUseSystem = 0;
vbFirstJan1 = 1;
vbFirstFourDays = 2;
vbFirstFullWeek = 3; // FirstWeekOfYear

// arrays (1-based)
Date.MonthNames = [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
Date.WeekdayNames = [null, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


Date.IsDate = function(p_Expression) {
    return !isNaN(new Date(p_Expression)); // <-- review further
}

Date.CDate = function(p_Date) {
    if (Date.IsDate(p_Date)) { return new Date(p_Date); }

    var strTry = p_Date.replace(/\-/g, '/').replace(/\./g, '/').replace(/ /g, '/'); // fix separators
    strTry = strTry.replace(/pm$/i, " pm").replace(/am$/i, " am"); // and meridian spacing
    if (Date.IsDate(strTry)) { return new Date(strTry); }

    var strTryYear = strTry + '/' + new Date().getFullYear(); // append year
    if (Date.IsDate(strTryYear)) { return new Date(strTryYear); }


    if (strTry.indexOf(":")) { // if appears to have time
        var strTryYear2 = strTry.replace(/ /, '/' + new Date().getFullYear() + ' '); // insert year
        if (Date.IsDate(strTryYear2)) { return new Date(strTryYear2); }

        var strTryDate = new Date().toDateString() + ' ' + p_Date; // pre-pend current date
        if (Date.IsDate(strTryDate)) { return new Date(strTryDate); }
    }

    return false; // double as looser IsDate
    //throw("Error #13 - Type mismatch");	// or is this better? 
}



Date.DateAdd = function(p_Interval, p_Number, p_Date) {
    if (!Date.CDate(p_Date)) { return "invalid date: '" + p_Date + "'"; }
    if (isNaN(p_Number)) { return "invalid number: '" + p_Number + "'"; }

    p_Number = new Number(p_Number);
    var dt = Date.CDate(p_Date);

    switch (p_Interval.toLowerCase()) {
        case "yyyy":
            {
                dt.setFullYear(dt.getFullYear() + p_Number);
                break;
            }
        case "q":
            {
                dt.setMonth(dt.getMonth() + (p_Number * 3));
                break;
            }
        case "m":
            {
                dt.setMonth(dt.getMonth() + p_Number);
                break;
            }
        case "y": // day of year
        case "d": // day
        case "w":
            { // weekday
                dt.setDate(dt.getDate() + p_Number);
                break;
            }
        case "ww":
            { // week of year
                dt.setDate(dt.getDate() + (p_Number * 7));
                break;
            }
        case "h":
            {
                dt.setHours(dt.getHours() + p_Number);
                break;
            }
        case "n":
            { // minute
                dt.setMinutes(dt.getMinutes() + p_Number);
                break;
            }
        case "s":
            {
                dt.setSeconds(dt.getSeconds() + p_Number);
                break;
            }
        case "ms":
            { // JS extension
                dt.setMilliseconds(dt.getMilliseconds() + p_Number);
                break;
            }
        default:
            {
                return "invalid interval: '" + p_Interval + "'";
            }
    }
    return dt;
}



Date.daysBetween = function(date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    //take out milliseconds
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);

    return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
}


Date.DateDiff = function(p_Interval, p_Date1, p_Date2, p_FirstDayOfWeek) {
    if (!Date.CDate(p_Date1)) { return "invalid date: '" + p_Date1 + "'"; }
    if (!Date.CDate(p_Date2)) { return "invalid date: '" + p_Date2 + "'"; }
    p_FirstDayOfWeek = (isNaN(p_FirstDayOfWeek) || p_FirstDayOfWeek == 0) ? vbSunday : parseInt(p_FirstDayOfWeek); // set default & cast

    var dt1 = Date.CDate(p_Date1);
    var dt2 = Date.CDate(p_Date2);

    // correct DST-affected intervals ("d" & bigger)
    if ("h,n,s,ms".indexOf(p_Interval.toLowerCase()) == -1) {
        if (p_Date1.toString().indexOf(":") == -1) { dt1.setUTCHours(0, 0, 0, 0) }; // no time, assume 12am
        if (p_Date2.toString().indexOf(":") == -1) { dt2.setUTCHours(0, 0, 0, 0) }; // no time, assume 12am
    }


    // get ms between UTC dates and make into "difference" date
    var iDiffMS = dt2.valueOf() - dt1.valueOf();
    var dtDiff = new Date(iDiffMS);

    // calc various diffs
    var nYears = dt2.getUTCFullYear() - dt1.getUTCFullYear();
    var nMonths = dt2.getUTCMonth() - dt1.getUTCMonth() + (nYears != 0 ? nYears * 12 : 0);
    var nQuarters = parseInt(nMonths / 3); //<<-- different than VBScript, which watches rollover not completion

    var nMilliseconds = iDiffMS;
    var nSeconds = parseInt(iDiffMS / 1000);
    var nMinutes = parseInt(nSeconds / 60);
    var nHours = parseInt(nMinutes / 60);
    var nDays = parseInt(nHours / 24); // <-- now fixed for DST switch days
    var nWeeks = parseInt(nDays / 7);


    if (p_Interval.toLowerCase() == 'ww') {
        // set dates to 1st & last FirstDayOfWeek
        var offset = Date.DatePart("w", dt1, p_FirstDayOfWeek) - 1;
        if (offset) { dt1.setDate(dt1.getDate() + 7 - offset); }
        var offset = Date.DatePart("w", dt2, p_FirstDayOfWeek) - 1;
        if (offset) { dt2.setDate(dt2.getDate() - offset); }
        // recurse to "w" with adjusted dates
        var nCalWeeks = Date.DateDiff("w", dt1, dt2) + 1;
    }
    // TODO: similar for 'w'?


    // return difference
    switch (p_Interval.toLowerCase()) {
        case "yyyy":
            return nYears;
        case "q":
            return nQuarters;
        case "m":
            return nMonths;
        case "y": // day of year
        case "d":
            return nDays;
        case "w":
            return nWeeks;
        case "ww":
            return nCalWeeks; // week of year	
        case "h":
            return nHours;
        case "n":
            return nMinutes;
        case "s":
            return nSeconds;
        case "ms":
            return nMilliseconds; // not in VBScript
        default:
            return "invalid interval: '" + p_Interval + "'";
    }
}




Date.DatePart = function(p_Interval, p_Date, p_FirstDayOfWeek) {
    if (!Date.CDate(p_Date)) { return "invalid date: '" + p_Date + "'"; }

    var dtPart = Date.CDate(p_Date);

    switch (p_Interval.toLowerCase()) {
        case "yyyy":
            return dtPart.getFullYear();
        case "q":
            return parseInt(dtPart.getMonth() / 3) + 1;
        case "m":
            return dtPart.getMonth() + 1;
        case "y":
            return Date.DateDiff("y", "1/1/" + dtPart.getFullYear(), dtPart) + 1; // day of year
        case "d":
            return dtPart.getDate();
        case "w":
            return Date.Weekday(dtPart.getDay() + 1, p_FirstDayOfWeek); // weekday
        case "ww":
            return Date.DateDiff("ww", "1/1/" + dtPart.getFullYear(), dtPart, p_FirstDayOfWeek) + 1; // week of year
        case "h":
            return dtPart.getHours();
        case "n":
            return dtPart.getMinutes();
        case "s":
            return dtPart.getSeconds();
        case "ms":
            return dtPart.getMilliseconds(); // <-- JS extension, NOT in VBScript
        default:
            return "invalid interval: '" + p_Interval + "'";
    }
}



Date.MonthName = function(p_Month, p_Abbreviate) {
    if (isNaN(p_Month)) { // v0.94- compat: extract real param from passed date
        if (!Date.CDate(p_Month)) { return "invalid month: '" + p_Month + "'"; }
        p_Month = DatePart("m", Date.CDate(p_Month));
    }

    var retVal = Date.MonthNames[p_Month];
    if (p_Abbreviate == true) { retVal = retVal.substring(0, 3) } // abbr to 3 chars
    return retVal;
}


Date.WeekdayName = function(p_Weekday, p_Abbreviate, p_FirstDayOfWeek) {
    if (isNaN(p_Weekday)) { // v0.94- compat: extract real param from passed date
        if (!Date.CDate(p_Weekday)) { return "invalid weekday: '" + p_Weekday + "'"; }
        p_Weekday = DatePart("w", Date.CDate(p_Weekday));
    }
    p_FirstDayOfWeek = (isNaN(p_FirstDayOfWeek) || p_FirstDayOfWeek == 0) ? vbSunday : parseInt(p_FirstDayOfWeek); // set default & cast

    var nWeekdayNameIdx = ((p_FirstDayOfWeek - 1 + parseInt(p_Weekday) - 1 + 7) % 7) + 1; // compensate nWeekdayNameIdx for p_FirstDayOfWeek
    var retVal = Date.WeekdayNames[nWeekdayNameIdx];
    if (p_Abbreviate == true) { retVal = retVal.substring(0, 3) } // abbr to 3 chars
    return retVal;
}


// adjusts weekday for week starting on p_FirstDayOfWeek
Date.Weekday = function(p_Weekday, p_FirstDayOfWeek) {
    p_FirstDayOfWeek = (isNaN(p_FirstDayOfWeek) || p_FirstDayOfWeek == 0) ? vbSunday : parseInt(p_FirstDayOfWeek); // set default & cast

    return ((parseInt(p_Weekday) - p_FirstDayOfWeek + 7) % 7) + 1;
}


Date.FormatDateTime = function(p_Date, p_NamedFormat) {
    if (p_Date.toUpperCase().substring(0, 3) == "NOW") { p_Date = new Date() };
    if (!Date.CDate(p_Date)) { return "invalid date: '" + p_Date + "'"; }
    if (isNaN(p_NamedFormat)) { p_NamedFormat = vbGeneralDate };

    var dt = Date.CDate(p_Date);

    switch (parseInt(p_NamedFormat)) {
        case vbGeneralDate:
            return dt.toString();
        case vbLongDate:
            return Format(p_Date, 'DDDD, MMMM D, YYYY');
        case vbShortDate:
            return Format(p_Date, 'MM/DD/YYYY');
        case vbLongTime:
            return dt.toLocaleTimeString();
        case vbShortTime:
            return Format(p_Date, 'HH:MM:SS');
        default:
            return "invalid NamedFormat: '" + p_NamedFormat + "'";
    }
}


Date.Format = function(p_Date, p_Format, p_FirstDayOfWeek, p_firstweekofyear) {
    if (!Date.CDate(p_Date)) { return "invalid date: '" + p_Date + "'"; }
    if (!p_Format || p_Format == '') { return dt.toString() };

    var dt = Date.CDate(p_Date);

    // Zero-padding formatter
    this.pad = function(p_str) {
        if (p_str.toString().length == 1) { p_str = '0' + p_str }
        return p_str;
    }

    var ampm = dt.getHours() >= 12 ? 'PM' : 'AM'
    var hr = dt.getHours();
    if (hr == 0) { hr = 12 };
    if (hr > 12) { hr -= 12 };
    var strShortTime = hr + ':' + this.pad(dt.getMinutes()) + ':' + this.pad(dt.getSeconds()) + ' ' + ampm;
    var strShortDate = (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + new String(dt.getFullYear()).substring(2, 4);
    var strLongDate = Date.MonthName(dt.getMonth() + 1) + ' ' + dt.getDate() + ', ' + dt.getFullYear(); //

    var retVal = p_Format;

    // switch tokens whose alpha replacements could be accidentally captured
    retVal = retVal.replace(new RegExp('C', 'gi'), 'CCCC');
    retVal = retVal.replace(new RegExp('mmmm', 'gi'), 'XXXX');
    retVal = retVal.replace(new RegExp('mmm', 'gi'), 'XXX');
    retVal = retVal.replace(new RegExp('dddddd', 'gi'), 'AAAAAA');
    retVal = retVal.replace(new RegExp('ddddd', 'gi'), 'AAAAA');
    retVal = retVal.replace(new RegExp('dddd', 'gi'), 'AAAA');
    retVal = retVal.replace(new RegExp('ddd', 'gi'), 'AAA');
    retVal = retVal.replace(new RegExp('timezone', 'gi'), 'ZZZZ');
    retVal = retVal.replace(new RegExp('time24', 'gi'), 'TTTT');
    retVal = retVal.replace(new RegExp('time', 'gi'), 'TTT');

    // now do simple token replacements
    retVal = retVal.replace(new RegExp('yyyy', 'gi'), dt.getFullYear());
    retVal = retVal.replace(new RegExp('yy', 'gi'), new String(dt.getFullYear()).substring(2, 4));
    retVal = retVal.replace(new RegExp('y', 'gi'), Date.DatePart("y", dt));
    retVal = retVal.replace(new RegExp('q', 'gi'), Date.DatePart("q", dt));
    retVal = retVal.replace(new RegExp('mm', 'gi'), (dt.getMonth() + 1));
    retVal = retVal.replace(new RegExp('m', 'gi'), (dt.getMonth() + 1));
    retVal = retVal.replace(new RegExp('dd', 'gi'), this.pad(dt.getDate()));
    retVal = retVal.replace(new RegExp('d', 'gi'), dt.getDate());
    retVal = retVal.replace(new RegExp('hh', 'gi'), this.pad(dt.getHours()));
    retVal = retVal.replace(new RegExp('h', 'gi'), dt.getHours());
    retVal = retVal.replace(new RegExp('nn', 'gi'), this.pad(dt.getMinutes()));
    retVal = retVal.replace(new RegExp('n', 'gi'), dt.getMinutes());
    retVal = retVal.replace(new RegExp('ss', 'gi'), this.pad(dt.getSeconds()));
    retVal = retVal.replace(new RegExp('s', 'gi'), dt.getSeconds());
    retVal = retVal.replace(new RegExp('t t t t t', 'gi'), strShortTime);
    retVal = retVal.replace(new RegExp('am/pm', 'g'), dt.getHours() >= 12 ? 'pm' : 'am');
    retVal = retVal.replace(new RegExp('AM/PM', 'g'), dt.getHours() >= 12 ? 'PM' : 'AM');
    retVal = retVal.replace(new RegExp('a/p', 'g'), dt.getHours() >= 12 ? 'p' : 'a');
    retVal = retVal.replace(new RegExp('A/P', 'g'), dt.getHours() >= 12 ? 'P' : 'A');
    retVal = retVal.replace(new RegExp('AMPM', 'g'), dt.getHours() >= 12 ? 'pm' : 'am');
    // (always proceed largest same-lettered token to smallest)

    // now finish the previously set-aside tokens 
    retVal = retVal.replace(new RegExp('XXXX', 'gi'), Date.MonthName(dt.getMonth() + 1, false)); //
    retVal = retVal.replace(new RegExp('XXX', 'gi'), Date.MonthName(dt.getMonth() + 1, true)); //
    retVal = retVal.replace(new RegExp('AAAAAA', 'gi'), strLongDate);
    retVal = retVal.replace(new RegExp('AAAAA', 'gi'), strShortDate);
    retVal = retVal.replace(new RegExp('AAAA', 'gi'), Date.WeekdayName(dt.getDay() + 1, false, p_FirstDayOfWeek)); // 
    retVal = retVal.replace(new RegExp('AAA', 'gi'), Date.WeekdayName(dt.getDay() + 1, true, p_FirstDayOfWeek)); // 
    retVal = retVal.replace(new RegExp('TTTT', 'gi'), dt.getHours() + ':' + this.pad(dt.getMinutes()));
    retVal = retVal.replace(new RegExp('TTT', 'gi'), hr + ':' + this.pad(dt.getMinutes()) + ' ' + ampm);
    retVal = retVal.replace(new RegExp('CCCC', 'gi'), strShortDate + ' ' + strShortTime);

    // finally timezone
    tz = dt.getTimezoneOffset();
    timezone = (tz < 0) ? ('GMT-' + tz / 60) : (tz == 0) ? ('GMT') : ('GMT+' + tz / 60);
    retVal = retVal.replace(new RegExp('ZZZZ', 'gi'), timezone);

    return retVal;
}



// ====================================

/* if desired, map new methods to direct functions
 */
IsDate = Date.IsDate;
CDate = Date.CDate;
DateAdd = Date.DateAdd;
DateDiff = Date.DateDiff;
DatePart = Date.DatePart;
MonthName = Date.MonthName;
WeekdayName = Date.WeekdayName;
Weekday = Date.Weekday;
FormatDateTime = Date.FormatDateTime;
Format = Date.Format;



/* and other capitalizations for easier porting
isDate = IsDate;
dateAdd = DateAdd;
dateDiff = DateDiff;
datePart = DatePart;
monthName = MonthName;
weekdayName = WeekdayName;
formatDateTime = FormatDateTime;
format = Format;

isdate = IsDate;
dateadd = DateAdd;
datediff = DateDiff;
datepart = DatePart;
monthname = MonthName;
weekdayname = WeekdayName;
formatdatetime = FormatDateTime;

ISDATE = IsDate;
DATEADD = DateAdd;
DATEDIFF = DateDiff;
DATEPART = DatePart;
MONTHNAME = MonthName;
WEEKDAYNAME = WeekdayName;
FORMATDATETIME = FormatDateTime;
FORMAT = Format;
*/