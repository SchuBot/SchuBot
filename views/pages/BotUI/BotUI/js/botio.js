//these are the users in chat
var chatUsrs = [];

//these are people that follow you
var followerUsrs = [];
var followerUsrsData = [];

//these are people you follow
var followingUsrsData = [];
var selectedFollower = '';
var devicewidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

//move this argument value to config


/* var iosocket = require('socket.io-client')('http://localhost:8081', {
     'reconnection': true,
     'reconnectionDelay': 1000,
     'reconnectionDelayMax': 5000,
     'reconnectionAttempts': 5
 });*/

const iosocket = null;

if (window.performance) {
    // console.info("window.performance works fine on this browser");
}

if (performance.navigation.type == 1) {
    console.info("Page Reloaded");
    pingBeam();
} else {

}

$(function() {




    ////////////////// TABLE ONCLICK LISTENERS 
    $("#tableF tr").click(function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        var value = $(this).find('tbody td:first').html();

        var name = $(this).attr('id');

        $("#flActionBtn").html(name);

    });

    $("#tableF tr").live("click", function() {
        $(this).addClass('selected').siblings().removeClass('selected');

        var $this = $(this);

        var doThis = $this.closest('tr').attr('id');

        if (doThis != undefined) {
            var id = $this.closest('tr').attr('id').substr(3, $this.closest('tr').attr('id').length - 3);
            var name = $(this).children('td').eq(1).text();

            var result = isFollowingMyFollower(id);

            $("#flActionBtn").html(name + " - " + result);
        }


    });

    $("#tableCF tr").click(function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        var value = $(this).find('tbody td:first').html();

        var name = $(this).attr('id');

        $("#flngActionBtn").html(name);

    });

    $("#tableCF tr").live("click", function() {
        $(this).addClass('selected').siblings().removeClass('selected');

        var $this = $(this);

        var doThis = $this.closest('tr').attr('id');

        if (doThis != undefined) {
            var id = $this.closest('tr').attr('id').substr(3, $this.closest('tr').attr('id').length - 3);
            var name = $(this).children('td').eq(1).text();

            var result = checkIfFollowing(id);

            $("#flngActionBtn").html(name + " - " + result);
        }

    });


    $("#tableChatUsers tr").click(function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        var value = $(this).find('tbody td:first').html();

    });

    $("#tableChatUsers tr").live("click", function() {
        $(this).addClass('selected').siblings().removeClass('selected');

        var $this = $(this);

        var doThis = $(this).children('td').eq(0).text();


        var array = doThis.split('-');


        if (doThis != "") {
            var usernameName = array[0].toString() + '-' + array[2].toString();
            $("#ChatActionBtn").html(usernameName);
        }





        /*             var array = doThis.split('-');

                    alert('Chat User ID is:' + array[2].toString());

                                    var personData = {
                            id: array[2].toString(),
                            username: Audio
                        }; */

    });

    $("#tableRecentFollowers tr").click(function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        var value = $(this).find('tbody td:first').html();

    });

    $("#tableRecentFollowers tr").live("click", function() {
        $(this).addClass('selected').siblings().removeClass('selected');

    });

    $("#tableFAL tr").click(function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        var value = $(this).find('tbody td:first').html();

    });

    $("#tableFAL tr").live("click", function() {
        $(this).addClass('selected').siblings().removeClass('selected');

        var $this = $(this);

        var doThis = $this.closest('tr').attr('id');

        if (doThis != undefined) {

            var Enabled = $(this).children('td').eq(0).text();
            var Name = $(this).children('td').eq(1).text();

            var Audio = $(this).children('td').eq(2).text();
            var Video = $(this).children('td').eq(3).text();
            var Image = $(this).children('td').eq(4).text();
            var text = $(this).children('td').eq(5).text();

            Audio = setFileDefaults(Audio);
            Video = setFileDefaults(Video);
            Image = setFileDefaults(Image);

            var followAlertRowJson = {
                cid: Name,
                caudio: Audio,
                cvideo: Video,
                cimage: Image,
                ctext: text,
                cenabled: Enabled
            };

            SetCheckboxElement("altEnabled", followAlertRowJson.cenabled);
            SetSelectElement("alertName", followAlertRowJson.cid);
            SetSelectElement("selAlertTypeAltVars", "altAlertFollow");
            SetSelectElement("audioAltSelect", followAlertRowJson.caudio);
            SetSelectElement("videoAltSelect", followAlertRowJson.cvideo);
            SetSelectElement("imageAltSelect", followAlertRowJson.cimage);
            SetSelectElement("altText", followAlertRowJson.ctext);

        }

    });

    $("#tableHAL tr").click(function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        var value = $(this).find('tbody td:first').html();
        //alert(value);
    });

    $("#tableHAL tr").live("click", function() {
        $(this).addClass('selected').siblings().removeClass('selected');

        var $this = $(this);

        var doThis = $this.closest('tr').attr('id');

        if (doThis != undefined) {

            var Enabled = $(this).children('td').eq(0).text();
            var Name = $(this).children('td').eq(1).text();

            var Audio = $(this).children('td').eq(2).text();
            var Video = $(this).children('td').eq(3).text();
            var Image = $(this).children('td').eq(4).text();
            var text = $(this).children('td').eq(5).text();

            Audio = setFileDefaults(Audio);
            Video = setFileDefaults(Video);
            Image = setFileDefaults(Image);

            var hostAlertRowJson = {
                cid: Name,
                caudio: Audio,
                cvideo: Video,
                cimage: Image,
                ctext: text,
                cenabled: Enabled
            };

            SetCheckboxElement("altEnabled", hostAlertRowJson.cenabled);
            SetSelectElement("alertName", hostAlertRowJson.cid);
            SetSelectElement("selAlertTypeAltVars", "altAlertHost");
            SetSelectElement("audioAltSelect", hostAlertRowJson.caudio);
            SetSelectElement("videoAltSelect", hostAlertRowJson.cvideo);
            SetSelectElement("imageAltSelect", hostAlertRowJson.cimage);
            SetSelectElement("altText", hostAlertRowJson.ctext);

        }

    });

    $("#tableTIM tr").click(function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        var value = $(this).find('tbody td:first').html();
        //alert(value);
    });

    $("#tableTIM tr").live("click", function() {
        $(this).addClass('selected').siblings().removeClass('selected');

        var $this = $(this);

        var doThis = $(this).children('td').eq(0).text();

        if (doThis != undefined) {
            var id = doThis;

            var Enabled = $(this).children('td').eq(1).text();

            var TimerText = $(this).children('td').eq(2).text();
            var Interval = $(this).children('td').eq(3).text();



            var timerRowJson = {
                cid: id,
                ctext: TimerText,
                cenabled: Enabled,
                cinterval: Interval
            };


            SetCheckboxElement("chkTPBoxInputEnabled", timerRowJson.cenabled);
            SetSelectElement("TPtimerID", timerRowJson.cid);
            SetSelectElement("tpText", timerRowJson.ctext);
            SetSelectElement("tpInterval", timerRowJson.cinterval);


        }

    });


    $("#tableKW tr").click(function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        var value = $(this).find('tbody td:first').html();
        //alert(value);
    });




    $("#tableKW tr").live("click", function() {
        $(this).addClass('selected').siblings().removeClass('selected');


        var $this = $(this);

        var doThis = $this.closest('tr').attr('id');

        if (doThis != undefined) {
            var id = $this.closest('tr').attr('id').substr(2, $this.closest('tr').attr('id').length);

            var Enabled = $(this).children('td').eq(2).text();

            var output = $(this).children('td').eq(1).text();


            var commandRowJson = {
                cid: id,
                coutput: output,
                cenabled: Enabled
            };


            SetCheckboxElement("chkKWBoxInputEnabled", commandRowJson.cenabled);
            SetSelectElement("triggerName", commandRowJson.cid);
            SetSelectElement("kwTrigText", commandRowJson.coutput);


        }

    });

    $("#tableNotes tr").click(function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        var value = $(this).find('tbody td:first').html();
        //alert(value);
    });


    $("#tableNotes tr").live("click", function() {
        $(this).addClass('selected').siblings().removeClass('selected');


        var $this = $(this);

        var doThis = $this.closest('tr').attr('id');

        if (doThis != undefined) {
            var id = $this.closest('tr').attr('id').substr(2, $this.closest('tr').attr('id').length);

            var ToDo = $(this).children('td').eq(1).text();

            var Note = $(this).children('td').eq(2).text();


            var commandRowJson = {
                cid: id,
                cnote: Note,
                ctodo: ToDo
            };


            SetCheckboxElement("chkNTBoxInputEnabled", commandRowJson.ctodo);
            SetSelectElement("noteName", commandRowJson.cid);
            SetSelectElement("ntNoteText", commandRowJson.cnote);


        }

    });


    $("#tableCO tr").click(function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        var value = $(this).find('tbody td:first').html();

    });

    $("#tableCO tr").live("click", function() {
        $(this).addClass('selected').siblings().removeClass('selected');

        var $this = $(this);

        var doThis = $this.closest('tr').attr('id');

        if (doThis != undefined) {
            var id = $this.closest('tr').attr('id').substr(3, $this.closest('tr').attr('id').length - 3);

            var getPerms = getPermFromCommand($(this).children('td').eq(3).text());

            var Enabled = $(this).children('td').eq(0).text();
            var Name = $(this).children('td').eq(1).text();
            var text = $(this).children('td').eq(2).text();
            var Perms = getPerms;
            var User = $(this).children('td').eq(4).text();
            var Audio = $(this).children('td').eq(5).text();
            var Video = $(this).children('td').eq(6).text();
            var Image = $(this).children('td').eq(7).text();


            Audio = setFileDefaults(Audio);
            Video = setFileDefaults(Video);
            Image = setFileDefaults(Image);

            var commandRowJson = {
                cid: Name,
                cpermission: Perms,
                cuser: User,
                caudio: Audio,
                cvideo: Video,
                cimage: Image,
                ctext: text,
                ccooldown: "",
                cenabled: Enabled
            };


            SetCheckboxElement("chkBoxInputEnabled", commandRowJson.cenabled);
            SetSelectElement("commandName", commandRowJson.cid);
            SetSelectElement("selOptPermission", commandRowJson.cpermission);
            SetSelectElement("audioSelect", commandRowJson.caudio);
            SetSelectElement("videoSelect", commandRowJson.cvideo);
            SetSelectElement("imageSelect", commandRowJson.cimage);
            SetSelectElement("commandText", commandRowJson.ctext);

        }


    });



    /////// 
    minimisePartyUsersBox = function(dataElement, parentElement) {
        minimiseBoxFunction(dataElement, parentElement);
    }

    minimiseFollowersBox = function(dataElement, parentElement) {
        minimiseBoxFunction(dataElement, parentElement);
    }

    minimiseFollowingBox = function(dataElement, parentElement) {
        minimiseBoxFunction(dataElement, parentElement);
    }

    minimiseChatBox = function(dataElement, parentElement) {
        minimiseBoxFunction460(dataElement, parentElement);
    }

    minimiseChatUsersBox = function(dataElement, parentElement) {
        minimiseBoxFunction(dataElement, parentElement);
    }

    minimiseTimerBox = function(dataElement, parentElement) {
        minimiseBoxFunction(dataElement, parentElement);
    }


    minimiseModMonBox = function(dataElement, parentElement) {
        minimiseBoxFunction(dataElement, parentElement);
    }

    minimiseKeywordsBox = function(dataElement, parentElement) {
        minimiseBoxFunction(dataElement, parentElement);
    }

    minimiseNotesBox = function(dataElement, parentElement) {
        minimiseBoxFunction(dataElement, parentElement);
    }

    minimiseCommandListBox = function(dataElement, parentElement) {
        minimiseBoxFunction(dataElement, parentElement);
    }

    minimiseRecentFollowersBox = function(dataElement, parentElement) {
        minimiseBoxFunction(dataElement, parentElement);
    }


    minimiseCommandBoxFunction = function(dataElement, parentElement) {
        minimiseBoxFunction(dataElement, parentElement);
    }

    minimiseBoxFunction = function(dataElement, parentElement) {

        $('#' + dataElement).slideToggle();

        if (document.getElementById(parentElement).style.height == "80px") {
            document.getElementById(parentElement).style.height = "380px";
            document.getElementById(parentElement).style.zIndex = pushAllToBackReturnIntIn(9);
        } else {
            document.getElementById(parentElement).style.height = "80px";
            document.getElementById(parentElement).style.zIndex = pushAllToBackReturnIntIn(0);
        }

    }

    minimiseBoxFunction460 = function(dataElement, parentElement) {

        $('#' + dataElement).slideToggle();

        if (document.getElementById(parentElement).style.height == "80px") {
            document.getElementById(parentElement).style.height = "460px";
            document.getElementById(parentElement).style.zIndex = pushAllToBackReturnIntIn(9);
        } else {
            document.getElementById(parentElement).style.height = "80px";
            document.getElementById(parentElement).style.zIndex = pushAllToBackReturnIntIn(0);
        }

    }


    function pushAllToBackReturnIntIn(number) {


        var bringToBack = [];
        bringToBack.push("divWrapperChat");
        bringToBack.push("divWrapperCommands");
        bringToBack.push("divWrapperAlerts");
        bringToBack.push("divWrapperTriggerPanel");
        bringToBack.push("divWrapperMedia");
        bringToBack.push("divWrapperCommandsList");
        bringToBack.push("divWrapperFollowers");
        bringToBack.push("divWrapperFollowing");
        bringToBack.push("divWrapperHostAlertsList");
        bringToBack.push("divWrapperTimersList");
        bringToBack.push("divWrapperModMonitor");
        bringToBack.push("divWrapperTimerPanel");
        bringToBack.push("divWrapperFollowAlertsList");
        bringToBack.push("divWrapperNarrowChatUsers");
        bringToBack.push("divWrapperNarrowRecentFollowers");
        bringToBack.push("divWrapperKeywordsList");
        bringToBack.push("divWrapperNote");
        bringToBack.push("divWrapperNotesList");
        bringToBack.forEach(pushDivToBack, event.target.value);

        return number;
    }

    toggleSwitchModules = function(parentElement) {

        var x = document.getElementById(parentElement);
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }

    }

    addModeratorsActionToModMonitorList = function(data, type) {


        /*       <
              th > ID < /th> <
                  th > Moderator < /th> <
                  th > Action < /th> <
                  th > Username < /th> <
                  th > Date < /th> */


        /*                                  "id": "3f9f2580-dfb1-11e8-b318-cd5dc9b6c820",
                   "date": "2018-11-03T21:41:49.855Z",
                   "moderatorid": 52684962,
                   "moderatorname": "HersheyBot",
                   "rolewho": "Mod",
                   "action": "delete",
                   "user": "" */


        switch (type) {

            case "delete":
                var tr;
                tr = $('<tr id="MMO' + data.id + '" class /> ');
                tr.append("<td>" + data.date + "</td>");
                tr.append("<td>" + data.rolewho + "</td>");
                tr.append("<td>" + data.moderatorname + "</td>");
                tr.append("<td>" + 'Deleted Message' + "</td>");
                tr.append("<td>" + data.user + "</td>");
                tr.append("<td>" + data.id + "</td>");
                $('#tableMMO').append(tr);

                break;
            case "ban":
                tr = $('<tr id="MMO' + data.id + '" class /> ');
                tr.append("<td>" + data.date + "</td>");
                tr.append("<td>" + data.rolewho + "</td>");
                tr.append("<td>" + data.moderatorname + "</td>");
                tr.append("<td>" + 'Banned' + "</td>");
                tr.append("<td>" + data.user + "</td>");
                tr.append("<td>" + data.id + "</td>");
                $('#tableMMO').append(tr);

                break;
            case "PurgeOrTimeout":
                tr = $('<tr id="MMO' + data.id + '" class /> ');
                tr.append("<td>" + data.date + "</td>");
                tr.append("<td>" + data.rolewho + "</td>");
                tr.append("<td>" + data.moderatorname + "</td>");
                tr.append("<td>" + 'Purged/Timed Out' + "</td>");
                tr.append("<td>" + data.user + "</td>");
                tr.append("<td>" + data.id + "</td>");
                $('#tableMMO').append(tr);

                break;
            default:
                break;
        }
        //scroll table to end
        scrollToEnd('modmonListbox');


    }

    //adds list of followers to list
    addFollowersToList = function(data) {
        var tr;
        for (var i = 0; i < data.length; i++) {


            //these are your followers (people that you follow)
            tr = $('<tr id="YFL' + data[i].id + '" class /> ');
            tr.append("<td>" + data[i].id + "</td>");
            tr.append("<td>" + data[i].username + "</td>");
            tr.append("<td>" + data[i].followedDtFriendly + "</td>");
            $('#tableF').append(tr);

            //updates chat user if exists
            amendChatUserRowToFollower(data[i].id);
        }



    }

    addFollowingToList = function(data) {
        var tr;
        for (var i = 0; i < data.length; i++) {

            //these are people you follow
            tr = $('<tr id="FLW' + data[i].userId + '" class /> ');
            tr.append("<td>" + data[i].id + "</td>");
            tr.append("<td>" + data[i].token + "</td>");
            tr.append("<td>" + data[i].userId + "</td>");
            tr.append("<td>" + data[i].userId + "</td>");
            $('#tableCF').append(tr);
        }

        followingUsrsData = data;

    }


    //adds list of chat users to list
    addChatUsersToList = function(data) {


        var tr;
        for (var i = 0; i < data.length; i++) {

            var res = data[i].split(" - ", 3);
            var hidden = "display:none;";
            var isChatUrsFollowing = checkIfFollowing(res[2]);
            var ChatUrsFollowerResult = checkIfFollower(res[2]);

            //checks if user is already in chat table
            var addToTable = isInChat(res[2]);

            if (!addToTable) {
                tr = $('<tr id="CU' + res[2] + '" class /> ');
                // tr = $('<tr class /> ');
                tr.append("<td>" + data[i] + "</td>");
                tr.append("<td>" + ChatUrsFollowerResult + "</td>");
                tr.append("<td style=\"" + hidden + "\">" + res[2] + "</td>");
                $('#tableChatUsers').append(tr);
            }
        }
    }


    addHostAlertsToTable = function(data) {

        var tr;
        for (var i = 0; i < data.length; i++) {

            var hidden = "display:none;";


            tr = $('<tr id="HAL' + data[i].id + '" class /> ');
            // tr = $('<tr class /> ');
            tr.append("<td>" + data[i].enabled + "</td>");
            tr.append("<td>" + data[i].id + "</td>");
            tr.append("<td>" + data[i].audio + "</td>");
            tr.append("<td>" + data[i].video + "</td>");
            tr.append("<td>" + data[i].image + "</td>");
            tr.append("<td>" + data[i].text + "</td>");
            $('#tableHAL').append(tr);

        }
    }


    addFollowAlertsToTable = function(data) {

        var tr;
        for (var i = 0; i < data.length; i++) {

            var hidden = "display:none;";


            tr = $('<tr id="FAL' + data[i].id + '" class /> ');
            // tr = $('<tr class /> ');
            tr.append("<td>" + data[i].enabled + "</td>");
            tr.append("<td>" + data[i].id + "</td>");
            tr.append("<td>" + data[i].audio + "</td>");
            tr.append("<td>" + data[i].video + "</td>");
            tr.append("<td>" + data[i].image + "</td>");
            tr.append("<td>" + data[i].text + "</td>");
            $('#tableFAL').append(tr);

        }
    }



    addKeywordsToTable = function(data) {

        var tr;
        for (var i = 0; i < data.length; i++) {

            console.log('Keywords data for table is:' + data[i])

            var hidden = "display:none;";

            tr = $('<tr id="KW' + data[i].id + '" class /> ');
            // tr = $('<tr class /> ');
            tr.append("<td>" + data[i].id + "</td>");
            tr.append("<td>" + data[i].text + "</td>");
            tr.append("<td>" + data[i].enabled + "</td>");
            $('#tableKW').append(tr);

        }
    }



    addNotesToTable = function(data) {

        var tr;
        for (var i = 0; i < data.length; i++) {

            console.log('Notes data for table is:' + data[i])

            var hidden = "display:none;";

            tr = $('<tr id="NT' + data[i].id + '" class /> ');
            // tr = $('<tr class /> ');
            tr.append("<td style=\"" + hidden + "\">" + data.id + "</td>");
            tr.append("<td>" + data[i].todo + "</td>");
            tr.append("<td>" + data[i].note + "</td>");
            $('#tableNotes').append(tr);

        }
    }


    //this is when its a new table
    addorAmendTimerToTable = function(data) {

        var tr;


        var rowID = data.id.replace("!", "x");

        var timerRow = document.getElementById("tableTIM").rows.namedItem("TIM" + rowID);

        if (timerRow != null) {

            var timerRowIndex = timerRow.rowIndex;

            var x = document.getElementById("tableTIM").rows[timerRowIndex].cells;
            x[1].innerHTML = data.enabled;
            x[2].innerHTML = data.text;
            x[3].innerHTML = data.interval;
            x[4].innerHTML = data.option1;
            x[5].innerHTML = data.option2;


        } else {
            console.log('Timers data for table is:' + data.id)

            tr = $('<tr id="TIM' + rowID + '" class /> ');
            // tr = $('<tr class /> ');
            tr.append("<td>" + data.id + "</td>");
            tr.append("<td>" + data.enabled + "</td>");
            tr.append("<td>" + data.text + "</td>");
            tr.append("<td>" + data.interval + "</td>");
            tr.append("<td>" + data.option1 + "</td>");
            tr.append("<td>" + data.option2 + "</td>");

            $('#tableTIM').append(tr);
        }






    }


    addorAmendTriggerToTable = function(data) {

        var tr;

        var triggerRow = document.getElementById("tableKW").rows.namedItem("KW" + data.id);

        if (triggerRow != null) {

            var triggerRowIndex = triggerRow.rowIndex;

            var x = document.getElementById("tableKW").rows[triggerRowIndex].cells;

            x[1].innerHTML = data.text;
            x[2].innerHTML = data.enabled;



        } else {
            console.log('Trigger data for table is:' + data.id)

            tr = $('<tr id="KW' + data.id + '" class /> ');
            // tr = $('<tr class /> ');
            tr.append("<td>" + data.id + "</td>");
            tr.append("<td>" + data.text + "</td>");
            tr.append("<td>" + data.enabled + "</td>");


            $('#tableKW').append(tr);
        }

    }



    addorAmendCommandToTable = function(data) {

        var tr;
        var rowID = data.id.replace("!", "x");

        var triggerRow = document.getElementById("tableCO").rows.namedItem("CO" + rowID);

        if (triggerRow != null) {

            var triggerRowIndex = triggerRow.rowIndex;

            var x = document.getElementById("tableCO").rows[triggerRowIndex].cells;

            /*                             "enabled": "Y",
                        "id": "!test90809835",
                        "permission": "+m",
                        "user": "",
                        "audio": "!test123",
                        "video": "",
                        "image": "",
                        "text": "$channelInfo$target[$target has $sparks sparks and is a level $level] $target uptime is $uptime hiohdfgs $channelInfo$caster[$caster has $sparks sparks and is a level $level] $caster has been on for $uptime hiohdfgs",
                        "cooldown": "" */


            x[0].innerHTML = data.enabled;
            x[2].innerHTML = data.text;
            x[3].innerHTML = transformUIPermsToCommandPerms(data.permission);
            x[4].innerHTML = data.user;
            x[5].innerHTML = data.audio;
            x[6].innerHTML = data.video;
            x[7].innerHTML = data.image;
            // x[9].innerHTML = data.cooldown; not used



        } else {
            console.log('Trigger data for table is:' + data.id)

            tr = $('<tr id="CO' + rowID + '" class /> ');
            // tr = $('<tr class /> ');


            tr.append("<td>" + data.enabled + "</td>");
            tr.append("<td>" + data.id + "</td>");
            tr.append("<td>" + data.text + "</td>");
            tr.append("<td>" + transformUIPermsToCommandPerms(data.permission) + "</td>");
            tr.append("<td>" + data.user + "</td>");
            tr.append("<td>" + data.audio + "</td>");
            tr.append("<td>" + data.video + "</td>");
            tr.append("<td>" + data.image + "</td>");


            $('#tableCO').append(tr);
        }

    }

    addorAmendFollowAlertToTable = function(data) {

        var tr;

        var noteRow = document.getElementById("tableFAL").rows.namedItem("FAL" + data.id);

        if (noteRow != null) {

            var noteRowIndex = noteRow.rowIndex;

            var x = document.getElementById("tableFAL").rows[noteRowIndex].cells;

            x[0].innerHTML = data.enabled;
            x[1].innerHTML = data.id;
            x[2].innerHTML = data.audio;
            x[3].innerHTML = data.video;
            x[4].innerHTML = data.image;
            x[5].innerHTML = data.text;
            // x[6].innerHTML = data.audio;





        } else {
            console.log('Note data for table is:' + data.id)

            var hidden = "display:none;";

            tr = $('<tr id="FAL' + data.id + '" class /> ');
            // tr = $('<tr class /> ');
            /*   tr.append("<td style=\"" + hidden + "\">" + data.id + "</td>"); */
            tr.append("<td>" + data.enabled + "</td>");
            tr.append("<td>" + data.id + "</td>");
            tr.append("<td>" + data.audio + "</td>");
            tr.append("<td>" + data.video + "</td>");
            tr.append("<td>" + data.image + "</td>");
            tr.append("<td>" + data.text + "</td>");

            /*                           "id": "HAI2",
                 "audio": "!test123",
                 "video": "",
                 "image": "!test2345",
                 "text": "OMG  $user we have a new host",
                 "enabled": "Y",
                 "type": "altAlertHost" */

            $('#tableFAL').append(tr);
        }

    }


    addorAmendHostAlertToTable = function(data) {

        var tr;

        var noteRow = document.getElementById("tableHAL").rows.namedItem("HAL" + data.id);

        if (noteRow != null) {

            var noteRowIndex = noteRow.rowIndex;

            var x = document.getElementById("tableHAL").rows[noteRowIndex].cells;

            x[0].innerHTML = data.enabled;
            x[1].innerHTML = data.id;
            x[2].innerHTML = data.audio;
            x[3].innerHTML = data.video;
            x[4].innerHTML = data.image;
            x[5].innerHTML = data.text;
            // x[6].innerHTML = data.audio;





        } else {
            console.log('Note data for table is:' + data.id)

            var hidden = "display:none;";

            tr = $('<tr id="HAL' + data.id + '" class /> ');
            // tr = $('<tr class /> ');
            /*   tr.append("<td style=\"" + hidden + "\">" + data.id + "</td>"); */
            tr.append("<td>" + data.enabled + "</td>");
            tr.append("<td>" + data.id + "</td>");
            tr.append("<td>" + data.audio + "</td>");
            tr.append("<td>" + data.video + "</td>");
            tr.append("<td>" + data.image + "</td>");
            tr.append("<td>" + data.text + "</td>");

            /*                           "id": "HAI2",
                 "audio": "!test123",
                 "video": "",
                 "image": "!test2345",
                 "text": "OMG  $user we have a new host",
                 "enabled": "Y",
                 "type": "altAlertHost" */

            $('#tableHAL').append(tr);
        }

    }



    addorAmendNoteToTable = function(data) {

        var tr;

        var noteRow = document.getElementById("tableNotes").rows.namedItem("NT" + data.id);

        if (noteRow != null) {

            var noteRowIndex = noteRow.rowIndex;

            var x = document.getElementById("tableNotes").rows[noteRowIndex].cells;

            x[0].innerHTML = data.id;
            x[1].innerHTML = data.todo;
            x[2].innerHTML = data.note;



        } else {
            console.log('Note data for table is:' + data.id)

            var hidden = "display:none;";

            tr = $('<tr id="NT' + data.id + '" class /> ');
            // tr = $('<tr class /> ');
            tr.append("<td style=\"" + hidden + "\">" + data.id + "</td>");
            tr.append("<td>" + data.todo + "</td>");
            tr.append("<td>" + data.note + "</td>");

            $('#tableNotes').append(tr);
        }

    }



    addTimersToTable = function(data) {

        if (data != null) {

            var tr;
            for (var i = 0; i < data.length; i++) {
                var rowID = data[i].id.replace("!", "x");
                //var result = isFollowing(id);
                console.log('timers data for table is:' + data[i])

                var hidden = "display:none;";

                tr = $('<tr id="TIM' + rowID + '" class /> ');
                // tr = $('<tr class /> ');
                tr.append("<td>" + data[i].id + "</td>");
                tr.append("<td>" + data[i].enabled + "</td>");
                tr.append("<td>" + data[i].text + "</td>");
                tr.append("<td>" + data[i].interval + "</td>");
                tr.append("<td>" + "N/A" + "</td>");
                tr.append("<td>" + "N/A" + "</td>");
                $('#tableTIM').append(tr);

            }
        }
    }

    removeSingleFollowerFromList = function(data) {

        console.log("chat io - removeSingleFollowerFromList() " + data);

        $("#YFL" + data.info.user.id.toString()).remove();

        var rowCount = document.getElementById('tableF').rows.length - 1;

        // amends if still in chat and updates to not following
        amendChatUserRowToNonFollower(data.info.user.id);

        //var followCountStr = followerUsrs.length.toString();
        $("#followCountUsrs").empty();
        $('#followCountUsrs').append($('<p></p>').text(rowCount));
    }

    addSingleFollowerToList = function(data) {

        console.log("chat io - addSingleFollowerToList() " + data);

        followerUsrs.push(data.info.user.id);

        var tr;

        var d = new Date();

        tr = $('<tr id="YFL' + data.info.user.id + '" class /> ');
        tr.append("<td>" + data.info.user.id + "</td>");
        tr.append("<td>" + data.info.user.username + "</td>");
        tr.append("<td>" + d.toDateString() + "</td>");
        $('#tableF').append(tr);


        var rowCount = document.getElementById('tableF').rows.length - 1;

        //var followCountStr = followerUsrs.length.toString();
        $("#followCountUsrs").empty();
        $('#followCountUsrs').append($('<p></p>').text(rowCount));

        //updates chat user list if exists
        amendChatUserRowToFollower(data.info.user.id);
    }


    addSingleChatUserToList = function(data) {

        //console.log("chat io - addSingleChatUserToList() " + data);
        var newUser = [];
        var res = data.split(" - ", 3);

        console.log('User Array is' + JSON.stringify(data));

        //check these and whats in them
        newUser.push(res);
        chatUsrs.push(newUser);

        console.log('New Chat Usrs array is now ' + JSON.stringify(chatUsrs));

        // am I following chat user ?
        var ChatUsrFollowing = checkIfFollowing(res[2]);
        // is chat user following me ?
        var ChatUsrFollowerResult = checkIfFollower(res[2]);

        //delete any entries of that user
        isInChatDelete(res[2]);

        var hidden = "display:none;";
        var tr;
        tr = $('<tr id="CU' + res[2] + '" class /> ');
        tr.append("<td>" + data + "</td>");
        tr.append("<td>" + ChatUsrFollowerResult + "</td>");
        // tr.append("<td>" + ChatUsrFollowerResult + "</td>");
        tr.append("<td style=\"" + hidden + "\">" + res[2] + "</td>");
        $('#tableChatUsers').append(tr);

        var chatCountStrNew = chatUsrs.length.toString();
        $("#chatCountUsrs").empty();
        $('#chatCountUsrs').append($('<p></p>').text(chatCountStrNew));


    }


    amendChatUserRowToFollower = function(id) {

        var elid = "CU" + id;
        var el = document.getElementById(elid);

        if (el !== null) {

            var chatUserdata = document.getElementById(elid).cells[0].innerHTML.toString();


            if (document.getElementById(elid).firstChild == '[object HTMLTableCellElement]') {

                //Get contents off "cell clicked
                var content = "Follower";
                //amend chat user to follower
                var hidden = "display:none;";

                var row = '<tr id="' + elid + '" class /> ' + "<td>" + chatUserdata + "</td>" + "<td>" + content + "</td>" + "<td style=\"" + hidden + "\">" + id + "</td>";
                document.getElementById(elid).innerHTML = row;
            }
        }


    }

    amendChatUserRowToNonFollower = function(id) {

        var elid = "CU" + id;
        var el = document.getElementById(elid);
        console.log("Chat User Row data Element is: " + document.getElementById(elid).cells[0].innerHTML.toString())


        if (el !== null) {

            console.log(" unfollowed event entire element html is: " + document.getElementById(elid).innerHTML.toString());


            var chatUserdata = document.getElementById(elid).cells[0].innerHTML.toString();

            if (document.getElementById(elid).firstChild == '[object Text]') {

                //Get contents off "cell clicked
                var content = "Not a Follower";
                //amend chat user to follower
                var hidden = "display:none;";

                var row = '<tr id="' + elid + '" class /> ' + "<td>" + chatUserdata + "</td>" + "<td>" + content + "</td>" + "<td style=\"" + hidden + "\">" + id + "</td>";
                document.getElementById(elid).innerHTML = row;
            }
        }


    }

    removeSingleChatUserFromList = function(data) {

        console.log("User Left Channel");
        console.log(JSON.stringify(data));

        var res = data.split(" - ", 3);
        console.log(res);

        //check these and whats in them
        chatUsrs.shift(res);
        $("#CU" + res[2]).remove();

        var chatCountStrNew = chatUsrs.length.toString();
        $("#chatCountUsrs").empty();
        $('#chatCountUsrs').append($('<p></p>').text(chatCountStrNew));

    }

    removeNoteFromTable = function(noteID) {

        console.log("Removing Note");
        console.log("Note to remove is" + noteID);

        //check these and whats in them

        $("#NT" + noteID).remove();

    }

    removeTimerFromTable = function(timerID) {

        console.log("Removing Note");
        console.log("Timer to remove is" + timerID);

        //check these and whats in them

        $("#TIM" + timerID.replace("!", "x")).remove();

    }

    removeTriggerFromTable = function(triggerID) {


        console.log("Trigger to remove is" + triggerID);

        //check these and whats in them

        $("#KW" + triggerID.replace("!", "x")).remove();

    }

    removeAlertFromTable = function(alertObj) {


        if (alertObj.type == 'altAlertHost') {
            //check these and whats in them

            $("#HAL" + alertObj.id).remove();
        }


        if (alertObj.type == 'altAlertFollow') {
            //check these and whats in them

            $("#FAL" + alertObj.id).remove();
        }

    }

    removeCommandFromTable = function(commandID) {

        //check these and whats in them
        console.log("Command ID to remove is: " + commandID);
        $("#CO" + commandID).remove();

    }


    commandsPanelSelectPerms = function(data) {
        if (data === "User") {

            document.getElementById("commandUser").readOnly = false;


        } else {
            document.getElementById("commandUser").readOnly = true;
        }
    }

    mediaTypeSelected = function(data) {
        data = document.getElementById(data).selectedOptions[0].innerText;

        switch (data) {
            case "Audio":
                document.getElementById("audioMedSelect").disabled = false;
                document.getElementById("selAudioDurationMedVars").disabled = false;

                document.getElementById("imageMedSelect").disabled = true;
                document.getElementById("selImageDurationMedVars").disabled = true;
                document.getElementById("videoMedSelect").disabled = true;
                document.getElementById("selVideoDurationMedVars").disabled = true;

                document.getElementById("imageMedSelect").value = "default";
                document.getElementById("selImageDurationMedVars").value = "default";
                document.getElementById("videoMedSelect").value = "default";
                document.getElementById("selVideoDurationMedVars").value = "default";

                document.getElementById("medAudOtherValue").readOnly = true;
                document.getElementById("medAudOtherValue").value = "";
                document.getElementById("medImgOtherValue").readOnly = true;
                document.getElementById("medImgOtherValue").value = "";
                document.getElementById("medVidOtherValue").readOnly = true;
                document.getElementById("medVidOtherValue").value = "";
                break;

            case "Image":
                document.getElementById("imageMedSelect").disabled = false;
                document.getElementById("selImageDurationMedVars").disabled = false;

                document.getElementById("audioMedSelect").disabled = true;
                document.getElementById("selAudioDurationMedVars").disabled = true;
                document.getElementById("videoMedSelect").disabled = true;
                document.getElementById("selVideoDurationMedVars").disabled = true;


                document.getElementById("audioMedSelect").value = "default";
                document.getElementById("selAudioDurationMedVars").value = "default";
                document.getElementById("videoMedSelect").value = "default";
                document.getElementById("selVideoDurationMedVars").value = "default";

                document.getElementById("medAudOtherValue").readOnly = true;
                document.getElementById("medAudOtherValue").value = "";
                document.getElementById("medImgOtherValue").readOnly = true;
                document.getElementById("medImgOtherValue").value = "";
                document.getElementById("medVidOtherValue").readOnly = true;
                document.getElementById("medVidOtherValue").value = "";

                break;

            case "Video":
                document.getElementById("videoMedSelect").disabled = false;
                document.getElementById("selVideoDurationMedVars").disabled = false;

                document.getElementById("imageMedSelect").disabled = true;
                document.getElementById("selImageDurationMedVars").disabled = true;
                document.getElementById("audioMedSelect").disabled = true;
                document.getElementById("selAudioDurationMedVars").disabled = true;


                document.getElementById("audioMedSelect").value = "default";
                document.getElementById("selAudioDurationMedVars").value = "default";
                document.getElementById("imageMedSelect").value = "default";
                document.getElementById("selImageDurationMedVars").value = "default";

                document.getElementById("medAudOtherValue").readOnly = true;
                document.getElementById("medAudOtherValue").value = "";
                document.getElementById("medImgOtherValue").readOnly = true;
                document.getElementById("medImgOtherValue").value = "";
                document.getElementById("medVidOtherValue").readOnly = true;
                document.getElementById("medVidOtherValue").value = "";

                break;

            default:
                document.getElementById("audioMedSelect").value = "default";
                document.getElementById("selAudioDurationMedVars").value = "default";
                document.getElementById("imageMedSelect").value = "default";
                document.getElementById("selImageDurationMedVars").value = "default";
                document.getElementById("videoMedSelect").value = "default";
                document.getElementById("selVideoDurationMedVars").value = "default";

                document.getElementById("medAudOtherValue").readOnly = true;
                document.getElementById("medAudOtherValue").value = "";
                document.getElementById("medImgOtherValue").readOnly = true;
                document.getElementById("medImgOtherValue").value = "";
                document.getElementById("medVidOtherValue").readOnly = true;
                document.getElementById("medVidOtherValue").value = "";
                break;
        }


    }

    audioDurOtherSelected = function(data) {
        data = document.getElementById(data).selectedOptions[0].innerText;

        if (data === "Other") {

            document.getElementById("medAudOtherValue").readOnly = false;

        } else {
            document.getElementById("medAudOtherValue").readOnly = true;
            document.getElementById("medAudOtherValue").value = "";
        }
    }

    imageDurOtherSelected = function(data) {
        data = document.getElementById(data).selectedOptions[0].innerText;
        if (data === "Other") {

            document.getElementById("medImgOtherValue").readOnly = false;


        } else {
            document.getElementById("medImgOtherValue").readOnly = true;
            document.getElementById("medImgOtherValue").value = "";
        }
    }


    videoDurOtherSelected = function(data) {
        data = document.getElementById(data).selectedOptions[0].innerText;
        if (data === "Other") {

            document.getElementById("medVidOtherValue").readOnly = false;


        } else {
            document.getElementById("medVidOtherValue").readOnly = true;
            document.getElementById("medVidOtherValue").value = "";
        }
    }

    //check the following to see if I am following my follower
    function checkIfFollowing(data) {

        var found = isFollowing(data);

        if (found)
            return "Unfollow";
        else
            return "Follow"

    };



    isFollowing = function(userID) {
        //check if chat user is following
        var FollowingRow = $("#FLW" + userID);

        if (FollowingRow !== null) {
            return true;
        } else {
            return false;
        }

    }





    isMyFollowingAFollower = function(userID) {
        //is the person I am following a follower i.e are they in my followers list?
        var FollowingRow = $("#YFL" + userID);

        if (FollowingRow !== null) {

            //I am following
            return "Follows Me";
        } else {
            //I am not following
            return "Does Follow Me";
        }

    }


    //
    isFollowingMyFollower = function(userID) {
        //check if I am following my follower
        var FollowingRow = $("#FLW" + userID);

        if (FollowingRow !== null) {

            //I am following
            return "Following";
        } else {
            //I am not following
            return "Not Following";
        }

    }




    //check if user is follower
    function checkIfFollower(data) {

        var found = isFollower(data);

        if (found)
            return "Follower";
        else
            return "Not a Follower"

    };

    isFollower = function(userID) {
        //check if chat user is following

        var FollowerRow = document.getElementById("tableF").rows.namedItem("YFL" + userID);

        if (FollowerRow !== null) {
            return true;
        } else {
            return false;
        }

    }

    isInChatDelete = function(userID) {
        //check if chat user is following
        console.log('user to delete is: ' + userID);

        var FollowerRow = document.getElementById("tableChatUsers").rows.namedItem("CU" + userID);
        console.log('user to delete is: ' + userID);

        if (FollowerRow !== null) {
            $("#CU" + FollowerRow[2]).remove();
        } else {

        }

    }

    isInChat = function(userID) {

        var FollowerRow = document.getElementById("tableChatUsers").rows.namedItem("CU" + userID);


        if (FollowerRow !== null) {
            return true;
        } else {
            return false;
        }

    }


    //this deals with themodules switches
    chkBoxToglModuleVisible = function(div) {


        var x = document.getElementById(div);


        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }



    }


    // var switch1var = document.getElementById('switch1').checked;

    //#region 
    $("#chtUsrChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperNarrowChatUsers');
    });

    $("#recentFollowersChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperNarrowRecentFollowers');
    });

    $("#chtBoxChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperChat');
    });

    $("#followersChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperFollowers');
    });

    $("#followingChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperFollowing');
    });

    $("#partyQChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperNarrowPartyUsers');
    });

    $("#commandsChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperCommands');
    });

    $("#mediafilesChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperMedia');
    });

    $("#alertfilesChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperAlerts');
    });

    $("#hostalertsChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperHostAlertsList');
    });

    $("#followalertsChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperFollowAlertsList');
    });

    //LIST MODULES
    $("#commandsListChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperCommandsList');
    });

    $("#keywordsListChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperKeywordsList');
    });

    $("#noteChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperNote');
    });

    $("#notesListChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperNotesList');
    });


    $("#keywordPanelChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperTriggerPanel');
    });

    $("#timerListChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperTimersList');
    });

    $("#modMonChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperModMonitor');
    });

    $("#managerTimersChkBox").change(function() {
        chkBoxToglModuleVisible('divWrapperTimerPanel');
    });

    $("#switch1").change(function() {

        if (document.getElementById('switch1').checked) {

            alert('checked');
            $('.switch1').css({
                "background-color": "green"
            });


            iosocket.emit('startTimers', null);

        } else {
            // alert('unchecked');
            $('.switch1').css({
                "background-color": "gray"
            });

            iosocket.emit('stopTimers', null);
        }

    });


    // this plays a sound on the page for use with commands and possiblity quotes timers etc..
    playCommandSound = function(file) {
        /*     var snd = new Audio("../sounds/sound1.mp3"); // buffers automatically when created
            snd.play(); 
            file
            */
        // var src = "../sounds/sound1.mp3";
        var src = "../sounds/" + file;
        var c = document.createElement('audio');
        c.src = src;

        c.play();
    }

    addSaveCommand = function() {

        var cmdObject = getCommandVariablesFromUI();

        if (cmdObject != undefined) {
            iosocket.emit('addSaveCommand', cmdObject);
        }

        setAddSaveDeleteCommandDefaults();


    }

    addSaveCurrency = function() {

        var currObject = getCurrencyVariablesFromUI();

        if (currObject != undefined) {
            iosocket.emit('addSaveCurrency', currObject);
        }

        setAddSaveDeleteCurrencyDefaults();

    }


    deleteCommand = function() {

        var cmdObject = getCommandVariablesFromUI();

        if (cmdObject != undefined) {
            iosocket.emit('deleteCommand', cmdObject);
        }

        setAddSaveDeleteCommandDefaults();

    }

    addSaveTimer = function() {
        var timObject = getTimerVariablesFromUI();

        if (timObject != undefined) {
            iosocket.emit('addSaveTimer', timObject);
        }

        setSaveDeleteTimerDefaults();
    }

    addSaveTrigger = function() {
        var triObject = getTriggerVariablesFromUI();

        if (triObject != undefined) {
            iosocket.emit('addSaveTrigger', triObject);
        }

        setSaveDeleteTriggerDefaults();
    }

    addSaveNote = function() {
        var notObject = getNoteVariablesFromUI();

        if (notObject != undefined) {
            iosocket.emit('addSaveNote', notObject);
        }

        setSaveNoteDefaults();
    }

    deleteNote = function() {
        var notObject = getNoteVariablesFromUI();

        if (notObject != undefined) {
            iosocket.emit('deleteNote', notObject);
        }
        setDeleteNoteDefaults();
    }

    newNote = function() {

        newNoteDefaults();

    }

    completeNote = function() {

        SetCheckboxElement("chkNTBoxInputEnabled", false);
        var notObject = getNoteVariablesFromUI();

        if (notObject != undefined) {
            iosocket.emit('completeNote', notObject);
        }

        SetSelectElement("noteName", "");
        SetSelectElement("ntNoteText", "");
    }

    deleteTrigger = function() {
        var triObject = getTriggerVariablesFromUI();

        if (triObject != undefined) {
            iosocket.emit('deleteTrigger', triObject);
        }

        setSaveDeleteTriggerDefaults();
    }

    deleteTimer = function() {
        var timObject = getTimerVariablesFromUI();

        if (timObject != undefined) {
            iosocket.emit('deleteTimer', timObject);
        }

        setSaveDeleteTimerDefaults();
    }


    //need to work on this
    addEditAlert = function() {

        var cmdObject = getAlertVariablesFromUI();


        iosocket.emit('addEditAlert', cmdObject);

        setAddSaveDeleteAlertDefaults();

    }


    deleteAlert = function() {

        var cmdObject = getAlertVariablesFromUI();

        if (cmdObject != undefined) {
            iosocket.emit('deleteAlert', cmdObject);
        }

        setAddSaveDeleteAlertDefaults();
    }

    addSaveMedia = function() {

        var mediaObject = getMediaVariablesFromUI();

        if (mediaObject != undefined) {
            iosocket.emit('addSaveMedia', mediaObject);
        }

    }


    function getLetterFullDateTimeString(dateIn) {

        var dayWeek = getWeekDayName(dateIn.getDay());
        var dayNo = getDayName(dateIn.getDate());
        var monthName = getDateMonthName(dateIn.getMonth());
        var yearstr = dateIn.getFullYear();
        var hoursValue = dateIn.getHours() + ':' + dateIn.getMinutes() + ':' + dateIn.getSeconds();

        return dayWeek + ' ' + dayNo + ' ' + monthName + ' ' + yearstr + ' ' + hoursValue;
    }

    function getFullDateTimeStringForID(dateIn) {

        var dayWeek = dateIn.getDay();
        var dayNo = dateIn.getDate();
        var monthName = dateIn.getMonth();
        var yearstr = dateIn.getFullYear();
        var hoursValue = dateIn.getHours() + dateIn.getMinutes() + dateIn.getSeconds();



        return "n" + dayWeek + dayNo + monthName + yearstr + hoursValue;
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

    function getTimerVariablesFromUI() {

        var timerEnabled = document.getElementById('chkTPBoxInputEnabled').checked;
        var timerName = document.getElementById('TPtimerID').value;
        var timerText = document.getElementById('tpText').value;
        var timerInterval = document.getElementById('tpInterval').value;

        if (timerName == "" || timerInterval == "") {

            if (timerName == "") {
                alert("Please Select a Timer ID");
                return;
            } else {
                alert("Please Select an Interval");
                return;
            }

        }

        var timerObject = new Object();

        //creates the command object
        timerObject["enabled"] = convertEnabledBoolToYORN(timerEnabled);
        timerObject["id"] = timerName;
        timerObject["text"] = timerText;
        timerObject["interval"] = parseInt(timerInterval);
        timerObject["option1"] = "";
        timerObject["option2"] = "";


        return timerObject;

    }




    function getTriggerVariablesFromUI() {


        var triggerEnabled = document.getElementById('chkKWBoxInputEnabled').checked;
        var triggerName = document.getElementById('triggerName').value;
        var triggerText = document.getElementById('kwTrigText').value;

        var triggerObject = new Object();

        //creates the command object
        triggerObject["enabled"] = convertEnabledBoolToYORN(triggerEnabled);
        triggerObject["id"] = triggerName;
        triggerObject["text"] = triggerText;
        triggerObject["option1"] = "";
        triggerObject["option2"] = "";

        return triggerObject;

    }

    function getNoteVariablesFromUI() {


        var noteEnabled = document.getElementById('chkNTBoxInputEnabled').checked;
        var noteName = document.getElementById('noteName').value;
        var noteText = document.getElementById('ntNoteText').value;

        var noteObject = new Object();

        //creates the command object
        noteObject["id"] = noteName;
        noteObject["todo"] = convertEnabledBoolToYORN(noteEnabled);
        noteObject["note"] = noteText;


        return noteObject;

    }

    function newNoteDefaults() {


        var datetimeNow = new Date();

        var newID = getFullDateTimeStringForID(datetimeNow);



        SetCheckboxElement("chkNTBoxInputEnabled", "Y");
        SetSelectElement("noteName", newID);
        SetSelectElement("ntNoteText", "");

    }

    function setSaveNoteDefaults() {


        SetCheckboxElement("chkNTBoxInputEnabled", "Y");
        SetSelectElement("noteName", "");
        SetSelectElement("ntNoteText", "");

    }

    function setSaveDeleteTimerDefaults() {

        SetCheckboxElement("chkTPBoxInputEnabled", "Y");
        SetSelectElement("TPtimerID", "");
        SetSelectElement("tpText", "");
        SetSelectElement("tpInterval", "");

    }

    function setSaveDeleteTriggerDefaults() {

        SetCheckboxElement("chkKWBoxInputEnabled", "Y");
        SetSelectElement("triggerName", "");
        SetSelectElement("kwTrigText", "");

    }


    function setAddSaveDeleteCommandDefaults() {

        SetCheckboxElement("chkBoxInputEnabled", "Y");
        SetSelectElement("commandUser", "");
        SetSelectElement("commandText", "");
        SetSelectElement("commandName", "");

        document.getElementById('audioSelect').value = "default";
        document.getElementById('videoSelect').value = "default";
        document.getElementById('imageSelect').value = "default";
        document.getElementById('selOptVars').value = "default";
        document.getElementById('selOptPermission').value = "default";

    }

    function setAddSaveDeleteCurrencyDefaults() {

        SetCheckboxElement("chkBoxInputEnabled", "Y");
        SetSelectElement("commandUser", "");
        SetSelectElement("commandText", "");
        SetSelectElement("commandName", "");

        document.getElementById('audioSelect').value = "default";
        document.getElementById('videoSelect').value = "default";
        document.getElementById('imageSelect').value = "default";
        document.getElementById('selOptVars').value = "default";
        document.getElementById('selOptPermission').value = "default";

    }


    function setAddSaveDeleteAlertDefaults() {

        SetCheckboxElement("chkaltBoxInputEnabled", "Y");
        SetSelectElement("altText", "");
        SetSelectElement("alertName", "");

        document.getElementById('audioAltSelect').value = "default";
        document.getElementById('videoAltSelect').value = "default";
        document.getElementById('imageAltSelect').value = "default";
        document.getElementById('selAlertTypeAltVars').value = "default";

    }

    function setDeleteNoteDefaults() {

        SetCheckboxElement("chkNTBoxInputEnabled", "Y");
        SetSelectElement("noteName", "");
        SetSelectElement("ntNoteText", "");

    }



    function getCommandVariablesFromUI() {

        var commandEnabled = document.getElementById('chkBoxInputEnabled').checked;
        var commandName = document.getElementById('commandName').value;
        var commandPermission = document.getElementById('selOptPermission').value;
        var commandUserSpecific = document.getElementById('commandUser').value;
        var commandAudioFile = document.getElementById('audioSelect').value;
        var commandVideoFile = document.getElementById('videoSelect').value;
        var commandImageFile = document.getElementById('imageSelect').value;
        var commandText = document.getElementById('commandText').value;

        var commandObject = new Object();

        if (commandAudioFile.startsWith("Select") && commandVideoFile.startsWith("Select") && commandImageFile.startsWith("Select") && commandText == "") {
            alert("You must select at least one of the four command types");
            return;
        } else {

            //defaults need to be cleared / set to nothing
            commandAudioFile = clearFileDefaults(commandAudioFile);
            commandVideoFile = clearFileDefaults(commandVideoFile);
            commandImageFile = clearFileDefaults(commandImageFile);

            //creates the command object
            commandObject["enabled"] = convertEnabledBoolToYORN(commandEnabled);
            commandObject["id"] = commandName;
            commandObject["permission"] = commandPermission;
            commandObject["user"] = commandUserSpecific;
            commandObject["audio"] = commandAudioFile;
            commandObject["video"] = commandVideoFile;
            commandObject["image"] = commandImageFile;
            commandObject["text"] = commandText;

        }

        return commandObject;
    }


    function getCurrencyVariablesFromUI() {


        var noteEnabled = document.getElementById('chkNTBoxInputEnabled').checked;
        var noteName = document.getElementById('noteName').value;
        var noteText = document.getElementById('ntNoteText').value;

        var noteObject = new Object();

        //creates the command object
        noteObject["id"] = noteName;
        noteObject["todo"] = convertEnabledBoolToYORN(noteEnabled);
        noteObject["note"] = noteText;






        return noteObject;

    }


    function clearFileDefaults(value) {
        if (value.startsWith("default")) {
            return "";
        } else {
            return value;
        }
    }

    function setFileDefaults(value) {
        if (value == "") {
            return "default";
        } else {
            return value;
        }
    }


    //need to work on this
    function getAlertVariablesFromUI() {

        var alertEnabled = document.getElementById('chkaltBoxInputEnabled').checked;
        var alertName = document.getElementById('alertName').value;
        var commandAudioFile = document.getElementById('audioAltSelect').value;
        var commandVideoFile = document.getElementById('videoAltSelect').value;
        var commandImageFile = document.getElementById('imageAltSelect').value;
        var commandText = document.getElementById('altText').value;
        var commandAlertType = document.getElementById('selAlertTypeAltVars').value;

        if (alertName == "" | commandAlertType == "") {
            alert("Please Fill In the Alert Name and Type");
            return;
        }

        //clears defaults
        commandAudioFile = clearFileDefaults(commandAudioFile);
        commandVideoFile = clearFileDefaults(commandVideoFile);
        commandImageFile = clearFileDefaults(commandImageFile);

        if (commandAudioFile == "" && commandVideoFile == "" && commandImageFile == "" && commandText == "") {
            alert("Please Fill in Audio , Image , Video or Text");
            return;
        }



        var commandObject = new Object();
        commandObject["enabled"] = convertEnabledBoolToYORN(alertEnabled);
        commandObject["id"] = alertName;
        commandObject["audio"] = commandAudioFile;
        commandObject["video"] = commandVideoFile;
        commandObject["image"] = commandImageFile;
        commandObject["text"] = commandText;
        commandObject["type"] = commandAlertType;

        return commandObject;

    }


    function getMediaVariablesFromUI() {

        var mediaEnabled = document.getElementById('chkmedBoxInputEnabled').checked;
        var mediaName = document.getElementById('mediaName').value;

        var mediaType = document.getElementById('selMediaTypeMedVars').selectedOptions[0].innerText;
        var mediaAudioFile = document.getElementById('audioMedSelect').selectedOptions[0].innerText;
        var mediaAudioDur = document.getElementById('selAudioDurationMedVars').selectedOptions[0].innerText;
        var mediaAudioOtherVal = document.getElementById('medAudOtherValue').value;

        var mediaVideoFile = document.getElementById('videoMedSelect').selectedOptions[0].innerText;
        var mediaVideoDur = document.getElementById('selVideoDurationMedVars').selectedOptions[0].innerText;
        var mediaVideoOtherVal = document.getElementById('medVidOtherValue').value;

        var mediaImageFile = document.getElementById('imageMedSelect').selectedOptions[0].innerText;
        var mediaImageDur = document.getElementById('selImageDurationMedVars').selectedOptions[0].innerText;
        var mediaImageOtherVal = document.getElementById('medImgOtherValue').value;

        //TODO get value from durations and convert to milliseconds

        if (mediaType.startsWith("Select") | mediaName == "") {
            alert("Please select a Media Type and Media Name");
            return;
        } else {

            var mediaObject = new Object();
            if (mediaType == "Audio") {

                if (mediaAudioFile.startsWith("Select") | mediaAudioDur.startsWith("Select")) {
                    alert("Please select an audio file and audio duration");
                    return;
                } else {

                    if (mediaAudioOtherVal.length > 0) {

                        mediaAudioDur = setMediaDurationFromUI(mediaAudioOtherVal, mediaAudioDur);

                    } else {
                        mediaAudioDur = convertUIDurationToMilliseconds(mediaAudioDur)
                    }

                    if (mediaAudioDur != "") {
                        mediaObject["enabled"] = convertEnabledBoolToYORN(mediaEnabled);
                        mediaObject["id"] = mediaName;
                        mediaObject["type"] = mediaType;
                        mediaObject["audio"] = mediaAudioFile;
                        mediaObject["audiodur"] = mediaAudioDur;
                        mediaObject["video"] = "";
                        mediaObject["videodur"] = "";
                        mediaObject["image"] = "";
                        mediaObject["imagedur"] = "";

                    }

                }

            }

            if (mediaType == "Image") {

                if (mediaImageFile.startsWith("Select") | mediaImageDur.startsWith("select")) {
                    alert("Please select an Image file and image duration");
                    return;
                } else {

                    if (mediaImageOtherVal.length > 0) {

                        mediaImageDur = setMediaDurationFromUI(mediaImageOtherVal, mediaImageDur);
                    } else {
                        mediaImageDur = convertUIDurationToMilliseconds(mediaImageDur);
                    }

                    mediaObject["enabled"] = convertEnabledBoolToYORN(mediaEnabled);
                    mediaObject["id"] = mediaName;
                    mediaObject["type"] = mediaType;
                    mediaObject["audio"] = "";
                    mediaObject["audiodur"] = "";
                    mediaObject["video"] = "";
                    mediaObject["videodur"] = "";
                    mediaObject["image"] = mediaImageFile;
                    mediaObject["imagedur"] = mediaImageDur;
                }
            }

            if (mediaType == "Video") {

                if (mediaVideoFile.startsWith("Select") | mediaVideoDur.startsWith("Select")) {
                    alert("Please select a video file and video duration");
                    return;
                } else {

                    if (mediaVideoOtherVal.length > 0) {

                        mediaVideoDur = setMediaDurationFromUI(mediaVideoOtherVal, mediaVideoDur);

                    } else {
                        mediaVideoDur = convertUIDurationToMilliseconds(mediaVideoDur)
                    }

                    mediaObject["enabled"] = convertEnabledBoolToYORN(mediaEnabled);
                    mediaObject["id"] = mediaName;
                    mediaObject["type"] = mediaType;
                    mediaObject["audio"] = "";
                    mediaObject["audiodur"] = "";
                    mediaObject["video"] = mediaVideoFile;
                    mediaObject["videodur"] = mediaVideoDur;
                    mediaObject["image"] = "";
                    mediaObject["imagedur"] = "";
                }
            }

            return mediaObject;

        }


    }



    //this manages the device widths, its a start
    setDeviceWidthLayout();

});

function convertEnabledBoolToYORN(value) {
    if (value == true) {
        return "Y";
    } else {
        return "N";
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

function setMediaDurationFromUI(OtherVal, durValue) {

    if (OtherVal.startsWith("0")) {
        durValue = OtherVal.substring(1) * 1000;
    } else {
        durValue = parseInt(OtherVal) * 1000;
    }
    return durValue;
}



function convertUIDurationToMilliseconds(durationIn) {

    switch (durationIn) {

        case "":
            return "";
        case "5 Seconds":
            return 5000;
        case "10 Seconds":
            return 10000;
        case "15 Seconds":
            return 15000;
        case "30 Seconds":
            return 30000;
        case "60 Seconds":
            return 60000;
        case "Other":
            return "Other";
        default:
            return "";
    }

}

function getPermFromCommand(commandPermissions) {

    switch (commandPermissions) {
        case "+m":
            return "Mod";
        case "+v":
            return "Viewer";
        case "+o":
            return "Owner";
        case "+f":
            return "Follower";
        case "+s":
            return "Subscriber";
        case "+u":
            return "User";
        default:
            return "Viewer";
    }

}

function pushDivToBack(value, index, array) {

    var x = document.getElementById(value);
    x.style.zIndex = 0;

}



function setDefaultTheme(data) {

    let outsideColour = data.outside;
    let insideColour = data.inside;
    let buttoncolorColour = data.buttoncolor;
    let buttontextcolorColour = data.buttontextcolor;
    let searchbgColour = data.searchbg;
    let combocolourColour = data.combocolour;
    let combotextcolorColour = data.combotextcolor;
    let panelheadertextcolorColour = data.panelheadertextcolor;
    let bgcolorColour = data.bgcolor;


    var picker = document.getElementById('OutsideColorPicker');
    picker.setAttribute('value', outsideColour);
    picker.dispatchEvent(new Event('change'));

    picker = document.getElementById('InsideColorPicker');
    picker.setAttribute('value', insideColour);
    picker.dispatchEvent(new Event('change'));

    picker = document.getElementById('TogglesColorPicker');
    picker.setAttribute('value', buttoncolorColour);
    picker.dispatchEvent(new Event('change'));

    picker = document.getElementById('TogglesTextColorPicker');
    picker.setAttribute('value', buttontextcolorColour);
    picker.dispatchEvent(new Event('change'));

    picker = document.getElementById('SearchColorPicker');
    picker.setAttribute('value', searchbgColour);
    picker.dispatchEvent(new Event('change'));

    picker = document.getElementById('DropdownBackgroundColorPicker');
    picker.setAttribute('value', combocolourColour);
    picker.dispatchEvent(new Event('change'));

    picker = document.getElementById('DropdownTextColorPicker');
    picker.setAttribute('value', combotextcolorColour);
    picker.dispatchEvent(new Event('change'));

    picker = document.getElementById('ModuleTextColorPicker');
    picker.setAttribute('value', panelheadertextcolorColour);
    picker.dispatchEvent(new Event('change'));

    picker = document.getElementById('ModuleBackgroundColorPicker');
    picker.setAttribute('value', bgcolorColour);
    picker.dispatchEvent(new Event('change'));

}

function changeBotBackgroundColor(event) {


    changeBotBackgroundItemChange(event.target.value);
    saveUIThemeSetting('bgcolor', event.target.value);

}

function changeTextOnModules(event) {

    var themeElementsText = [];
    themeElementsText.push("sendMessageTxtBox");
    themeElementsText.push("followCountUsrs");
    themeElementsText.push("followingCountUsrs");
    themeElementsText.push("recentFollowersCount");
    themeElementsText.push("commandPanelHeaderText");
    themeElementsText.push("commandsListHeaderText");
    themeElementsText.push("triggerPanelHeaderText");
    themeElementsText.push("notePanelHeaderText");
    themeElementsText.push("timerpanelPanelHeaderText");
    themeElementsText.push("mediaPanelHeaderText");
    themeElementsText.push("alertsPanelHeaderText");
    themeElementsText.push("chatwindowText");
    themeElementsText.push("menutexthostalerts");
    themeElementsText.push("menutextfollowalerts");
    themeElementsText.push("menutextkeywords");
    themeElementsText.push("menutexttimerlist");
    themeElementsText.push("menutextmodmonitor");
    themeElementsText.push("menutextrecentfollowers");
    themeElementsText.push("rankHeaderText");
    themeElementsText.push("currencyListHeaderText");
    themeElementsText.push("currencyHeaderText");



    themeElementsText.forEach(changeThemeTextItemChange, event.target.value);




    //change div text colour by class name 
    var themeElementsInsideModuleTextFormatting = [];
    themeElementsInsideModuleTextFormatting.push("medSpansCombo");
    themeElementsInsideModuleTextFormatting.push("medSpans");
    themeElementsInsideModuleTextFormatting.push("altSpansCombo");
    themeElementsInsideModuleTextFormatting.push("altSpans");
    themeElementsInsideModuleTextFormatting.push("triSpans");
    themeElementsInsideModuleTextFormatting.push("notSpans");
    themeElementsInsideModuleTextFormatting.push("triSpansMedium");
    themeElementsInsideModuleTextFormatting.push("notSpansMedium");
    themeElementsInsideModuleTextFormatting.push("triSpansFirst");
    themeElementsInsideModuleTextFormatting.push("notSpansFirst");
    themeElementsInsideModuleTextFormatting.push("triSpansCombo");
    themeElementsInsideModuleTextFormatting.push("cmdSpansCombo");
    themeElementsInsideModuleTextFormatting.push("cmdSpans");
    themeElementsInsideModuleTextFormatting.push("mediaPanelSmalllbl");
    themeElementsInsideModuleTextFormatting.push("modulemenubartext");
    themeElementsInsideModuleTextFormatting.forEach(changeDivTextItemChange, event.target.value);

    saveUIThemeSetting('panelheadertextcolor', event.target.value);

}

function changeOutsideBox(event) {

    var themeElementsMain = [];
    themeElementsMain.push("divWrapperFollowers");
    themeElementsMain.push("divWrapperFollowing");
    themeElementsMain.push("divWrapperNarrowChatUsers");
    themeElementsMain.push("divWrapperNarrowRecentFollowers");
    themeElementsMain.push("divWrapperChat");
    themeElementsMain.push("divWrapperCommands");
    themeElementsMain.push("divWrapperCommandsList");
    themeElementsMain.push("divWrapperMedia");
    themeElementsMain.push("divWrapperAlerts");
    themeElementsMain.push("divWrapperTriggerPanel");
    themeElementsMain.push("divWrapperNotesList");
    themeElementsMain.push("divWrapperModMonitor");
    themeElementsMain.push("divWrapperTimerPanel");
    themeElementsMain.push("divWrapperTimersList");
    themeElementsMain.push("divWrapperFollowAlertsList");
    themeElementsMain.push("divWrapperKeywordsList");
    themeElementsMain.push("divWrapperNote");
    themeElementsMain.push("divWrapperHostAlertsList");

    themeElementsMain.forEach(changeOutsideBoxItemChange, event.target.value);

    saveUIThemeSetting('outside', event.target.value);

    /*            document.querySelectorAll("p").forEach(function(p) {
                   p.style.color = event.target.value;
               }); */
}

function changeInsideBox(event) {

    var insideBoxElements = [];
    insideBoxElements.push("chatbox");
    insideBoxElements.push("followerbox");
    insideBoxElements.push("followingbox");
    insideBoxElements.push("narrowbox");
    insideBoxElements.push("recentFollowersbox");
    //insideBoxElements.push("timerpanelbox");
    //insideBoxElements.push("triggerlistbox");
    //insideBoxElements.push("notelistbox");
    insideBoxElements.push("timersListbox");



    insideBoxElements.forEach(changeInsideBoxItemChange, event.target.value);

    var insideBoxCommandsElements = [];
    insideBoxCommandsElements.push("commandsbox");
    insideBoxCommandsElements.push("alertsbox");
    insideBoxCommandsElements.push("mediabox");
    insideBoxCommandsElements.push("commandsListbox");
    insideBoxCommandsElements.push("keywordsbox");
    insideBoxCommandsElements.push("notesbox");
    insideBoxCommandsElements.push("modmonListbox");
    insideBoxCommandsElements.push("hostAlertsListbox");
    insideBoxCommandsElements.push("followAlertsListbox");

    insideBoxCommandsElements.push("wrapperTriggerPanel");
    insideBoxCommandsElements.push("wrapperNote");
    insideBoxCommandsElements.push("wrapperTimerPanel");
    // #wrapperTriggerPanel, #wrapperNote, #wrapperTimerPanel

    insideBoxCommandsElements.forEach(changeInsideBoxItemChange, event.target.value);

    saveUIThemeSetting('inside', event.target.value);

}

function saveUIThemeSetting(element, color) {

    iosocket.emit('saveUIThemeSetting', element, color);

}

function changeToggleButtons(event) {

    var toggleButtonElements = [];
    toggleButtonElements.push("cbBtn");
    toggleButtonElements.push("flActionBtn");
    toggleButtonElements.push("RecentFollowersActionBtn");
    toggleButtonElements.push("flBtn");
    toggleButtonElements.push("flingBtn");
    toggleButtonElements.push("chtUsersBtn");
    toggleButtonElements.push("recentFollowersBtn");
    toggleButtonElements.push("flngActionBtn");
    toggleButtonElements.push("ChatActionBtn");
    toggleButtonElements.push("flBtnWide");
    toggleButtonElements.push("flBtnWideAlerts");
    toggleButtonElements.push("flBtnWideTimers");

    toggleButtonElements.push("flBtnWideTriggerManager");
    toggleButtonElements.push("flBtnWideNoteManager");
    toggleButtonElements.push("submitTPButton");
    toggleButtonElements.push("submitKWButton");
    toggleButtonElements.push("submitNTButton");

    toggleButtonElements.push("flBtnWideMedia");
    toggleButtonElements.push("commandListBtn");
    toggleButtonElements.push("submitCommandButton");
    toggleButtonElements.push("deleteCommandButton");
    toggleButtonElements.push("addVar");

    toggleButtonElements.push("chatUsrBan");
    toggleButtonElements.push("chatUsrTimeout5m");

    toggleButtonElements.push("KeywordsToggleBtn");
    toggleButtonElements.push("KeywordsActionBtn");

    toggleButtonElements.push("NotesToggleBtn");
    toggleButtonElements.push("NotesActionBtn");

    toggleButtonElements.push("hostAlertsListBtn");
    toggleButtonElements.push("followAlertsListBtn");
    toggleButtonElements.push("timersListBtn");
    toggleButtonElements.push("modmonListBtn");


    toggleButtonElements.push("deleteKWButton");
    toggleButtonElements.push("deleteNTButton");
    toggleButtonElements.push("deleteAlertButton");
    toggleButtonElements.push("submitAlertButton");

    toggleButtonElements.push("deleteMediaButton");
    toggleButtonElements.push("submitMediaButton");

    toggleButtonElements.forEach(changeToggleButtonsItemChange, event.target.value);

    saveUIThemeSetting('buttoncolor', event.target.value);

}

function changeToggleButtonsText(event) {

    var toggleButtonElements = [];
    toggleButtonElements.push("cbBtn");
    toggleButtonElements.push("flActionBtn");
    toggleButtonElements.push("RecentFollowersActionBtn");
    toggleButtonElements.push("flBtn");
    toggleButtonElements.push("flingBtn");
    toggleButtonElements.push("chtUsersBtn");
    toggleButtonElements.push("recentFollowersBtn");
    toggleButtonElements.push("flngActionBtn");
    toggleButtonElements.push("ChatActionBtn");
    toggleButtonElements.push("flBtnWide");
    toggleButtonElements.push("flBtnWideAlerts");
    toggleButtonElements.push("flBtnWideMedia");
    toggleButtonElements.push("commandListBtn");

    toggleButtonElements.push("submitCommandButton");
    toggleButtonElements.push("deleteCommandButton");
    toggleButtonElements.push("addVar");



    toggleButtonElements.push("chatUsrBan");
    toggleButtonElements.push("chatUsrTimeout5m");
    toggleButtonElements.push("modmonListBtn");
    toggleButtonElements.push("timersListBtn");

    toggleButtonElements.push("hostAlertsListBtn");
    toggleButtonElements.push("followAlertsListBtn");
    toggleButtonElements.push("KeywordsToggleBtn");

    toggleButtonElements.push("NotesToggleBtn");
    toggleButtonElements.push("NotesActionBtn");




    toggleButtonElements.push("flBtnWideTriggerManager");
    toggleButtonElements.push("flBtnWideNoteManager");
    toggleButtonElements.push("flBtnWideTimers");
    toggleButtonElements.push("KeywordsActionBtn");
    toggleButtonElements.push("submitKWButton");
    toggleButtonElements.push("deleteKWButton");



    toggleButtonElements.forEach(changeToggleButtonsTextItemChange, event.target.value);

    saveUIThemeSetting('buttontextcolor', event.target.value);

}

function changeSearchBoxes(event) {

    var moduleSearchBoxElements = [];
    moduleSearchBoxElements.push("myInputF");
    moduleSearchBoxElements.push("myInputFl");
    moduleSearchBoxElements.push("myInputCO");

    moduleSearchBoxElements.forEach(changeSearchBoxItemChange, event.target.value);

    saveUIThemeSetting('searchbg', event.target.value);

}

function changeDropdowns(event) {


    //commands dropdowns
    var moduleDropdownElements = [];
    moduleDropdownElements.push("selOptPermission");
    moduleDropdownElements.push("audioSelect");
    moduleDropdownElements.push("videoSelect");
    moduleDropdownElements.push("imageSelect");


    //alert dropdowns
    moduleDropdownElements.push("selAlertTypeAltVars");
    moduleDropdownElements.push("audioAltSelect");
    moduleDropdownElements.push("imageAltSelect");
    moduleDropdownElements.push("videoAltSelect");

    //media dropdowns
    moduleDropdownElements.push("selMediaTypeMedVars");
    moduleDropdownElements.push("audioMedSelect");
    moduleDropdownElements.push("selAudioDurationMedVars");
    moduleDropdownElements.push("imageMedSelect");
    moduleDropdownElements.push("selImageDurationMedVars");
    moduleDropdownElements.push("videoMedSelect");
    moduleDropdownElements.push("selVideoDurationMedVars");


    moduleDropdownElements.forEach(changeDropdownsTextItemChange, event.target.value);
    ///

    saveUIThemeSetting('combotextcolor', event.target.value);

}

function changeDropdownsBackground(event) {


    //commands dropdowns
    var moduleDropdownElements = [];
    moduleDropdownElements.push("selOptPermission");
    moduleDropdownElements.push("audioSelect");
    moduleDropdownElements.push("videoSelect");
    moduleDropdownElements.push("imageSelect");


    //alert dropdowns
    moduleDropdownElements.push("selAlertTypeAltVars");
    moduleDropdownElements.push("audioAltSelect");
    moduleDropdownElements.push("imageAltSelect");
    moduleDropdownElements.push("videoAltSelect");

    //media dropdowns
    moduleDropdownElements.push("selMediaTypeMedVars");
    moduleDropdownElements.push("audioMedSelect");
    moduleDropdownElements.push("selAudioDurationMedVars");
    moduleDropdownElements.push("imageMedSelect");
    moduleDropdownElements.push("selImageDurationMedVars");
    moduleDropdownElements.push("videoMedSelect");
    moduleDropdownElements.push("selVideoDurationMedVars");


    moduleDropdownElements.forEach(changeDropdownsBackgroundItemChange, event.target.value);
    ///

    saveUIThemeSetting('combocolour', event.target.value);

}

function changeThemeTextItemChange(value, index, array) {
    document.getElementById(value).style.color = this;

    var el = document.getElementById(value);
    el.style.color = this;


}

function changeThemeTextItemChangeFormatting(value, index, array) {
    var el = document.getElementById(value);

    el.style.color = this;
    el.style.fontWeight = "bold";
    /*         el.style.float = "left";
            el.style.paddingLeft = "40%"; */

}

function changeBotBackgroundItemChange(value, index, array) {

    document.body.style.backgroundColor = value;

}


function changeOutsideBoxItemChange(value, index, array) {
    document.getElementById(value).style.background = this;
}

function changeInsideBoxItemChange(value, index, array) {
    document.getElementById(value).style.background = this;
}

function changeToggleButtonsItemChange(value, index, array) {
    var el = document.getElementById(value);
    var elTextValue = document.getElementById('TogglesTextColorPicker').value;
    el.style.background = this;
    el.style.color = elTextValue;
}

function changeToggleButtonsTextItemChange(value, index, array) {
    var el = document.getElementById(value);
    var elBackgroundValue = document.getElementById('TogglesColorPicker').value;
    el.style.background = elBackgroundValue;
    el.style.color = this;
}

function changeSearchBoxItemChange(value, index, array) {
    document.getElementById(value).style.background = this;
}

function changeDropdownsTextItemChange(value, index, array) {

    var el = document.getElementById(value);
    el.style.color = this;
    el.style.backgroundImage = "url('../css/comboboxarrow.png')";
}

function changeDropdownsBackgroundItemChange(value, index, array) {
    var el = document.getElementById(value);
    el.style.backgroundColor = this;
}

function changeDivTextItemChange(value, index, array) {
    /*    var cols = document.getElementsByClassName(value);
       for (i = 0; i < cols.length; i++) {
           cols[i].style.backgroundColor = this;
       } */
    var colour = this;
    var inner = document.querySelectorAll("div." + value);

    inner.forEach(function(item) {
        item.style.color = colour;
    });
}

function TimeOutMixerUser() {

    var userToTimeout = document.getElementById('ChatActionBtn');

    if (userToTimeout != "-") {

        var timeoutUser = userToTimeout.innerHTML.split(" - ");

        var timeout = confirm('Are you sure you want to timeout ' + timeoutUser[0]);
        if (timeout) {
            alert('Timeout Submitted');
            var personData = {
                username: timeoutUser[0],
                duration: "5m"
            };

            iosocket.emit('TimeoutMixerUser', personData);

        } else {
            alert('Timeout Cancelled');
        }
    }
}

function BanMixerUser() {

    var userToBan = document.getElementById('ChatActionBtn');

    if (userToBan != "-") {

        var banUser = userToBan.innerHTML.split(" - ");

        var timeout = confirm('Are you sure you want to ban ' + banUser[0] + banUser[1]);
        if (timeout) {
            alert('Ban Submitted');
            var personData = {
                userid: banUser[1]
            };

            iosocket.emit('BanMixerUser', personData);

        } else {
            alert('Timeout Cancelled');
        }
    }
}

function emptyTables() {

    removeData();

}

function removeData() {
    $("#tableChatUsers").find("tr:not(:first)").remove();
    $("#tableF").find("tr:not(:first)").remove();
    $("#tableCF").find("tr:not(:first)").remove();
}



function setUIToRefreshingData() {
    refreshingMixerData();
    //set UI to Refresh in progress here
}

function refreshingMixerData() {
    //todo add connection icon
    document.getElementById("beamConnection").innerHTML = '';
    document.getElementById("beamConnection").innerHTML += "Mixer: Refreshing Data...";
}

function pingBeam() {

    emptyTables();
    setUIToRefreshingData();

}

function addCommandsToListModule(data) {

    console.log('add commands to UI: ' + JSON.stringify(data));
    data.data.commands.forEach(function(element) {

        addSingleCommandToCommandListModule(element);

    }, this);
}

function addSingleCommandToCommandListModule(data) {

    /*                  <th>Enabled</th>
                                <th>Command Name</th>
                                <th>Text</th>
                                <th>Perms</th>
                                <th>User</th>
                                <th>Audio</th>
                                <th>Video</th>
                                <th>Image</th> 
                                
                                    "id": "!test",
        "permission": "SPECIFIC",
        "user": "Schuster",
        "audio": "sound1.mp3",
        "video": "",
        "image": "alert2.gif",
        "text": "$user has been streaming for $uptime",
        "cooldown": "5M",
        "enabled": "Y"
                                
                                */



    var commandEnabled = data.enabled;
    var commandName = data.id;
    var commantText = data.text;
    var commandPerms = data.permission;
    var commandUser = data.user;
    var commandAudio = data.audio;
    var commandVideo = data.video;
    var commandImage = data.image;


    var hidden = "display:none;";
    var tr;
    tr = $('<tr id="CO' + commandName.replace("!", "x") + '" class /> ');
    tr.append("<td>" + commandEnabled + "</td>");
    tr.append("<td>" + commandName + "</td>");
    tr.append("<td>" + commantText + "</td>");
    tr.append("<td>" + commandPerms + "</td>");
    tr.append("<td>" + commandUser + "</td>");
    tr.append("<td>" + commandAudio + "</td>");
    tr.append("<td>" + commandVideo + "</td>");
    tr.append("<td>" + commandImage + "</td>");
    //hidden sample
    //tr.append("<td style=\"" + hidden + "\">" + res[2] + "</td>");
    //add row to command list
    $('#tableCO').append(tr);

    /* //adjust command list count
            var chatCountStrNew = chatUsrs.length.toString();
            $("#tableCL").empty();
            $('#tableCL').append($('<p></p>').text(chatCountStrNew)); */
}

function SetSelectElement(id, valueToSelect) {
    var element = document.getElementById(id);
    element.value = valueToSelect;
}

function SetCheckboxElement(id, valueToSelect) {
    var element = document.getElementById(id);
    var check = false;
    if (valueToSelect != undefined) {
        if (valueToSelect == "Y") {
            check = true;
        }
    }
    element.checked = check;
}


function scrollToEnd(elementName) {
    var objDiv = document.getElementById(elementName);
    objDiv.scrollTop = objDiv.scrollHeight;
}

function setDeviceWidthLayout() {
    console.log('device width = ' + devicewidth.toString());
    document.getElementById("container").style.width = Math.round((devicewidth / 100 * 85)) + 'px';
    document.getElementsByTagName("BODY")[0].style.width = Math.round((devicewidth / 100 * 85)) + 'px';
    document.getElementById("chkBoxList").style.marginLeft = Math.round((devicewidth / 100 * 85)) + 20 + 'px';


}

function buildChatMessage(avatarURL, primaryRole, UserName, message) {

    var li;
    var colour = "black";

    switch (primaryRole) {
        case "Owner":
            colour = "yellow"
            break;
        case "Mod":
            colour = "green"
            break;
        case "Subscriber":
            colour = "orange"
            break;
        case "Viewer":
            colour = "blue"
            break;
        case "Pro":
            colour = "purple"
            break;
        case "User":
            colour = "blue"
            break;
        default:
            // code block
    }

    var styleColour = 'color:' + colour + ';';
    var avatarURL = avatarURL;

    /*  li = $('<li style="' + styleColour + ' list-style-type: none;" class /> ');
      li.append('<img height="50" width="50" src="' + avatarURL + '" alt="avatar" id="itemImg" style="float:left;  border-radius: 50%;">');
      li.append('<div style="float: left; padding-left:5px; display: table-cell; vertical-align: middle;"><p style="' + styleColour + ' display: table-cell; vertical-align: middle;">' + message + '</p></div>');
      li.append('<div style="float: none; clear: both;"></div>'); */


    li = $('<li/> ');
    li.append('<img class="mixerChat" height="25" width="25" src="' + avatarURL + '" alt="avatar" id="itemImg" style="border-radius: 50%;">');
    li.append('<div><p style="' + styleColour + '">' + UserName + ' - ' + primaryRole + '</p><p style="color:black;">' + message + '</p></div>');
    li.append('<div style="float: none; clear: both;"></div>');
    $('#incomingChatMessages').append(li);

    $('#incomingChatMessages').append(li);
}


minimiseCurrencyListBox = function(dataElement, parentElement) {
    minimiseBoxFunction(dataElement, parentElement);
}

//move to slider js
function slideCurrency1090() {

    if (document.getElementById("wrapperCommandsInner").style.display === "none") {
        document.getElementById("divWrapperCurrencyList").style.width = "1090px";
        document.getElementById("wrapperCommandsInner").style.display = "block";
        mydragg3.slideLeft('divWrapperCurrencyList', 'container', event);

    } else {
        mydragg3.slideRight('divWrapperCurrencyList', 'container', '400', event);
        document.getElementById("divWrapperCurrencyList").style.width = "400px";
        document.getElementById("wrapperCommandsInner").style.display = "none";


    }
}

//just in here as I don't want to copy more files in prototype
var mydragg3 = function() {
    return {
        move: function(divid2, xpos, ypos) {

            divid2.style.left = xpos + 'px';
            divid2.style.top = ypos + 'px';

        },
        slideLeft: function(divid, container, evt) {

            console.log(divid);

            var divid2 = document.getElementById(divid);


            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY,
                divTop = divid2.style.top,
                divLeft = divid2.style.left,
                eWi = parseInt(divid2.style.width),
                eHe = parseInt(divid2.style.height),
                cWi = parseInt(document.getElementById(container).style.width),
                cHe = parseInt(document.getElementById(container).style.height);
            document.getElementById(container).style.cursor = 'move';
            divTop = divTop.replace('px', '');
            divLeft = divLeft.replace('px', '');
            var diffX = posX - divLeft,
                diffY = posY - divTop;
            // document.onmousemove = function(evt) {
            //    evt = evt || window.event;
            //    var posX = evt.clientX,
            //        posY = evt.clientY,
            aX = posX - diffX,
                aY = posY - diffY;

            if (aX < 0) aX = 0;
            if (aY < 0) aY = 0;
            if (aX + eWi > cWi) aX = cWi - eWi;
            if (aY + eHe > cHe) aY = cHe - eHe;

            mydragg3.move(divid2, aX, aY);
            //}
        },
        slideRight: function(divid, container, slideAmount, evt) {

            console.log(divid);

            var divid2 = document.getElementById(divid);

            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY,
                divTop = divid2.style.top,
                divLeft = divid2.style.left,
                eWi = parseInt(divid2.style.width),
                eHe = parseInt(divid2.style.height),
                cWi = parseInt(document.getElementById(container).style.width),
                cHe = parseInt(document.getElementById(container).style.height);
            document.getElementById(container).style.cursor = 'move';
            divTop = divTop.replace('px', '');
            divLeft = divLeft.replace('px', '');
            var diffX = posX - divLeft,
                diffY = posY - divTop;

            aX = posX - diffX,
                aY = posY - diffY;

            if (aX < 0) aX = 0;
            if (aY < 0) aY = 0;
            if (aX + eWi > cWi) aX = cWi - eWi;
            if (aY + eHe > cHe) aY = cHe - eHe;

            mydragg3.move(divid2, aX, aY);
            //}
        },
    }
}();

var mydragg2 = function() {
    return {
        move: function(divid2, xpos, ypos) {

            divid2.style.left = xpos + 'px';
            divid2.style.top = ypos + 'px';
        },
        startMoving: function(divid, container, evt) {

            console.log(divid);

            var divid2 = document.getElementById(divid);


            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY,
                divTop = divid2.style.top,
                divLeft = divid2.style.left,
                eWi = parseInt(divid2.style.width),
                eHe = parseInt(divid2.style.height),
                cWi = parseInt(document.getElementById(container).style.width),
                cHe = parseInt(document.getElementById(container).style.height);
            document.getElementById(container).style.cursor = 'move';
            divTop = divTop.replace('px', '');
            divLeft = divLeft.replace('px', '');
            var diffX = posX - divLeft,
                diffY = posY - divTop;
            document.onmousemove = function(evt) {
                evt = evt || window.event;
                var posX = evt.clientX,
                    posY = evt.clientY,
                    aX = posX - diffX,
                    aY = posY - diffY;
                if (aX < 0) aX = 0;
                if (aY < 0) aY = 0;
                if (aX + eWi > cWi) aX = cWi - eWi;
                if (aY + eHe > cHe) aY = cHe - eHe;
                mydragg2.move(divid2, aX, aY);
            }
        },
        stopMoving: function(container) {
            var a = document.createElement('script');
            document.getElementById(container).style.cursor = 'default';
            document.onmousemove = function() {}
        },
    }
}();