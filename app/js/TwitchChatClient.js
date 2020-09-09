//import WebSocket from 'ws'

const WebSocket = require('ws');
let EventEmitter = require('events').EventEmitter;
const { parse } = require("tekko");
let camelcaseKeys = require("camelcase-keys");

const { gt, isEmpty, isFinite, toLower, toNumber, toUpper } = require('lodash');


//import camelcaseKeys from 'camelcase-keys';
//const {gt} = require('lodash/gt')
//const { isEmpty } = require('lodash/isEmpty')
// import isFinite from 'lodash/isFinite'
// import toLower from 'lodash/toLower'
// import toNumber from 'lodash/toNumber'
// import toUpper from 'lodash/toUpper'

class TwitchChatClient extends EventEmitter {


    constructor(Token, isStreamer, isConnected, authDB, log, io) {
        super();
        let self = this;

        this.KEEP_ALIVE_PING_TIMEOUT = 150000;
        this.KEEP_ALIVE_RECONNECT_TIMEOUT = 200000;
        this._log = log;
        this._io = io;


        const client_id = 'gp762nuuoqcoxypju8c569th9wz7q5'
        const refresh_token = '8tm6mlz5f1657hlsno8o48tka14435b4qtwq10wnm1jz9w7thv'
        this.token = 'oauth:lx71o93103qho7pc2onpz2ktprnsrp';
        this.username = 'schusteruk';
        const priority = 1;
        this.isReady = () => this._ws.readyState === 1;
        /**
         * Send message to Twitch
         */
        this.send = async(message) => {
            this._ws.emit('message', message);
            const [, command, argv = ''] = /^(\w+) (.+)/.exec(message);
            const args = argv.split(' ');
            // In the future, `args` can be used to mock more complex client-server
            // interaction.
            // Mock client-server interactions.
            switch (command) {
                case 'PASS':
                    {
                        this.isTokenValid = args[0] !== 'oauth:INVALID_TOKEN';
                        if (!this.isTokenValid) {
                            this.emit('message', commands.NOTICE.AUTHENTICATION_FAILED);
                        }
                        break;
                    }
                case 'NICK':
                    {
                        // Mock successful connections.
                        if (this.isTokenValid) {
                            this.emit('message', commands.WELCOME.replace(/<user>/g, args[0]));
                            if (!args[0].startsWith('justinfan')) {
                                this.emit('message', tags.GLOBALUSERSTATE);
                            }
                        }
                        break;
                    }
                case 'JOIN':
                    // Mock channel JOINs.
                    //this.emit('message', membership.JOIN);
                    //this.emit('message', tags.ROOMSTATE.JOIN);
                    //this.emit('message', tags.USERSTATE.JOIN);
                    break;
                case 'PRIVMSG':
                    this.emit('message', tags.USERSTATE.JOIN);
                    break;
                default:
                    // No default.
            }
        };
        this.disconnect = () => {
            this._handleKeepAliveReset();
            this._ws.close();
        };

        //`${protocol}://${server}:${port}`
        //wss://irc-ws.chat.twitch.tv:443
        this._ws = new WebSocket('wss://irc-ws.chat.twitch.tv');

        this._ws.onopen = this._handleOpen.bind(this);
        this._ws.onmessage = this._handleMessage.bind(this);
        this._ws.onerror = this._handleError.bind(this);
        this._ws.onclose = this._handleClose.bind(this);

        this.say = this._sendMessageToTwitchChat.bind(this);
        this.logMessage = this._logMessage.bind(this);

    }

    /*     Capabilities() {
            Capabilities["tags"] = "twitch.tv/tags";
            Capabilities["commands"] = "twitch.tv/commands";
            Capabilities["membership"] = "twitch.tv/membership";
        }; */

    _isUserAnonymous() {
        return this.username;
    }
    _handleOpen() {
        // Register for Twitch-specific capabilities.


        this._ws.send(`CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership `);
        //this.send(`CAP REQ :${Object.values(Capabilities).join(' ')}`, { priority })
        // Authenticate.
        //const { token, username } = this._options;
        this._ws.send(`PASS ${this.token}`);
        this._ws.send(`NICK ${this.username}`);
        this._ws.send(`JOIN #${this.username}`);
    }

    _sendMessageToTwitchChat(message, io) {

        try {
            this._ws.send(`PRIVMSG #${this.username} :${message}`);
            let avatarUrl = "https://static-cdn.jtvnw.net/jtv_user_pictures/64f4dbcc-6c77-49ab-9f45-5489433536c3-profile_image-70x70.png";
            this._io.emit('message', avatarUrl, 'Broadcaster', this.username, message, false);
        } catch (error) {
            this.logMessage(error);
        }


    }


    _logMessage(message) {
        this._log.info(message)

    }


    // _handleMessage(messageEvent) {
    //     const rawMessage = messageEvent.data.toString();
    //     try {
    //         this._handleKeepAlive();
    //         const messages = baseParser(rawMessage, this._options.username);
    //         messages.forEach(message => {
    //             const event = message.command || '';
    //             this._log.debug('> %s %s', event, JSON.stringify(Object.assign(Object.assign({}, message), { _raw: undefined })));
    //             // Handle authentication failure.
    //             if (utils.isAuthenticationFailedMessage(message)) {
    //                 this.emit(ChatEvents.AUTHENTICATION_FAILED, Object.assign(Object.assign({}, message), { event: ChatEvents.AUTHENTICATION_FAILED }));
    //                 this.disconnect();
    //             } else {
    //                 // Handle PING/PONG.
    //                 if (message.command === Commands.PING) {
    //                     this.send('PONG :tmi.twitch.tv', { priority });
    //                 }
    //                 // Handle successful connections.
    //                 if (this._isUserAnonymous()) {
    //                     if (message.command === Commands.WELCOME) {
    //                         this.emit(ChatEvents.CONNECTED, Object.assign(Object.assign({}, message), { event: ChatEvents.CONNECTED }));
    //                     }
    //                 } else {
    //                     if (message.command === Commands.GLOBAL_USER_STATE) {
    //                         this.emit(ChatEvents.CONNECTED, Object.assign(Object.assign({}, message), { event: ChatEvents.CONNECTED }));
    //                     }
    //                 }
    //                 // Handle RECONNECT.
    //                 if (message.command === Commands.RECONNECT) {
    //                     this.emit(ChatEvents.RECONNECT, Object.assign(Object.assign({}, message), { event: ChatEvents.RECONNECT }));
    //                 }
    //             }
    //             // Emit all messages.
    //             this.emit("*", message);
    //             //this.emit(ChatEvents.ALL, message);
    //         });
    //     } catch (error) {
    //         const title = 'Parsing error encountered';
    //         const query = stringify({ title, body: rawMessage });
    //         this._log.error('Parsing error encountered. Please create an issue: %s', `https://github.com/twitch-js/twitch-js/issues/new?${query}`, error);
    //         //const errorMessage = new Errors.ParseError(error, rawMessage);
    //         this.emit(errorMessage.command, errorMessage);
    //         this.emit(ChatEvents.ALL, errorMessage);
    //         throw errorMessage;
    //     } finally {
    //         const message = {
    //             _raw: rawMessage,
    //             timestamp: new Date(),
    //         };
    //         this.emit(ChatEvents.RAW, message);
    //     }
    // }



    // AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED'
    // WELCOME = '001',
    // CONNECTED = 'CONNECTED',
    //RECONNECT = 'RECONNECT',
    //RAW = 'RAW',
    //  GLOBAL_USER_STATE = 'GLOBALUSERSTATE'
    _handleMessage(messageEvent) {
            const rawMessage = messageEvent.data.toString();
            try {
                this._handleKeepAlive();
                this._log.info(rawMessage);
                const messages = this.base(rawMessage, this.username);
                messages.forEach(message => {
                    const event = message.command || '';
                    this._log.debug('> %s %s', event, JSON.stringify(Object.assign(Object.assign({}, message), { _raw: undefined })));
                    // Handle authentication failure.
                    if (this.isAuthenticationFailedMessage(message)) {
                        this.emit('AUTHENTICATION_FAILED', Object.assign(Object.assign({}, message), { event: 'AUTHENTICATION_FAILED' }));
                        this.disconnect();
                    } else {
                        // Handle PING/PONG.
                        if (message.command === 'PING') {
                            this.send('PONG :tmi.twitch.tv');
                        }
                        // Handle successful connections.
                        if (this._isUserAnonymous()) {
                            if (message.command === '001') {
                                //connected to chat
                                this._io.emit('twitchChatConnected');
                                this._ws.emit('CONNECTED', Object.assign(Object.assign({}, message), { event: 'CONNECTED' }));
                            }
                        } else {
                            if (message.command === 'GLOBALUSERSTATE') {
                                this._ws.emit('CONNECTED', Object.assign(Object.assign({}, message), { event: 'CONNECTED' }));
                            }
                        }
                        // Handle RECONNECT.
                        if (message.command === 'RECONNECT') {
                            this._ws.emit('RECONNECT', Object.assign(Object.assign({}, message), { event: 'RECONNECT' }));
                        }

                        if (message.command === 'PRIVMSG') {
                            //this.send('PRIVMSG', Object.assign(Object.assign({}, message), { event: 'PRIVMSG' }));
                            //this._ws.send('PRIVMSG #schusteruk :This is a sample message')
                            this.emit('PRIVMSG', message);
                        }


                    }
                    // Emit all messages.
                    this._ws.emit("*", message);
                    //this.emit(ChatEvents.ALL, message);
                });
            } catch (error) {
                const title = 'Parsing error encountered';
                const query = stringify({ title, body: rawMessage });
                this._log.error('Parsing error encountered. Please create an issue: %s', `https://github.com/twitch-js/twitch-js/issues/new?${query}`, error);
                //const errorMessage = new Errors.ParseError(error, rawMessage);
                this.emit(errorMessage.command, errorMessage);
                this.emit('*', errorMessage);
                throw errorMessage;
            } finally {
                const message = {
                    _raw: rawMessage,
                    timestamp: new Date(),
                };
                this.emit('RAW', message);
            }
        }
        /*     _handleError(messageEvent) {
                const message = {
                    timestamp: new Date(),
                    event: ChatEvents.ERROR_ENCOUNTERED,
                    messageEvent,
                };
                this.emit(ChatEvents.ERROR_ENCOUNTERED, message);
                this.emit(ChatEvents.ALL, message);
            } */


    // ERROR_ENCOUNTERED = 'ERROR_ENCOUNTERED',
    _handleError(messageEvent) {
        const message = {
            timestamp: new Date(),
            event: 'ERROR_ENCOUNTERED',
            messageEvent,
        };
        this.emit('ERROR_ENCOUNTERED', message);
        this.emit('*', message);
    }

    //DISCONNECTED = 'DISCONNECTED',
    _handleClose(messageEvent) {
        const message = {
            timestamp: new Date(),
            event: 'DISCONNECTED',
            messageEvent,
        };
        this.emit('DISCONNECTED', message);
        this.emit('*', message);
    }


    /*     _handleClose(messageEvent) {
            const message = {
                timestamp: new Date(),
                event: ChatEvents.DISCONNECTED,
                messageEvent,
            };
            this.emit(ChatEvents.DISCONNECTED, message);
            this.emit(ChatEvents.ALL, message);
        } */

    /*     _handleKeepAlive() {
            this._handleKeepAliveReset();
            if (this.isReady()) {
                this._pingTimeoutId = setTimeout(() => this.send(Commands.PING, { priority }), constants.KEEP_ALIVE_PING_TIMEOUT);
            }
            this._reconnectTimeoutId = setTimeout(() => this.emit(ChatEvents.RECONNECT, {}), constants.KEEP_ALIVE_RECONNECT_TIMEOUT);
        } */

    //PING = 'PING'
    //RECONNECT = 'RECONNECT'
    _handleKeepAlive() {
        this._handleKeepAliveReset();
        if (this.isReady()) {
            this._pingTimeoutId = setTimeout(() => this._ws.send('PING'), this.KEEP_ALIVE_PING_TIMEOUT);
        }
        this._reconnectTimeoutId = setTimeout(() => this._ws.emit('RECONNECT', {}), this.KEEP_ALIVE_RECONNECT_TIMEOUT);
    }
    _handleKeepAliveReset() {
        clearTimeout(this._pingTimeoutId);
        clearTimeout(this._reconnectTimeoutId);
        this._pingTimeoutId = undefined;
        this._reconnectTimeoutId = undefined;
    }


    base = (rawMessages, username) => {
        const rawMessagesV = rawMessages.split(/\r?\n/g);
        return rawMessagesV.reduce((messages, rawMessage) => {
            if (!rawMessage.length) {
                return messages;
            }
            const {
                command,
                tags = {},
                prefix: { name, user, host } = {
                    name: undefined,
                    user: undefined,
                    host: undefined,
                },
                params: [channel, message],
            } = parse(rawMessage);
            const timestamp = String(tags['tmi-sent-ts']) || Date.now().toString();
            const messageTags = isEmpty(tags) ? {} : camelcaseKeys(tags);
            const messageUsername = this.theUsername(host, name, user, messageTags.login, messageTags.username, messageTags.displayName);
            const baseMessage = {
                _raw: rawMessage,
                timestamp: this.generalTimestamp(timestamp),
                command: command,
                event: command,
                channel: channel !== '*' ? channel : '',
                username: messageUsername,
                isSelf: typeof messageUsername === 'string' &&
                    toLower(username) === messageUsername,
                tags: messageTags,
                message,
            };
            return [...messages, baseMessage];
        }, []);
    };





    theUsername = (...maybeUsernames) => maybeUsernames.reduce((maybeUsername, name) => {
        if (typeof name !== 'string') {
            return maybeUsername;
        }
        if (name === 'tmi.twitch.tv') {
            return 'tmi.twitch.tv';
        }
        return toLower(name).split('.')[0];
    }, undefined);


    generalTimestamp = (maybeTimestamp) => {
        const timestamp = new Date(parseInt(maybeTimestamp, 10));
        return timestamp.toString() !== 'Invalid Date' ? timestamp : new Date();
    };


    //NOTICE = 'NOTICE',
    isAuthenticationFailedMessage = (message) => typeof message !== 'undefined' &&
        message.command === 'NOTICE' &&
        message.channel === '' &&
        message.message === 'Login authentication failed';
}

module.exports = TwitchChatClient;