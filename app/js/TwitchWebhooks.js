
// // let events = require('events');
// // let webHookHandler = function (oAuthToken,clientID , log) {

// //     this.oAuthToken = oAuthToken;
// //     this.clientID = clientID; 

// //     let self = this;
// //     self.subscribeFollows = (Topic)  => {
// //             try {

// //                 const fetch = require("node-fetch");
// //                 const webHookUrl = "https://api.twitch.tv.helix/webhooks/hub";
    
// //                 const response = fetch(webHookUrl, {
// //                     method: 'get',
// //                     headers: 
// //                     {   
// //                     'Authorization': 'Bearer ' + `${this.oAuthToken}`,
// //                     'Client-Id': `${this.clientID}`
// //                     }
// //                     ,form: 
// //                     {
// //                     'hub.callback': 'http://localhost:8081/webhooks',
// //                     'hub.mode': 'subscribe',
// //                     'hub.topic': `${Topic}`,
// //                     'hub.lease_seconds': 864000,
// //                     'hub.secret':"oijiojoijiojiojoijioj"
                                
// //                     }
// //                 });
    
// //                 const json = response;
    
// //                 return d = new TwitchChannelObject(json.data[0]);
    
// //             } catch (error) {
// //                 log.error('getChannel error - ' + error);
// //                 return d = error;
// //             }
// //         };

    
// // };



// // webHookHandler.prototype = new events.EventEmitter;
// // module.exports = webHookHandler;

// // // requirements:
// // // auth token /app access token

// // // you will recieve 202 accepted

// // /* 
// // Bearer token is provided	800 points per minute, per user	800 points
// // Bearer token is not provided	30 points per minute	30 points
// // */

// // /* 

// // reference url: dev.twitch.tv/docs/api

// // list of scopes and urls

// // root url: https://api.twitch.tv

// // start commercial            POST helix/channels/commercial            channel:edit:commercial

// // get extension analitics     GET helix/analytics/extensions            analytics:read:extensions

// // get cheermotes              GET helix/bits/cheermotes                 No Auth token required (wtf ?)

// // get game analytics          GET helix/analytics/games                 analytics:read:games

// // get bits leaderboard        GET helix/bits/leaderboard                bits:read

// // get extension transactions  GET helix/extensions/transactions         OAuth or App Access Token required.

// // create clip                 POST helix/clips                          clips:edit

// // get clips                   GET helix/clips                           None

// // create entitlement grants   POST helix/entitlements/upload            App access token required

// // get code status             GET helix/entitlements/codes              Drops related

// // get drops entitlement       GET helix/entitlements/drops              App Access OAuth Token required.

// // redeem code                 helix/entitlements/code                   Redeem Code (no needed for now)

// // get top games               GET helix/games/top                       None

// // get games                   GET helix/games                           None

// // get hype train events       GET helix/hypetrain/events                channel:read:hype_train

// // check auto mod status       POST helix/moderation/enforcement/status  moderation:read

// // get banned users            GET helix/moderation/banned               moderation:read

// // get banned events           GET helix/moderation/banned/events        moderation:read

// // get moderators              GET helix/moderation/moderators           moderation:read

// // get moderator events        GET helix/moderation/moderators/events    moderation:read

// // search categories           GET helix/search/categories               OAuth or App Access Token required

// // search channels             GET helix/channels                        OAuth or App Access Token required

// // get stream key              GET helix/streams/key                     User OAuth Token channel:read:stream_key

// // get streams                 GET helix/streams                         OAuth or App Access Token required

// // create stream marker        POST helix/streams/marker                 OAuth Token user:edit:broadcast

// // get stream markers          GET helix/streams/markers                 OAuth Token user:read:broadcast

// // get channel information     GET helix/channels                        None

// // modify channel info         PATCH helix/channels                      OAuth Token

// // get broadcaster subs        GET helix/subscriptions                   OAuth Token channel:read:subscriptions

// // get all stream tags         GET helix/tags/streams                    App Access Token

// // get stream tags             GET helix/streams/tags                    App Access Token

// // replace tags                PUT helix/streams/tags                    OAuth token user:edit:broadcast

// // create user follows         POST helix/users/follows                  OAuth Token user:edit:follows

// // delete user follows         DELETE helix/users/follows                OAuth Token user:edit:follows

// // get users                   GET helix/users                           OAuth Token user:read:email

// // get users follows           GET helix/users/follows                   Minimum from_id or to_id sample https://api.twitch.tv/helix/users/follows?to_id= (who is following to_id) or from_id= (being followed by) user:edit scope

// // get user extensions         GET helix/extensions/list                 OAuth Token user:read:broadcast (gets active/inactive extenions)

// // get user active extensions  GET helix/users/extensions                OAuth Token optional scope (wtf??) user:read:broadcast or user:edit:broadcast (wtf??)

// // update user extensions      PUT helix/users/extensions                OAuth Token  user:edit:broadcast

// // get videos                  GET helix/videos                          OAuth or App Access Token No Scope required

// // get webhook subscriptions   GET helix/webhooks/subscriptions          App Access Token



// // */


// // /* payload for webhook */
// // /***
// //  * 

// //  make a call to https://api.twitch.tv.helix/webhooks/hub

// // hub.callback('http://localhost:8081/webhooks/'`${topic}`)
// // hub.mode('subscribe');

// // //user follows user ?
// // hub.topic('https://api.twitch.tv/helix/users/follows?first=1&from_id='`${fromUser}`+ 'to_id='`${User}`)

// // //user gets follows?
// // hub.topic('https://api.twitch.tv/helix/users/follows?first=1&to_id='`${User}`)

// // //user follows someone?
// // hub.topic('https://api.twitch.tv/helix/users/follows?first=1&from_id='`${fromUser}`)

// // hub.lease_seconds(864000);

// // //secret used to sign notification payloads
// // hub.secret(sha256) 

// //  * 
// //  * ***/



// const http = require('http');
// const https = require('https');
// const fs = require('fs');
// const {EventEmitter} = require('events');
// const {createHmac} = require('crypto');

// const cwtInTitle = title => title.match(/\bcwt\b/i) !== null;
// const userIdFromUrl = url => url.split('/')[2];
// const asEvent = payload => 'data: ' + JSON.stringify(payload) + '\n\n';
// const bold = txt => '\033[1m' + txt + '\033[0m';
// const assert = (expression, fallback) => {
//   try { return expression(); }
//   catch { return fallback; }
// };

// const args = '|' + process.argv.slice(2).join('|') + '|';
// const port = assert(() => args.match(/\|--?p(?:ort)?\|([0-9]+)\|/)[1], 9999);
// const help = assert(() => args.match(/\|--?h(?:elp)?\|/) != null, false);
// const verifySignature = args.indexOf('|--no-signature|') === -1;
// const currentTournamentCheck = args.indexOf('|--no-current-check|') === -1;
// const hostname = assert(() => args.match(/\|--host\|(https?:\/\/.+?\/?)\|/)[1], 'http://localhost');

// console.info('running on port', port);
// console.info('exposing as hostname', hostname);

// if (help) {
//   console.info(`
//     ${bold('ENVIRONMENT')}
//     ${bold('TWITCH_CLIENT_SECRET')}    Twitch API client secret
//     ${bold('TWITCH_CLIENT_ID')}        Twitch API client ID
    
//     ${bold('OPTIONS')}
//     ${bold('--no-signature')}          Skip signature check
//     ${bold('--no-current-check')}      Subscribe to Webhook even if there's not CWT tournament
//     ${bold('--port 80')}               Run on port 80 (defaults to 9999)
//     ${bold('--host http://abc.com')}   This server's hostname (defaults to http://localhost)
//     ${bold('--help')}                  Display this help
//   `);

//   process.exit(0);
// }

// /* if (!process.env.TWITCH_CLIENT_SECRET || !process.env.TWITCH_CLIENT_ID) {
//   console.error('You did not provide required environment variables.');
//   process.exit(1);
// }

// if (!process.env.TWITCH_CLIENT_SECRET && verifySignature) {
//   console.error('Please provide a secret via environment variable.');
//   process.exit(1);
// } */

// const eventEmitter = new EventEmitter();
// eventEmitter.setMaxListeners(Infinity); // uh oh

// let accessToken;
// const leaseSeconds = 864000;
// const subscriptions = [];
// const allChannels = [];
// const streams = [];
// let shutdown;
// let server;

// const client_id = 'gp762nuuoqcoxypju8c569th9wz7q5'
// const refresh_token = '8tm6mlz5f1657hlsno8o48tka14435b4qtwq10wnm1jz9w7thv'
// const token = 'lx71o93103qho7pc2onpz2ktprnsrp';

// async function retrieveAccessToken() {
//   let promiseResolver;
//   const promise = new Promise(resolve => promiseResolver = resolve);
//   const queryParams = new URLSearchParams({
//     "client_id": process.env.TWITCH_CLIENT_ID,
//     "client_secret": process.env.TWITCH_CLIENT_SECRET,
//     "grant_type": "client_credentials",
//   });
//   https.request(
//     `https://id.twitch.tv/oauth2/token?${queryParams}`,
//     {method: 'POST'},
//     (twitchRes) => {
//       bodify(twitchRes, body => {
//         console.info('Response from access token request', body);
//         accessToken = body.access_token;
//         promiseResolver({res: twitchRes, body});
//       });
//     }).end();
//   return promise;
// }

// async function revokeAccessToken() {
//   let promiseResolver;
//   const promise = new Promise(resolve => promiseResolver = resolve);
//   const queryParams = new URLSearchParams({
//     "client_id": process.env.TWITCH_CLIENT_ID,
//     "token": accessToken,
//   });
//   https.request(
//     `https://id.twitch.tv/oauth2/revoke?${queryParams}`,
//     {method: 'POST'},
//     (twitchRes) => {
//       bodify(twitchRes, body => {
//         console.info("Revoking access token response", twitchRes.statusCode, body);
//         promiseResolver();
//       });
//     }).end();
//   return promise;
// }

// async function validateAccessToken() {
//   let promiseResolver;
//   const promise = new Promise(resolve => promiseResolver = resolve);
//   https.request(
//     `https://id.twitch.tv/oauth2/validate`,
//     {
//       method: 'GET',
//       headers: {
//         Authorization: `OAuth ${accessToken}`
//       }
//     },
//     (twitchRes) => {
//       bodify(twitchRes, body => {
//         console.info('validating access token', twitchRes.statusCode);
//         promiseResolver({res: twitchRes, body});
//       });
//     }).end();
//   return promise;
// }





// function createServer() {
//   server = http.createServer(async (req, res) => {
//     if (req.url === '/favicon.ico') return endWithCode(res, 404);

// /*     const validateRes = await validateAccessToken();
//     if (!validateRes.res.statusCode.toString().startsWith('2')) {
//       await retrieveAccessToken();
//     } */

//     bodify(req, (body, raw) => {
//       try {
//         console.info(`${req.method} ${req.url} at ${Date.now()}Headers: ${JSON.stringify(req.headers)}Payload: ${body && JSON.stringify(body)}`);
//         req.on('error', console.error);
//         cors(req, res);
//         if (req.url.startsWith('/consume')) consume(req, res, body, raw);
//         else if (req.url === '/produce') produce(req, res);
//         else if (req.url === '/current') current(req, res);
//         else if (req.url === '/subscribe-all') subscribeToAllChannels(res);
//         else if (req.url.startsWith('/subscribe')) subUnsub(userIdFromUrl(req.url), 'subscribe', res);
//         else if (req.url.startsWith('/unsubscribe')) subUnsub(userIdFromUrl(req.url), 'unsubscribe', res);
//         else endWithCode(res, 404)
//       } catch (e) {
//         console.error(e);
//         endWithCode(res, 500);
//       }
//     });
//   }).listen(8081);
// }

// (async () => {
//   //await retrieveAccessToken();
//   allChannels.push(...(await retrieveChannels()));
//   const userIds = allChannels.map(c => c.id)
//   await subscribeToAllChannels();
//   createServer();
//   if (currentTournamentCheck) {
//     console.info("Checking if CWT is currently in group or playoff stage.");
//     const currentTournament = await retrieveCurrentTournament();
//     if (currentTournament && currentTournament.status
//         && ['GROUP', 'PLAYOFFS'].includes(currentTournament.status)) {
//       streams.push(...await retrieveCurrentStreams(userIds));
//     } else {
//       console.info("There's currently no tournament so am not expecting any streams.");
//     }
//   } else {
//     console.info("Skipping check if there's currently a CWT tournament ongoing.");
//     streams.push(...await retrieveCurrentStreams(userIds));
//   }
// })();

// /* async function subscribeToAllChannels(res) {
//   const success = [];
//   const failure = [];
//   for (const c of allChannels) {
//     try {
      
//         await subUnsub(c.id, 'subscribe');
//       console.info(`Subscribed to ${c.displayName} (${c.id})`);
//       success.push(c.id);
//     } catch (e) {
//       console.error(`Couldn't subscribe to ${c.displayName} (${c.id})`)
//       failure.push(c.id);
//     }
//   }
//   setTimeout(() => subscribeToAllChannels(), leaseSeconds * 1000);
//   res && endWithCode(res, 200, {success, failure});
// } */

//  async function subscribeToAllChannels(res) {
//   const success = [];
//   const failure = [];
  
//     try {
      
//         await subUnsub(147299544, 'subscribe');
//       console.info(`Subscribed to ${c.displayName} (147299544)`);
//       success.push(147299544);
//     } catch (e) {
//       console.error(`Couldn't subscribe to ${c.displayName} (147299544)`)
//       failure.push(147299544);
//     }
  
//   setTimeout(() => subscribeToAllChannels(), leaseSeconds * 1000);
//   res && endWithCode(res, 200, {success, failure});
// } 

// function consume(req, res, body, raw) {
//   const url = new URL(req.url, hostname);
//   const hubCallback = url.searchParams.get('hub.challenge');
//   if (hubCallback != null) {
//     console.info('Verifying callback.', hubCallback);
//     const hubMode = url.searchParams.get('hub.mode');
//     const hubUserId = new URL(decodeURIComponent(
//       url.searchParams.get('hub.topic'))).searchParams.get('user_id');
//     if (hubMode === 'unsubscribe') {
//       subscriptions.splice(
//         subscriptions.indexOf(
//           hubUserId),
//         1);
//       if (subscriptions.length === 0 && shutdown != null) {
//         shutdown();
//       }
//     } else if (hubMode === 'subscribe') {
//       subscriptions.push(hubUserId);
//     }
//     return endWithCode(res, 202, hubCallback);
//   }

//   console.log("There's a consumption", body);

//   if (!validateContentLength(req, res, raw)) return;
//   if (!validateSignature(req, res, raw)) return;

//   console.info('All validation passed.');

//   if (body.data.length !== 0) {
//     console.info("stream's gone online or maybe changed.");
//     const newStreams = body.data
//       .filter(e => !streams.map(s => s.id).includes(e.id))
//       .filter(e => cwtInTitle(e.title))
//       .map(e => ({
//         id: e.id,
//         title: e.title,
//         user_id: e.user_id,
//         user_name: e.user_name
//       }));
//     console.info('newStreams', newStreams);
//     streams.push(...newStreams);
//     if (newStreams.length === 0) return endWithCode(res, 200);
//   } else {
//     const userId = userIdFromUrl(req.url);
//     console.info("stream's gone off for userId", userId);
//     if (userId == null) return endWithCode(res, 404);
//     let idxOfToBeRemovedStream = streams.findIndex(s => s.user_id === userId);
//     while (idxOfToBeRemovedStream !== -1) {
//       streams.splice(idxOfToBeRemovedStream, 1);
//       idxOfToBeRemovedStream = streams.findIndex(s => s.user_id === userId);
//     }
//   }

//   eventEmitter.emit('stream');
//   endWithCode(res, 200)
// }

// function produce(req, res) {
//   res.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     'Connection': 'keep-alive',
//   });
//   res.write('\n');
//   res.write(asEvent(streams));
//   const eventListener = () => res.write(asEvent(streams));
//   eventEmitter.addListener('stream', eventListener);
//   res.on('close', () => eventEmitter.removeListener('stream', eventListener))
// }

// function subUnsub(userId, subUnsubAction, res) {
//   let resolvePromise;
//   let rejectPromise;
//   const promise = new Promise((resolve, reject) => {
//     resolvePromise = resolve;
//     rejectPromise = reject;
//   });
//   if (!userId) {
//     console.warn("No channel to subscribe to.");
//     res && endWithCode(res, 404);
//     return Promise.reject("No channel to subscribe to.");
//   }
//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'client-id': client_id,
//       'Authorization': `Bearer ${token}`
//     }
//   };
//   const twitchReq = https.request(
//     'https://api.twitch.tv/helix/webhooks/hub',
//     options, (twitchRes) => {
//       bodify(twitchRes, body => {
//         console.info(`${subUnsubAction}d to ${userId} with HTTP status ${twitchRes.statusCode}`);
//         if (twitchRes.statusCode.toString().startsWith('2')) {
//           resolvePromise();
//         } else {
//           rejectPromise();
//         }
//         res && endWithCode(res, 200);
//       });
//     });
//   twitchReq.on('error', console.error);
//   const callbackUrl = `${hostname}/consume/${userId}`;
//   console.log('callbackUrl', callbackUrl);
//   const topic = `https://api.twitch.tv/helix/streams?user_id=${userId}`;
//   console.info(`${subUnsubAction} `, topic);
//   twitchReq.write(JSON.stringify({
//     "hub.callback": callbackUrl,
//     "hub.mode": subUnsubAction,
//     "hub.topic": topic,
//     "hub.secret": 'testsecret',
//     "hub.lease_seconds": leaseSeconds,
//   }));
//   twitchReq.end();
//   return promise;
// }

// function bodify(req, cb) {
//   let body = '';
//   req
//     .on('data', chunk => body += chunk)
//     .on('end', () => {
//       if (!body) return cb(null);
//       try {
//         cb(JSON.parse(body), body)
//       } catch (e) {
//         console.warn('body could not be parsed', e);
//         cb(null);
//       }
//     });
// }

// function current(req, res) {
//   res.setHeader('Content-Type', 'application/json');
//   endWithCode(res, 200, JSON.stringify(streams))
// }

// function validateSignature(req, res, raw) {
//   if (!verifySignature) {
//     console.log('Skipping signature verification');
//     return true;
//   }

//   const signature = req.headers['x-hub-signature'];
//   const expectedSignature = createHmac('sha256', process.env.TWITCH_CLIENT_SECRET)
//     .update(raw)
//     .digest('hex');

//   if (signature !== `sha256=${expectedSignature}`) {
//     console.error('Invalid signature.');
//     endWithCode(res, 400);
//     return false
//   }
//   console.info('Signature valid.')
//   return true;
// }

// async function retrieveCurrentStreams(userIds) {
//   let resolvePromise;
//   const promise = new Promise(resolve => resolvePromise = resolve);
//   const searchParams = new URLSearchParams(userIds.map(id => ['user_id', id]));
//   console.info('Requesting initial streams', userIds);
//   if (!searchParams.toString()) {
//     return Promise.resolve([]);
//   }
//   https.request(
//     `https://api.twitch.tv/helix/streams?${searchParams}`,
//     {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'client-id': process.env.TWITCH_CLIENT_ID,
//         'Authorization': `Bearer ${accessToken}`
//       }
//     },
//     twitchRes => {
//       bodify(twitchRes, body => {
//         console.info("Response for initial streams", body);
//         resolvePromise(body.data.map(e => ({
//           id: e.id,
//           title: e.title,
//           user_id: e.user_id,
//           user_name: e.user_name
//         })));
//       })
//     }).end();
//   return promise;
// }

// function retrieveChannels() {
//   return new Promise(resolve => {
//     https.get('https://cwtsite.com/api/channel',
//       (twitchRes) => {
//         bodify(twitchRes, body => {
//           console.info('Channels are', body.map(c => `${c.id} ${c.displayName}`));
//           resolve(body);
//         });
//       });
//   });
// }

// function retrieveCurrentTournament() {
//   let resolvePromise;
//   const promise = new Promise(resolve => resolvePromise = resolve);
//   https.get('https://cwtsite.com/api/tournament/current',
//     (twitchRes) => {
//       bodify(twitchRes, body => {
//         resolvePromise(body);
//       });
//     });
//   return promise;
// }

// function validateContentLength(req, res, raw) {
//   const contentLengthHeader = req.headers['content-length'];
//   if (contentLengthHeader == null) {
//     console.warn('No Content-Length header.');
//     endWithCode(res, 411);
//     return false
//   }

//   const contentLengthFactual = Buffer.byteLength(raw, 'utf8');
//   if (parseInt(contentLengthHeader) !== contentLengthFactual) {
//     console.error('Content-Length mismatch.');
//     endWithCode(res, 400);
//     return false
//   }

//   console.info('Content-Length is valid');
//   return true
// }

// function cors(req, res) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   res.setHeader("Access-Control-Allow-Headers", "*")
// }

// function endWithCode(res, code, payload) {
//   res.statusCode = code;
//   res.end(payload)
// }

// async function tearDown(code) {
//   //await revokeAccessToken();
//   server.close(console.error);
//   process.exit(code);
// }

// ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(sig => process.on(sig, async () => {
//   const timeout = setTimeout(async () => {
//     console.error(
//       "Exiting with code 2 because of timeout. " +
//       "Not all subscriptions have been unsubscribed.");
//     await tearDown();
//     process.exit(2);
//   }, 10000);
//   new Promise(resolve => shutdown = resolve)
//     .then(async () => {
//       clearTimeout(timeout);
//       console.info("All subscriptions have been successfully unsubscribed. Exiting");
//       await tearDown(0);
//     })
//     .catch(async () => {
//       clearTimeout(timeout);
//       console.info("Some or all subscription have failed to unsubscribe. Exiting");
//       await tearDown(1);
//     });
//   subscriptions.forEach(s => subUnsub(s, 'unsubscribe'));
// }));
