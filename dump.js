// "pack:win32": "electron-packager . ShoeBot --out=./dist --platform=win32 --arch=ia32 --electronVersion=3.0.10 --asar --prune --overwrite --icon=./gui/images/logo.ico --ignore=/user-settings --ignore=/kbm-java --ignore=/.vscode",
// "pack:win64": "electron-packager . ShoeBot --out=./dist --platform=win32 --arch=x64 --electronVersion=3.0.10 --asar --prune --overwrite --version-string.ProductName=\"ShoeBot\" --icon=./gui/images/logo.ico --ignore=/user-settings --ignore=/resources --ignore=/.vscode",
// "build32": "npm run pack:win32",
// "build64": "npm run pack:win64",
// "build-all": "echo Packaging 32bit versions && npm run rebuild32 && npm run pack:all32 && echo 32bit Packaging done.... && echo Packaging 64bit versions && npm run rebuild64 && npm run pack:all64",
// "rebuild": "npm run rebuild64",
// "build": "npm run build64",
// "package": "echo Building Electron package && npm run pack:win64 && echo Packing the installer && grunt create-windows-installer && echo Installer package ready!"


// "pack:win32": "electron-packager . Firebot --out=./dist --platform=win32 --arch=ia32 --electronVersion=1.7.10 --asar --prune --overwrite --icon=./gui/images/logo.ico --ignore=/user-settings --ignore=/kbm-java --ignore=/.vscode",
// "pack:win64": "electron-packager . Firebot --out=./dist --platform=win32 --arch=x64 --electronVersion=1.7.10 --asar --prune --overwrite --version-string.ProductName=\"Firebot\" --icon=./gui/images/logo.ico --ignore=/user-settings --ignore=/resources --ignore=/.vscode  && xcopy /s /i resources\\overlay .\\dist\\Firebot-win32-x64\\resources\\overlay && xcopy /s /i resources\\kbm-java .\\dist\\Firebot-win32-x64\\resources\\kbm-java && xcopy /s /i resources\\default-configs .\\dist\\Firebot-win32-x64\\resources\\default-configs && xcopy /s /i /Y resources\\ffmpeg .\\dist\\Firebot-win32-x64\\resources\\ffmpeg",
// "pack:mac": "electron-packager . Firebot --out=./dist --platform=darwin --arch=x64 --electronVersion=1.7.10 --asar --prune --overwrite --version-string.ProductName=\"Firebot\" --icon=./gui/images/logo.icns --ignore=/user-settings --ignore=/resources --ignore=/.vscode && mkdir -p ./dist/Firebot-darwin-x64/resources/overlay && cp -a ./resources/overlay/. ./dist/Firebot-darwin-x64/resources/overlay/ && mkdir -p ./dist/Firebot-darwin-x64/resources/kbm-java && cp -a ./resources/kbm-java/. ./dist/Firebot-darwin-x64/resources/kbm-java/",



/* this is what I had before */


//index js 

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


const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
// configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


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


ipcMain.on('loadbot', (event, arg) => {
    console.log(arg) // prints "ping"
    loadbot();
})


ipcMain.on('saveauthbot', (event, arg) => {

    server.SaveAuth(event)

})


ipcMain.on('saveauth', (event, arg) => {

    server.SaveAuth(event)

    ipcMain.emit('loadbot');

})


//ipcMain.on will receive the “btnclick” info from renderprocess 
ipcMain.on("btnclick", function(event, arg) {
    //create new window
    /*     var newWindow = new Window({
            width: 450,
            height: 300,
            show: false,
            webPreferences: {
                webSecurity: false,
                plugins: true,
                nodeIntegration: false
            }
        }); // create a new window

        var facebookURL = "https://www.facebook.com";
        // loading an external url. We can load our own another html file , like how we load index.html earlier

        newWindow.loadURL(facebookURL);
        newWindow.show(); */
    // console.log('logging in with bot');

    //  server.SetStreamerAuth();

    // login();

    // let info = {
    //         key: '5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d',
    //         scope: streamerScopes,
    //         baseSite: "",
    //         authorizePath: "https://mixer.com/oauth/authorize",
    //         accessTokenPath: "https://mixer.com/api/v1/oauth/token",
    //         redirectUrl: "http://localhost:8081/auth/mixer",
    //         code: "token"


    //     },
    //     loginwindow = new Window({
    //         alwaysOnTop: true,
    //         autoHideMenuBar: true,
    //         webPreferences: { nodeIntegration: true, contextIsolation: true }
    //     });

    // loginAuth.oauth2(info, loginwindow);





    //login('bot');
    // inform the render process that the assigned task finished. Show a message in html
    // event.sender.send in ipcMain will return the reply to renderprocess
    // event.sender.send("btnclick-task-finished", "yes");
});

ipcMain.addListener("fulfilled", function(event, arg) {
    console.log(event);
});


ipcMain.on("fulfilled", function(event, arg) {
    console.log(event);
});

ipcMain.on("btnclickstreamer", function(event, arg) {

    //login4();

});


// authWindow.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl) {
//     var raw_code = /code=([^&]*)/.exec(newUrl) || null,
//         code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
//         error = /\?error=(.+)$/.exec(newUrl);

//     if (code || error) {
//         // Close the browser if code found or error
//         authWindow.close();
//     }

//     // If there is a code in the callback, proceed to get token from mixer
//     if (code) {
//         console.log("code recieved: " + code);

//         var postData = querystring.stringify({
//             "client_id": options.client_id,
//             "code": code
//         });

//         var post = {
//             host: "mixer.com",
//             path: "/api/v1/oauth/token",
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'Content-Length': postData.length,
//                 "Accept": "application/json"
//             }
//         };

//         var req = https.request(post, function(response) {
//             var result = '';
//             response.on('data', function(data) {
//                 result = result + data;
//             });
//             response.on('end', function() {
//                 var json = JSON.parse(result.toString());
//                 console.log("access token recieved: " + json.access_token);
//                 if (response && response.ok) {
//                     // Success - Received Token.
//                     // Store it in localStorage maybe?
//                     console.log(response.body.access_token);
//                 }
//             });
//             response.on('error', function(err) {
//                 console.log("MIXER OAUTH REQUEST ERROR: " + err.message);
//             });
//         });

//         req.write(postData);
//         req.end();
//     } else if (error) {
//         alert("Oops! Something went wrong and we couldn't log you in using Mixer. Please try again.");
//     }
// });

//icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
//show: false,



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
    authWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            sandbox: true,
            partition: type,
            nodeIntegration: true
        }
    });
    var mixerUrl = 'https://mixer.com/oauth/authorize?';
    var authUrl = mixerUrl + 'client_id=' + options.client_id + '&scope=' + scopes + '&response_type=' + options.response_type + '&redirect_uri=' + redirectUri;


    // if (1 == 1) {




    authWindow.loadURL(authUrl);
    authWindow.show();



    // let type = "streamer";
    // loginWindow = new BrowserWindow({

    //     width: 800,
    //     height: 600,
    //     minWidth: 800,
    //     minHeight: 600,
    //     backgroundColor: '#312450',
    //     autoHideMenuBar: true,
    //     webPreferences: { sandbox: true, partition: type },
    //     //show: true,
    //     parent: mainWindow
    // });


    /*     


        const config = {
            client_id: "5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d",
            redirect_uri: "http://localhost:8081/auth/mixer2",
            authorize_url: "https://mixer.com/oauth/authorize",
            access_token_url: "https://mixer.com/api/v1/oauth/token",
            response_type: "code",
            scope: streamerScopes,
        }


        const provider = new OAuth2Provider(config)
            // Your can use custom parameter.
            // const provider = new OAuth2Provider(config)
            //   .withCustomAuthorizationRequestParameter({})
            //   .withCustomAccessTokenRequestParameter({})
        provider.perform(loginWindow)
            .then(resp => {
                console.log(resp)
                loginWindow.close();
            })
            .catch(error => console.error(error));
     */







    /*     let streamerScopes = "user:details:self interactive:robot:self chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat chat:bypass_catbot chat:bypass_filter chat:clear_messages chat:giveaway_start chat:poll_start chat:remove_message chat:timeout chat:view_deleted chat:purge channel:details:self channel:update:self channel:clip:create:self";

        let info = {
            key: '5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d',
            scope: streamerScopes,
            baseSite: "",
            authorizePath: "https://mixer.com/oauth/authorize",
            accessTokenPath: "https://mixer.com/api/v1/oauth/token",
            redirectUrl: "http://localhost:8081/auth/mixer2",
            response_type: "token"
        };


        loginAuth.oauth2(info, loginWindow).then(token => {
            console.log(token);
        }).catch(err => {
            console.log("error");
        }); */


})


ipcMain.on('login', (event, arg) => {


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
            partition: type,
            nodeIntegration: true
        }
    });
    var mixerUrl = 'https://mixer.com/oauth/authorize?';
    var authUrl = mixerUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes + '&response_type=' + options.response_type + '&redirect_uri=' + options.redirectUri;


    authWindow.loadURL(authUrl);
    authWindow.show();


})






function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        autoHideMenuBar: false,
        useContentSize: false,
        resizable: true,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }

    });



    // and load the index.html of the app.
    mainWindow.maximize();
    mainWindow.loadURL('file://' + __dirname + '/views/pages/index.html')
    mainWindow.show();

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })


};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);



// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
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
    authWindow.close();
    mainWindow.loadURL('file://' + __dirname + '/views/pages/bot.ejs');
}

// function login3() {

//     var type = "bot";
//     // const ses = electron.session.fromPartition(type);


//     // ses.clearStorageData();
//     // authWindowParams.webPreferences.partition = type;

//     const { OAuth2Provider } = require("electron-oauth-helper")



//     let window = new BrowserWindow({
//         width: 600,
//         height: 800,
//         webPreferences: {
//             nodeIntegration: false,
//             contextIsolation: true
//         },
//     })




//     const test = {
//         client_id: "5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d",
//         scope: streamerScopes,
//         redirect_uri: "http://localhost:8081/auth/mixer",
//         authorize_url: "https://mixer.com/oauth/authorize",
//         access_token_url: "https://mixer.com/api/v1/oauth/token",
//         response_type: "token"
//     }

//     const config = { /* oauth config. please see example/main/config.example.js.  */ }
//     const provider = new OAuth2Provider(test)
//         // Your can use custom parameter.
//         // const provider = new OAuth2Provider(config)
//         //   .withCustomAuthorizationRequestParameter({})
//         //   .withCustomAccessTokenRequestParameter({})




//     /*     window.webContents.session.cookies.get(details, callback) // getting cookies 
//         window.webContents.session.cookies.remove(details, callback) //deleting cookies */
//     /*    window.webContents.session.clearCache(function() {
//            //some callback.
//        });

//        window.webContents.session.clearStorageData(function() {

//        }); */



//     let data2;
//     provider.perform(window)
//         .then(data => {
//             //console.log(data)
//             data2 = data;
//         })
//         .catch(err => console.log(err));


// }


// function login4() {

//     // var type = "streamer";
//     // // const ses = electron.session.fromPartition(type);


//     // // ses.clearStorageData();
//     // // authWindowParams.webPreferences.partition = type;

//     // const { OAuth2Provider } = require("electron-oauth-helper")



//     // /*     const window2 = new Window({
//     //         width: 600,
//     //         height: 800,
//     //         webPreferences: {
//     //             nodeIntegration: false,
//     //             contextIsolation: true
//     //         },
//     //     })
//     //  */

//     // const { remote } = require('electron');

//     // let window2 = new Window({
//     //     width: 600,
//     //     height: 800,
//     //     webPreferences: {
//     //         nodeIntegration: false,
//     //         contextIsolation: true
//     //     },
//     // })

//     // var theUrl = 'file://' + __dirname + '/streamlogin.html'
//     //     // console.log('url', theUrl);

//     // window2.loadURL(theUrl);

//     // /*     window2.webContents.session.clearCache(function() {
//     //         //some callback.
//     //     });

//     //     window2.webContents.session.clearStorageData(function() {

//     //     }); */


//     // const config = {
//     //     client_id: "5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d",
//     //     scope: streamerScopes,
//     //     redirect_uri: "http://localhost:8081/auth/mixer",
//     //     authorize_url: "https://mixer.com/oauth/authorize",
//     //     access_token_url: "https://mixer.com/api/v1/oauth/token",
//     //     response_type: "token"
//     // }






//     // const provider = new OAuth2Provider(config)
//     //     // Your can use custom parameter.
//     //     // const provider = new OAuth2Provider(config)
//     //     //   .withCustomAuthorizationRequestParameter({})
//     //     //   .withCustomAccessTokenRequestParameter({})
//     // provider.perform(window2)
//     //     .then(resp => {
//     //         console.log(resp);
//     //         // ses.clearStorageData();
//     //     })
//     //     .catch(error => console.error(error));




//     // let type = "streamer";

//     // let tokenData = null;

//     // let streamerScopes = "user:details:self interactive:robot:self chat:connect chat:chat chat:whisper chat:bypass_links chat:bypass_slowchat chat:bypass_catbot chat:bypass_filter chat:clear_messages chat:giveaway_start chat:poll_start chat:remove_message chat:timeout chat:view_deleted chat:purge channel:details:self channel:update:self channel:clip:create:self";


//     // let info = {
//     //     key: '5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d',
//     //     scope: streamerScopes,
//     //     baseSite: "",
//     //     authorizePath: "https://mixer.com/oauth/authorize",
//     //     accessTokenPath: "https://mixer.com/api/v1/oauth/token",
//     //     redirectUrl: "http://localhost:8081/auth/mixer2",
//     //     code: "token"


//     // };

//     // let loginwindow = new BrowserWindow({
//     //     alwaysOnTop: true,
//     //     autoHideMenuBar: true,
//     //     webPreferences: {
//     //         sandbox: true
//     //     }
//     // });

//     // loginAuth.oauth2(info, loginwindow).then(token => {

//     // }).catch(err => {
//     //     console.log("error");
//     // });



// }

//not in use
// function login2() {

//     var type = "bot";
//     let info = {
//         key: '5ca546b27d464fc8e8fc8ac42e38380c5917710bbdf9545d',
//         scope: streamerScopes,
//         baseSite: "",
//         authorizePath: "https://mixer.com/oauth/authorize",
//         accessTokenPath: "https://mixer.com/api/v1/oauth/token",
//         redirectUrl: "http://localhost:8081/auth/mixer",
//         code: "token"


//     };

//     let loginwindow = new BrowserWindow({
//         alwaysOnTop: true,
//         autoHideMenuBar: true,
//         webPreferences: { sandbox: true }
//     });

//     loginAuth.oauth2(info, loginwindow).then(token2 => {
//         console.log(token2);
//     });

//     loginwindow.then(token => {
//         console.log(token);

//     });




//     /*     const ses = electron.session.fromPartition(type);
//         ses.clearStorageData(); */
//     //loginwindow.webPreferences.partition = type;

//     // loginwindow.webContents.session.cookies.remove("https://www.mixer.com/", 'c_user', () => {


//     //     var promise1 = loginAuth.oauth2(info, loginwindow);

//     //     promise1.then(function(value) {
//     //         console.log(value);
//     //         // expected output: "Success!"
//     //     });

//     //     /*         loginAuth.oauth2(info, loginwindow).then(token => {

//     //                 var tokenxx = token;
//     //             }).catch(error => {

//     //             }) */

//     //     /*         loginAuth.oauth2(info, loginwindow)
//     //                 .then(_ => {

//     //                     console.log('Success');

//     //                     // windowAuth.webContents.executeJavaScript(`document.body.innerHTML += '<div id="result">Success</div>'`)
//     //                 })
//     //                 .catch(_ => {
//     //                     console.log('Error');
//     //                     // window.webContents.executeJavaScript(`document.body.innerHTML += '<div id="result">Error</div>'`)
//     //                 }); */
//     // });
//&& xcopy /s /i app\\jsondbfiles .\\dist\\SchuBot-win32-x64\\app\\jsondbfiles

//     // // loginwindow.webContents.session.cookies.remove("https://www.facebook.com/", 'c_user', () => {
//     // //     login.oauth2(info, window)
//     // //         .then(_ => {
//     // //             window.webContents.executeJavaScript(`document.body.innerHTML += '<div id="result">Success</div>'`)
//     // //         })
//     // //         .catch(_ => {
//     // //             window.webContents.executeJavaScript(`document.body.innerHTML += '<div id="result">Error</div>'`)
//     // //         })
//     // // })



// }

// function login(type, clipsReauth = false) {

//     // const  session  = electron.session;
//     type = "bot";
//     console.log('logging in method - logging in as ' + type);
//     //$rootScope.showSpinner = true;

//     let scopes = type === "streamer" ? streamerScopes : botScopes;
//     let authInfo = type === "streamer" ? streamerAuthInfo : botAuthInfo;
//     // clear out any previous sessions
//     const ses = electron.session.fromPartition(type);
//     ses.clearStorageData();
//     authWindowParams.webPreferences.partition = type;

//     if (type == "bot") {

//     } else {

//     }


//     // authWindowParams.webPreferences.partition = type;
//     //const oauthProvider = electronOauth2(authInfo, authWindowParams)
//     electronOauth2(authInfo, authWindowParams).getAccessToken({ scope: scopes })
//         .then(token => {
//             if (token.name != null && token.name === "ValidationError") {
//                 //utilityService.showErrorModal("There was an issue logging into Mixer. Error: " + token.details[0].message);
//                 //logger.error("There was an issue logging into Mixer. Error: " + token.details[0].message, token);
//             } else {

//                 if (type === "streamer") {

//                     //service.accounts.streamer.loggedInThisSession = true;
//                     userInfo(type, token.access_token, token.refresh_token, clipsReauth);

//                     //login completed redirect mainwindow to bot
//                     //  event.sender.send("btnclickstreamer-task-finished", "yes");
//                     mainWindow.loadURL('file://' + __dirname + '/views/pages/bot.ejs');
//                     // mainWindow.webContents.openDevTools();

//                     server.SendCommandListToBot(userCommands);

//                 } else {
//                     userInfo(type, token.access_token, token.refresh_token, clipsReauth);
//                 }

//             }
//         }, err => {
//             //error requesting access
//             // $rootScope.showSpinner = false;

//             if (!err.message.startsWith("window was closed by user")) {
//                 // logger.error("There was an error when attempting to log in: " + err.message, err);
//                 // utilityService.showErrorModal(`There was an error when attempting to log in. Error: ${err.message}`);
//             }
//         });



// }




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.