var LocalStrategy = require('passport-local').Strategy;
var BeamStrategy = require('passport-beam').Strategy;
var MixerStrategy = require('passport-mixer').Strategy;

let util = require('util');
let events = require('events');


//var User = require('../app/models/user');
var configAuth = require('./auth');

//const beamchat = require('../app/js/beamchat.js');
const colors = require('colors');



module.exports = function(passport) {

    let self = this;

    passport.serializeUser(function(user, done) {
        // console.log("serialise User ID is " + user.id);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        //  console.log("deserialise ID is " + id);
        done(null, id);

        //User.findById(id, function (err, user) {
        //    done(err, user);
        //});


    });


    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            process.nextTick(function() {
                User.findOne({ 'local.username': email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email already taken'));
                    } else {
                        var newUser = new User();
                        newUser.local.username = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        })
                    }
                })

            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            process.nextTick(function() {
                User.findOne({ 'local.username': email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'No User found'));
                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('loginMessage', 'invalid password'));
                    }
                    return done(null, user);

                });
            });
        }
    ));


    //   
    passport.use('streamer', new MixerStrategy({
            clientID: configAuth.beamAuth.clientID,
            //clientSecret: configAuth.beamAuth.clientSecret,
            callbackURL: "http://localhost:8081/auth/mixer/callback"
        },
        function(accessToken, refreshToken, profile, done) {

            // console.log("Profile User ID: " + profile.id);
            // console.log("Profile Details" + JSON.stringify(profile));
            // console.log("Profile Username is " + profile.username);

            // console.log("accessToken is " + accessToken);
            passport.BBBToken = accessToken;
            passport.userID = profile.id;
            passport.streamerChannelID = profile._raw.channel.id;
            passport.username = profile.username;
            passport.numFollowers = profile._raw.channel.numFollowers;

            //console.log("numFollowers is " + passport.numFollowers);
            //emitEvent = new events.EventEmitter;
            //emitEvent.emit('authorised', accessToken);

            return done(null, profile);

        }));


    passport.use('bot', new MixerStrategy({
            clientID: configAuth.beamAuth.clientID,
            //clientSecret: configAuth.beamAuth.clientSecret,
            callbackURL: "http://localhost:8081/auth/mixer/callback2"
        },
        function(accessToken, refreshToken, profile, done) {

            // console.log("Profile User ID: " + profile.id);
            // console.log("Profile Details" + JSON.stringify(profile));
            // console.log("Profile Username is " + profile.username);

            // console.log("accessToken is " + accessToken);
            passport.BBBTokenBot = accessToken;
            passport.userIDBot = profile.id;
            passport.usernameBot = profile.username;
            passport.numFollowersBot = profile._raw.channel.numFollowers;

            //console.log("numFollowers for bot is " + passport.numFollowersBot);
            //emitEvent = new events.EventEmitter;
            //emitEvent.emit('authorised', accessToken);

            return done(null, profile);


        }));
};