//requires
let util = require('util');
//let EventEmmiter = require('events');
let EventEmitter = require('events').EventEmitter;
//EventEmmiter = new EventEmmiter();
//let botConfig = require('./config.js');
//module
//NEED TO CHANGE THIS TO THE NEW MIXER-NODE VERSION
//change all of this to a class
class constellation extends EventEmitter {
    constructor(channelId, log) {
        super();
        const Carina = require('carina').Carina;
        const ws = require('ws');
        Carina.WebSocket = ws;
        /// const channelId = 540276;
        //const channelId = 582310;
        const ca = new Carina({ isBot: true }).open();

        ca.subscribe(`channel:${channelId}:followed`, data => {
            //console.log(`followed`);
            //  console.log(data);
            log.info(`followed event in contellation ` + data);
            this.emit('event', { type: 'followed', info: data });


        });
        ca.subscribe(`channel:${channelId}:hosted`, data => {
            log.info(`hosted event in contellation ` + data);
            this.emit('event', { type: 'hosted', info: data });
        });
        ca.subscribe(`channel:${channelId}:status`, data => {
            log.info(`channel status event in contellation ` + data);
            this.emit('event', { type: 'status', info: data });
        });
        ca.subscribe(`channel:${channelId}:subscribed`, data => {
            this.emit('event', { type: 'subscribed', info: data });
        });
        ca.subscribe(`channel:${channelId}:resubscribed`, data => {
            this.emit('event', { type: 'resubscribed', info: data });
        });
        ca.subscribe(`channel:${channelId}:update`, data => {
            log.info(`update event in contellation ` + data);
            //log(`constellation update event ` + data);
            //console.log(data);
            if (data.hasOwnProperty('type')) {
                //game has been changed
                this.emit('event', { type: 'game update', info: data });
            } else if (data.hasOwnProperty('channel')) {
                this.emit('event', { type: 'update', info: data });
            } else if (data.hasOwnProperty('name')) {
                this.emit('event', { type: 'titleChanged', info: data });
            } else if (data.hasOwnProperty('preferences')) {
                this.emit('event', { type: 'preferencesChanged', info: data });
            } else {
                this.emit('event', { type: 'unknown', info: data });
            }
        });
        ca.subscribe(`interactive:${channelId}:connect`, data => {
            log.info(`interactive connect event in contellation ` + data);
            this.emit('event', { type: 'gameconnect', info: data });
        });
        ca.subscribe(`user:${channelId}:update`, data => {
            log.info(`user update event in contellation ` + data);
            this.emit('event', { type: 'userupdate', info: data });
        });

    }
}

module.exports = constellation;