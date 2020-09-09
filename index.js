'use strict';
/* const electron = require('electron');
const { ipcRenderer } = electron;
const { remote } = electron;
const { app, BrowserWindow } = electron;
 */



const electron = require('electron');
// const electronOauth2 = require('electron-oauth2');
// const loginAuth = require('oauth-electron');
const ejse = require('ejs-electron');
const app = electron.app;
var BrowserWindow = require('electron').BrowserWindow; // jshint ignore:line








//const { ipcRenderer } = electron;
const { ipcMain } = electron;
//const { remote } = electron;
const { remote } = electron;
const path = require('path');


const { autoUpdater } = require('electron-updater');
const GhReleases = require('electron-gh-releases');
const log = require('electron-log');
// configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.transports.file.level = 'info';
log.transports.file.format = '{h}:{i}:{s}:{ms} {text}'
log.transports.file.maxSize = 5 * 1024 * 1024

log.info('App starting...');


// Handle Squirrel events for windows machines
if (process.platform === 'win32') {
    let cp;
    let updateDotExe;
    let target;
    let child;
    switch (process.argv[1]) {
        case '--squirrel-updated':
            // cleanup from last instance

            // use case-fallthrough to do normal installation
            break;
        case '--squirrel-install': //eslint-disable-line no-fallthrough
            // Optional - do things such as:
            // - Install desktop and start menu shortcuts
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and explorer context menus
            log.info('App Installing...');
            // Install shortcuts
            cp = require('child_process');
            updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
            target = path.basename(process.execPath);
            child = cp.spawn(updateDotExe, ["--createShortcut", target], { detached: true });
            child.on('close', app.quit);
            return;

        case '--squirrel-uninstall':
            {
                // Undo anything you did in the --squirrel-install and --squirrel-updated handlers

                //attempt to delete the user-settings folder
                /*         let rimraf = require('rimraf');
                        rimraf.sync(dataAccess.getPathInUserData("/user-settings")); */
                log.info('App Installing...');

                // Remove shortcuts
                cp = require('child_process');
                updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
                target = path.basename(process.execPath);
                child = cp.spawn(updateDotExe, ["--removeShortcut", target], { detached: true });
                child.on('close', app.quit);
                return true;
            }
        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated
            app.quit();
            return;
    }
}




/*
I think I'm using access-token. how do I get the bearer token?

https://dev.mixer.com/rest/index.html#oauth_token_post
for Authorization for endpoints, it says 
HEADERS
    Authorization: string
        Used to send a valid OAuth 2 access token. Prefixed by "Bearer". Do not use with the "access_token" query string parameter.
        Alternatively can be used to send an xbl authorization header.
you auth your app, it gives you a code, then you use that to get your token

it's an auth type
when you auth your app it should redirect with a ?code={code} then you hit /oauth/token with a body of
{
    grant_type: 'authorization_code',
    client_id: '',
    code: '<your returned code>'
    redirect_uri: '<same redirect as your oauth redirect URI>'
}

if that is successful, you should get the following in the payload from that
{
    access_token: <string>
    token_type: <string>
    expires_in: <uint>
    refresh_token: <string>
}
anyways, good luck, I hope you figure it out from that :smile: I'm going to sleep now
*/

var Tray = require('electron').Tray; // jshint ignore:line
var Menu = require('electron').Menu; // jshint ignore:line
var fs = require('fs');
var server = require('./ServerSide/app');


let streamerScopes = "user:details:self interactive:robot:self chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat chat:bypass_catbot chat:bypass_filter chat:clear_messages chat:giveaway_start chat:poll_start chat:remove_message chat:timeout chat:view_deleted chat:purge channel:details:self channel:update:self channel:clip:create:self";

let botScopes = "chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat";

let botAuthInfo = {
    clientId: '5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d',
    authorizationUrl: "https://mixer.com/oauth/authorize",
    tokenUrl: "https://mixer.com/api/v1/oauth/token",
    useBasicAuthorizationHeader: false,
    redirectUri: "http://localhost:8081/auth/mixer2"
};


let streamerAuthInfo = {
    clientId: '5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d',
    authorizationUrl: "https://mixer.com/oauth/authorize",
    tokenUrl: "https://mixer.com/api/v1/oauth/token",
    useBasicAuthorizationHeader: false,
    redirectUri: "http://localhost:8081/auth/mixer2"
};



let authWindowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: { sandbox: true }

};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let loginWindow;
let authWindow;




// Run Updater
ipcMain.on('autoUpdate', () => {

    //back up first
    /*     if (settings.backupBeforeUpdates()) {
            backupManager.startBackup();
        } */

    // Download Update
    let options = {
        repo: 'SchuBot/SchuBot',
        currentVersion: app.getVersion()
    };

    let updater = new GhReleases(options);

    updater.check((err, status) => {
        if (!err && status) {
            log.info('Downloading Update...');
            // Download the update
            updater.download()
        }

        if (err) {
            log.error(err.message);
        }
    });

    // When an update has been downloaded
    updater.on('update-downloaded', (info) => {
        log.info('Installing App...');
        // Restart the app and install the update
        updater.install()
    });

    // Access electrons autoUpdater
    updater.autoUpdater
        // When an update has been downloaded


});


ipcMain.on('loadbot', (event, arg) => {
    //console.log(arg) // prints "ping"
    loadbot();
})


ipcMain.on('saveauthbot', (event, arg) => {
    server.ConnectOnLogin(false, event);
})


ipcMain.on('saveauth', (event, arg) => {
    server.ConnectOnLogin(true, event);
})


//ipcMain.on will receive the “btnclick” info from renderprocess 
/* ipcMain.on("btnclick", function(event, arg) {

}); */

ipcMain.addListener("fulfilled", function(event, arg) {
    log.info("fulfilled listener event" + event);
});


ipcMain.on("fulfilled", function(event, arg) {
    log.info("fulfilled event" + event);
});

/* ipcMain.on("btnclickstreamer", function(event, arg) {

    //login4();

}); */



ipcMain.on('twitch-login', (event, arg) => {

    let type = arg;


    /*GET https://id.twitch.tv/oauth2/authorize
    ?client_id=<your client ID>
    &redirect_uri=<your registered redirect URI>
    &response_type=<type>
    &scope=<space-separated list of scopes> */


    /*
    / client.ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
    */



    // Twitch Applications Credentials
    //twitch clientID t7kyrxjq326tij087ax7o8a6y686d8
    var options = {
        client_id: 't7kyrxjq326tij087ax7o8a6y686d8',
        response_type: 'code',
        grant_type: 'authorization_code',
        scopes: "user:details:self interactive:robot:self chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat chat:bypass_catbot chat:bypass_filter chat:clear_messages chat:giveaway_start chat:poll_start chat:remove_message chat:timeout chat:view_deleted chat:purge channel:details:self channel:update:self channel:clip:create:self", // Scopes limit access for OAuth tokens.
        redirectUri: "http://localhost:8081/auth/mixer2"

    };

    let streamerRedirect = "http://localhost:8081/auth/twitch/callback";
    let botRedirect = "http://localhost:8081/auth/mixer";

    let streamerScopes = "user_read";
    let botScopes = "chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat";
    let scopes = type === "streamer" ? streamerScopes : botScopes;
    let redirectUri = type === "streamer" ? streamerRedirect : botRedirect;

    /*     // nodeIntegration: false
        //need to look into the webPreferences to ensure sandbox is the right thing to do here
        authWindow = new BrowserWindow({
            parent: mainWindow,
            modal: true,
            width: 800,
            height: 600,
            show: false,
            webPreferences: {
                sandbox: true,
                partition: type,
                nodeIntegration:false,
            }
        });
        var twitchUrl = 'https://id.twitch.tv/oauth2/authorize?';
        var authUrl = twitchUrl + 'client_id=' + options.client_id + '&scope=' + scopes + '&response_type=' + options.response_type + '&redirect_uri=' + redirectUri;
     */


    /*
    New Way
    */

    //let _clientCredentials = _clientCredentials;
    this._currentScopes = new Set();
    this._allowUserChange = false;
    this.tokenType = 'user';


    const defaultOptions = {
        escapeToClose: true,
        closeOnLogin: true
    };

    let _options = Object.assign({}, defaultOptions, null);

    const redir = encodeURIComponent(redirectUri);
    const queryParams = {
        response_type: 'token',
        client_id: 't7kyrxjq326tij087ax7o8a6y686d8',
        redirect_uri: redir,
        scope: scopes,
        force_verify: true,
    };





    var twitchUrl = 'https://id.twitch.tv/oauth2/authorize?';
    const authUrl = twitchUrl + 'client_id=' + queryParams.client_id + '&scope=' + queryParams.scope + '&response_type=' + queryParams.response_type + '&redirect_uri=' + queryParams.redirect_uri + '&force_verify=' + queryParams.force_verify;



    const defaultBrowserWindowOptions = {
        parent: mainWindow,
        width: 800,
        height: 600,
        show: false,
        modal: true,
        webPreferences: {
            nodeIntegration: false
        }
    };


    let done = false;

    const authWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            partition: type,
            nodeIntegration: false,
        },
        escapeToClose: true,
        closeOnLogin: true
    });


    authWindow.webContents.once('did-finish-load', () => authWindow.show());
    authWindow.on('closed', () => {

        if (!done) {
            reject(new WindowClosedError());
        }
    });
    if (true) {
        authWindow.webContents.on('before-input-event', (_, input) => {
            switch (input.key) {
                case 'Esc':
                case 'Escape':
                    authWindow.close();
                    break;
                default:
                    break;
            }
        });
    }
    authWindow.webContents.session.webRequest.onBeforeRequest({ urls: ['http://localhost:8081/auth/twitch/callback'] }, (details, callback) => {
        const url = new URL(details.url);
        const match = url.origin + url.pathname;
        // sometimes, electron seems to intercept too much... we catch this here
        if (match !== 'http://localhost:8081/auth/twitch/callback') {
            // the trailing slash might be too much in the pathname
            if (url.pathname !== '/' || url.origin !== 'http://localhost:8081/auth/twitch/callback') {
                callback({});
                return;
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any


        var hash = url.hash.substr(1);

        var result = hash.split('&').reduce(function(result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        const params = url.hash ? result : url.searchParams;
        if (params.error || params.access_token) {
            done = true;
            if (true) {
                authWindow.destroy();
            }
        }
        if (params.error) {
            //reject(new Error(`Error received from Twitch: ${params.error}`));

            //log the error here

        } else if (params.access_token) {

            //we have the access tokens for the authed
            const accessToken = params.access_token;
            for (const scope of scopes) {
                this._currentScopes.add(scope);
            }
            this._accessToken = {
                access_token: accessToken,
                scope: this.currentScopes,
                refresh_token: ''
            };

            //not sure what this is for
            this._allowUserChange = false;
            //resolve(this._accessToken);
            server.SaveAuthToken(true, this._accessToken);
        }
        callback({ cancel: true });
    });












    // if (1 == 1) {
    // authWindow.loa
    authWindow.loadURL(authUrl);
    authWindow.show();


    //authWindow.on()






})


//remove when done with twitch login
ipcMain.on('mixer-login', (event, arg) => {


    let type = arg;
    // //this shit works
    // let authInfo = {
    //     clientId: '5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d',
    //     authorizationUrl: "https://mixer.com/oauth/authorize",
    //     tokenUrl: "https://mixer.com/api/v1/oauth/token",
    //     useBasicAuthorizationHeader: false,
    //     redirectUri: "http://localhost:8081/auth/mixer2"
    // };

    // let authWindowParams = {
    //     alwaysOnTop: true,
    //     autoHideMenuBar: true,
    //     webPreferences: {
    //         sandbox: true
    //     }
    // };

    // let type = "streamer";
    // let streamerScopes = "user:details:self interactive:robot:self chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat chat:bypass_catbot chat:bypass_filter chat:clear_messages chat:giveaway_start chat:poll_start chat:remove_message chat:timeout chat:view_deleted chat:purge channel:details:self channel:update:self channel:clip:create:self";


    // let scopes = type === "streamer" ? streamerScopes : botScopes;

    // const ses = electron.session.fromPartition(type);
    // ses.clearStorageData();

    // authWindowParams.webPreferences.partition = type;

    // electronOauth2(authInfo, authWindowParams).getAccessToken({ scope: scopes })
    //     .then(token => {

    //     }).catch(err => {
    //         console.log(err);
    //     })
    //






    // Mixer Applications Credentials
    var options = {
        client_id: '5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d',
        response_type: 'code',
        grant_type: 'authorization_code',
        scopes: "user:details:self interactive:robot:self chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat chat:bypass_catbot chat:bypass_filter chat:clear_messages chat:giveaway_start chat:poll_start chat:remove_message chat:timeout chat:view_deleted chat:purge channel:details:self channel:update:self channel:clip:create:self", // Scopes limit access for OAuth tokens.
        redirectUri: "http://localhost:8081/auth/mixer2"

    };

    let streamerRedirect = "http://localhost:8081/auth/mixer2";
    let botRedirect = "http://localhost:8081/auth/mixer";

    let streamerScopes = "user:details:self interactive:robot:self chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat chat:bypass_catbot chat:bypass_filter chat:clear_messages chat:giveaway_start chat:poll_start chat:remove_message chat:timeout chat:view_deleted chat:purge channel:details:self channel:update:self channel:clip:create:self";
    let botScopes = "chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat";
    let scopes = type === "streamer" ? streamerScopes : botScopes;
    let redirectUri = type === "streamer" ? streamerRedirect : botRedirect;

    // nodeIntegration: false
    //need to look into the webPreferences to ensure sandbox is the right thing to do here
    authWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            sandbox: true,
            partition: type
        }
    });
    var mixerUrl = 'https://mixer.com/oauth/authorize?';
    var authUrl = mixerUrl + 'client_id=' + options.client_id + '&scope=' + scopes + '&response_type=' + options.response_type + '&redirect_uri=' + redirectUri;


    // if (1 == 1) {

    authWindow.loadURL(authUrl);
    authWindow.show();


})


/* ipcMain.on('login', (event, arg) => {


    // Mixer Applications Credentials
    var options = {
        client_id: '5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d',
        response_type: 'code',
        grant_type: 'authorization_code',
        scopes: "user:details:self interactive:robot:self chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat chat:bypass_catbot chat:bypass_filter chat:clear_messages chat:giveaway_start chat:poll_start chat:remove_message chat:timeout chat:view_deleted chat:purge channel:details:self channel:update:self channel:clip:create:self", // Scopes limit access for OAuth tokens.
        redirectUri: "http://localhost:8081/auth/mixer2"

    };

    var type = "streamer"

    // nodeIntegration: false
    authWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            sandbox: true,
            partition: type
        }
    });
    var mixerUrl = 'https://mixer.com/oauth/authorize?';
    var authUrl = mixerUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes + '&response_type=' + options.response_type + '&redirect_uri=' + options.redirectUri;


    authWindow.loadURL(authUrl);
    authWindow.show();


})
 */





function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        autoHideMenuBar: false,
        useContentSize: false,
        resizable: true,
        show: false,
        //maxWidth: 1440,
        webPreferences: {
            nodeIntegration: true
        }

    });



    // and load the index.html of the app.
    mainWindow.maximize();
    //mainWindow.loadURL('file://' + __dirname + '/views/pages/index.html')
    mainWindow.loadURL('file://' + __dirname + '/views/pages/bot.ejs');
    mainWindow.show();

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })


    mainWindow.on('move', function() {
        // Do move event action
        log.info('window moved');

    });

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

    var screens = require('electron').screen;
    createWindow();
    //this is to be used for when electron switches display
    let displays = screens.getAllDisplays();


});



// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        log.info('App Exiting');
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});


//redirectUrl: "http://localhost:8081/auth/mixer2"

let info = {
    key: "5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d",
    //secret: process.env.FB_SECRET,
    scope: streamerScopes,
    baseSite: "",
    authorizePath: "https://mixer.com/oauth/authorize",
    accessTokenPath: "https://mixer.com/api/v1/oauth/token",
    redirectUrl: "http://localhost:8081/"
};

let windowAuth;

function loadbot() {
    log.info('Bot loading.....');
    authWindow.close();
    mainWindow.loadURL('file://' + __dirname + '/views/pages/bot.ejs');
}

function closeAuthWindow() {
    authWindow.close();
}



ipcMain.on('closeauthwindow', (event, arg) => {
    closeAuthWindow();
})




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.