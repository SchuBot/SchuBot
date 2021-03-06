//var User = require('./models/user');
var engine = require('consolidate');
const resourceTokenManager = require('../js/tokenManager');
var querystring = require('querystring');
var https = require("https");
const electron = require('electron');

const request = require("request");

module.exports = function(app) {



    //webhooks stuff

 // Homepage route


var id = '147299544'
// Send Twitch webhooks subscription
const token = 'lx71o93103qho7pc2onpz2ktprnsrp';

// Twitch client id
var clientID = 'gp762nuuoqcoxypju8c569th9wz7q5'
// Content type of data to send
var contentType = 'application/json'



// app.get("/webhooks", (req, res) => {

// console.log('test');

// request({
//     uri: "https://api.twitch.tv/helix/webhooks/hub",
//     method: "POST",
//     headers: {
//         // Twitch client id
//         'Client-ID': clientID,
//         // Content type of data to send
//         'Content-Type': contentType,
//         'Authorization': `Bearer ${token}`
//     },
//     json: {
//         "hub.callback": "http://localhost:8081/twitch/live",
//         "hub.lease_seconds": "864000",
//         "hub.mode": "subscribe",
//         "hub.topic": `https://api.twitch.tv/helix/users/follows?first=1&to_id=${id}`
//     }
// }, function (err,res, body) {
//     if (!err && res.statusCode === 202) {
//         //res.send(`Successfully registered to  ${id} for 10 days.`)
//         res.status(200).end()
//     } else {
//         console.error(err)
//         console.error(res.statusCode)
//         console.error(body)
//         //res.send("Subscription error.")
//         //res.status(400).end()
//         //endWithCode(res,400);
//     }
// })
// });

function endWithCode(res, code, payload) {
    res.statusCode = code;
    res._events.end(payload)
  }





// Callbacks handlers

// Streams Up/Down
app.get('/webhooks', function (req, res) {
    res.send(req.query['hub.challenge'])
    console.log(req.query)
    console.log(req.headers)
    //console.log(res)
    /*var incoming = req.headers['x-hub-signature'].split('=');
    var hash = crypto.createHmac(incoming[0], secret)
        .update(JSON.stringify(req.body))
        .digest('hex')
    if (incoming[1] != hash) {
        console.log('Reject')
    } else {
        console.log('Payload OK')// do other stuff
    }*/
})


app.post("/webhooks", (req, res) => {
	const body = JSON.parse(res.body).data
	console.log(body)
	if (Object.keys(body).length > 0) {
		console.log("Stream Received")
	}
	console.log(req.query)
	res.send(req.query.hub_challenge)
	res.status(200).end()
})




    app.get('/', function(req, res) {
        console.log('index.ejs');
        res.render('pages/index.ejs');
    });

    app.get('/dash', function(req, res) {
        res.render('pages/dash.ejs'); // load the dash.ejs file
    });

    app.get('/consume', function(req, res) {
        console.log('rendering bot');
        res.render('pages/bot.ejs'); // load the dash.ejs file
    });

    app.get('/bot', function(req, res) {
        console.log('rendering bot');
        res.render('pages/bot.ejs'); // load the dash.ejs file
    });

    /*  app.get('/botlogin', function(req, res) {
         console.log('rendering bot login (actually streamer login');
         res.render('pages/botlogin.ejs'); // load the dash.ejs file
     }); */

    app.get('/botlogin', function(req, res) {

        res.render('pages/streamerlogin.ejs'); // load the dash.ejs file
    });


    app.get('/streamerlogin', function(req, res) {
        // electron = require('electron');

        // electron.ipcMain.emit('loadbot', 'test');

        //  app.engine('html', engine.mustache);
        //  app.set('view engine', 'html');
        //  app.set('views', pathdir + '/views');
        console.log('rendering streamer login (actually streamer login');
        res.render('pages/streamerlogin.html'); // load the dash.ejs file
    });

    app.get('/overlay', function(req, res) {


        res.render('pages/overlay.ejs'); // load the dash.ejs file
    });


    /*	app.get('/bIndex.html', function (req, res) {
    	    res.sendFile(__dirname + '/wwwClient/bIndex.html');
    	});*/

    app.get('/bIndex', function(req, res) {
        console.log('fetching bIndex.ejs');
        res.render('pages/bIndex');
    });

    /*
    		app.get('/bIndex', function (req, res) {
    	      res.render('bIndex.ejs', { message: req.flash('loginMessage') });
    	});*/

    app.get('/dragobject.html', function(req, res) {
        res.sendFile(__dirname + '/wwwClient/dragobject.html');
    });
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });


    app.get('/webhooks', function(req, res) {

           res.render('login.ejs', { message: req.flash('loginMessage') });
    });




    /*     app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        }));

        app.get('/signup', function(req, res) {
            res.render('pages/signup.ejs', { message: req.flash('signupMessage') });
        });


        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/bot',
            failureRedirect: '/signup',
            failureFlash: true
        })); */


    /*     // this has beam so might need changing when redirect no longer works
        app.get('/auth/mixer',
            passport.authenticate('streamer', {
                scope: [
                    'user:details:self', 'interactive:robot:self', 'chat:connect', 'chat:edit_options',
                    'chat:chat', 'chat:whisper', 'chat:bypass_links', 'chat:bypass_slowchat',
                    'chat:change_role', 'channel:follow:self',
                    'chat:bypass_catbot', 'chat:bypass_filter', 'chat:clear_messages',
                    'chat:giveaway_start', 'chat:poll_start', 'chat:remove_message',
                    'chat:timeout', 'chat:view_deleted', 'chat:purge', 'channel:details:self',
                    'channel:update:self', 'channel:clip:create:self'
                ]
            }));


        app.get('/auth/mixer2',
            passport.authenticate('bot', {
                scope: [
                    'chat:connect', 'chat:edit_options',
                    'chat:chat', 'chat:whisper', 'chat:bypass_links', 'chat:bypass_slowchat',
                    'chat:change_role',
                    'chat:bypass_catbot', 'chat:bypass_filter', 'chat:clear_messages',
                    'chat:giveaway_start', 'chat:poll_start', 'chat:remove_message',
                    'chat:timeout', 'chat:view_deleted', 'chat:purge'
                ]
            })

        ); */


    /*     app.get('/auth2/mixer',
            passport.authenticate('streamer', 'mixer', {
                scope: [
                    'user:details:self', 'interactive:robot:self', 'chat:connect', 'chat:edit_options',
                    'chat:chat', 'chat:whisper', 'chat:bypass_links', 'chat:bypass_slowchat',
                    'chat:change_role', 'channel:follow:self',
                    'chat:bypass_catbot', 'chat:bypass_filter', 'chat:clear_messages',
                    'chat:giveaway_start', 'chat:poll_start', 'chat:remove_message',
                    'chat:timeout', 'chat:view_deleted', 'chat:purge', 'channel:details:self',
                    'channel:update:self', 'channel:clip:create:self'
                ]
            })); */

    //app.get('/auth/beam/callback', 
    //  passport.authenticate('beam', { successRedirect: '/profile',
    //  failureRedirect: '/'
    //  }));


    //streamer twitch auth route
    app.get('/auth/twitch/callback', function(req, res) {


        electron.ipcMain.emit('savetwitchauth', null);

        /*         if (req.url != undefined) {


                    //streamer login
                    var options = {
                        client_id: 't7kyrxjq326tij087ax7o8a6y686d8',
                        response_type: 'code',
                        grant_type: 'authorization_code',
                        scopes: ["user_read"], // Scopes limit access for OAuth tokens.
                        redirectUri: "http://localhost:8081/auth/twitch/callback"

                    };

                    var access_token = /access_token=([^&]*)/.exec(req.url)

                    var raw_code = /code=([^&]*)/.exec(req.url) || null,
                        code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
                        error = /\?error=(.+)$/.exec(req.url);

                    // If there is a code in the callback, proceed to get token from twitch
                    if (code) {
                        console.log("code recieved: " + code);

                        var postData = querystring.stringify({
                            "grant_type": options.grant_type,
                            "redirect_uri": options.redirectUri,
                            "client_id": options.client_id,
                            "code": code
                        });


                        ///id.twitch.tv/oauth2/tokenv
                        var post = {
                            host: "id.twitch.tv",
                            path: "/oauth2/token",
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Content-Length': postData.length,
                                "Accept": "application/json"
                            }
                        };

                        var req = https.request(post, function(response) {
                            var result = '';
                            response.on('data', function(data) {
                                result = result + data;
                            });
                            response.on('end', function() {
                                var json = JSON.parse(result.toString());
                                console.log("access token recieved: " + json.access_token);

                                //now set expiry date
                                //set token expiry in milliseconds 
                                // (remove 10 seconds just because)
                                var expiryInSeconds = json.expires_in - 10;
                                var expiryInMilliSeconds = expiryInSeconds * 1000;

                                //get milliseconds from 1970 till now and add milliseconds
                                var milliseconds = Date.now() + expiryInMilliSeconds;

                                //
                                var accessTokenExpiry = new Date(milliseconds);

                                var type = "streamer";
                                json["access_token_expiry_date"] = accessTokenExpiry;

                                



                                //userInfo("streamer", json.access_token, json.refresh_token, null, authDB)

                                //   mainWindow.loadURL('file://' + __dirname + '/views/pages/bot.ejs');



                                if (response && response.ok) {
                                    // Success - Received Token.
                                    // Store it in localStorage maybe?
                                    console.log(response.body.access_token);
                                }
                            });
                            response.on('error', function(err) {
                                console.log("MIXER OAUTH REQUEST ERROR: " + err.message);
                            });
                        });

                        req.write(postData);
                        req.end();

                    } else
                    if (error) {
                        alert("Oops! Something went wrong and we couldn't log you in using Mixer. Please try again.");
                    }
                } */

        // Successful authentication, redirect home.
        // res.redirect('/streamerlogin');


        //electron.ipcMain.emit('closeauthwindow', null);


        //   res.redirect('/dragobject.html');
    });



    app.get('/auth/mixer2', function(req, res) {

        if (req.url != undefined) {



            var options = {
                client_id: '5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d',
                response_type: 'code',
                grant_type: 'authorization_code',
                scopes: ["user:details:self interactive:robot:self chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat chat:bypass_catbot chat:bypass_filter chat:clear_messages chat:giveaway_start chat:poll_start chat:remove_message chat:timeout chat:view_deleted chat:purge channel:details:self channel:update:self channel:clip:create:self"], // Scopes limit access for OAuth tokens.
                redirectUri: "http://localhost:8081/auth/mixer2"

            };

            var raw_code = /code=([^&]*)/.exec(req.url) || null,
                code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
                error = /\?error=(.+)$/.exec(req.url);

            // If there is a code in the callback, proceed to get token from mixer
            if (code) {
                console.log("code recieved: " + code);

                var postData = querystring.stringify({
                    "grant_type": options.grant_type,
                    "redirect_uri": options.redirectUri,
                    "client_id": options.client_id,
                    "code": code
                });

                var post = {
                    host: "mixer.com",
                    path: "/api/v1/oauth/token",
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': postData.length,
                        "Accept": "application/json"
                    }
                };

                var req = https.request(post, function(response) {
                    var result = '';
                    response.on('data', function(data) {
                        result = result + data;
                    });
                    response.on('end', function() {
                        var json = JSON.parse(result.toString());
                        console.log("access token recieved: " + json.access_token);

                        //now set expiry date
                        //set token expiry in milliseconds 
                        // (remove 10 seconds just because)
                        var expiryInSeconds = json.expires_in - 10;
                        var expiryInMilliSeconds = expiryInSeconds * 1000;

                        //get milliseconds from 1970 till now and add milliseconds
                        var milliseconds = Date.now() + expiryInMilliSeconds;

                        //
                        var accessTokenExpiry = new Date(milliseconds);

                        var type = "streamer";
                        json["access_token_expiry_date"] = accessTokenExpiry;

                        electron.ipcMain.emit('saveauth', json);



                        //userInfo("streamer", json.access_token, json.refresh_token, null, authDB)

                        //   mainWindow.loadURL('file://' + __dirname + '/views/pages/bot.ejs');



                        if (response && response.ok) {
                            // Success - Received Token.
                            // Store it in localStorage maybe?
                            console.log(response.body.access_token);
                        }
                    });
                    response.on('error', function(err) {
                        console.log("MIXER OAUTH REQUEST ERROR: " + err.message);
                    });
                });

                req.write(postData);
                req.end();

            } else
            if (error) {
                alert("Oops! Something went wrong and we couldn't log you in using Mixer. Please try again.");
            }
        }

        // Successful authentication, redirect home.
        // res.redirect('/streamerlogin');
        electron.ipcMain.emit('closeauthwindow', null);


        //   res.redirect('/dragobject.html');
    });


    //bot auth route
    app.get('/auth/mixer', function(req, res) {

        if (req.url != undefined) {



            var options = {
                client_id: '5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d',
                response_type: 'code',
                grant_type: 'authorization_code',
                scopes: ["user:details:self interactive:robot:self chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat chat:bypass_catbot chat:bypass_filter chat:clear_messages chat:giveaway_start chat:poll_start chat:remove_message chat:timeout chat:view_deleted chat:purge channel:details:self channel:update:self channel:clip:create:self"], // Scopes limit access for OAuth tokens.
                redirectUri: "http://localhost:8081/auth/mixer"

            };

            var raw_code = /code=([^&]*)/.exec(req.url) || null,
                code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
                error = /\?error=(.+)$/.exec(req.url);

            // If there is a code in the callback, proceed to get token from mixer
            if (code) {
                console.log("code recieved: " + code);

                var postData = querystring.stringify({
                    "grant_type": options.grant_type,
                    "redirect_uri": options.redirectUri,
                    "client_id": options.client_id,
                    "code": code
                });

                var post = {
                    host: "mixer.com",
                    path: "/api/v1/oauth/token",
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': postData.length,
                        "Accept": "application/json"
                    }
                };

                var req = https.request(post, function(response) {
                    var result = '';
                    response.on('data', function(data) {
                        result = result + data;
                    });
                    response.on('end', function() {
                        var json = JSON.parse(result.toString());
                        console.log("access token recieved: " + json.access_token);

                        //now set expiry date
                        //set token expiry in milliseconds 
                        // (remove 10 seconds just because)
                        var expiryInSeconds = json.expires_in - 10;
                        var expiryInMilliSeconds = expiryInSeconds * 1000;

                        //get milliseconds from 1970 till now and add milliseconds
                        var milliseconds = Date.now() + expiryInMilliSeconds;

                        //
                        var accessTokenExpiry = new Date(milliseconds);

                        var type = "streamer";
                        json["access_token_expiry_date"] = accessTokenExpiry;

                        electron.ipcMain.emit('saveauthbot', json);


                        if (response && response.ok) {
                            // Success - Received Token.
                            // Store it in localStorage maybe?
                            console.log(response.body.access_token);
                        }
                    });
                    response.on('error', function(err) {
                        console.log("MIXER OAUTH REQUEST ERROR: " + err.message);
                    });
                });

                req.write(postData);
                req.end();
            } else
            if (error) {
                alert("Oops! Something went wrong and we couldn't log you in using Mixer. Please try again.");
            }
        }


        electron.ipcMain.emit('closeauthwindow', null);
        // Successful authentication, redirect home.
        // res.redirect('/streamerlogin');



        //   res.redirect('/dragobject.html');

    });



    // set up resource endpoint
    app.get('/resource/:token', function(req, res) {

        let token = req.params.token || null;
        if (token !== null) {
            let resourcePath = resourceTokenManager.getResourcePath(token) || null;
            if (resourcePath !== null) {
                resourcePath = resourcePath.replace(/\\/g, "/");
                res.sendFile(resourcePath);
                return;
            }
        }

        res.status(404).send({ status: "error", message: req.originalUrl + ' not found' });
    });


    app.get('/auth/mixer/callback2',
        function(req, res) {
            console.log('redirecting to page2');
            // Successful authentication, redirect home.
            res.redirect('/streamerlogin');
            //   res.redirect('/dragobject.html');
        }
    );

    app.get('/auth/mixer',
        function(req, res) {
            console.log('redirecting to page2');
            // Successful authentication, redirect home.
            res.redirect('/streamerlogin');
            //   res.redirect('/dragobject.html');
        }
    );



    app.get('/auth/mixer/callback',
        function(req, res) {
            console.log('redirecting to page2');
            // Successful authentication, redirect home.
            res.redirect('/streamerlogin');
            //   res.redirect('/dragobject.html');
        }
    );

    /*     app.get('/auth/mixer/callback',
            passport.authenticate('bot', 'mixer', {
                failureRedirect: '/'
            }),
            function(req, res) {

                console.log('redirecting to page2');
                // Successful authentication, redirect home.
                res.redirect('/bot');
                //   res.redirect('/dragobject.html');
            }
        ); */

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/login');
    }







}