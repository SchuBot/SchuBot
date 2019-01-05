//requires
let util = require('util');
let events = require('events');
//let botConfig = require('./config.js');
//module
//NEED TO CHANGE THIS TO THE NEW MIXER-NODE VERSION
let obj = function() {
    const Carina = require('carina').Carina;
    const ws = require('ws');
    Carina.WebSocket = ws;
    /// const channelId = 540276;
    const channelId = 582310
    const ca = new Carina({ isBot: true }).open();
    let self = this;
    ca.subscribe(`channel:${channelId}:followed`, data => {
        //console.log(`followed`);
        //  console.log(data);
        console.log(`followed event in contellation ` + data);
        self.emit('event', { type: 'followed', info: data });
    });
    ca.subscribe(`channel:${channelId}:hosted`, data => {
        console.log(`hosted event in contellation ` + data);
        self.emit('event', { type: 'hosted', info: data });
    });
    ca.subscribe(`channel:${channelId}:status`, data => {
        console.log(`channel status event in contellation ` + data);
        self.emit('event', { type: 'status', info: data });
    });
    ca.subscribe(`channel:${channelId}:subscribed`, data => {
        self.emit('event', { type: 'subscribed', info: data });
    });
    ca.subscribe(`channel:${channelId}:resubscribed`, data => {
        self.emit('event', { type: 'resubscribed', info: data });
    });
    ca.subscribe(`channel:${channelId}:update`, data => {
        console.log(`update event in contellation ` + data);
        //console.log(data);
        self.emit('event', { type: 'update', info: data });
    });
    ca.subscribe(`interactive:${channelId}:connect`, data => {
        console.log(`interactive connect event in contellation ` + data);
        self.emit('event', { type: 'gameconnect', info: data });
    });

    ca.subscribe(`user:${channelId}:update`, data => {
        console.log(`user update event in contellation ` + data);
        self.emit('event', { type: 'userupdate', info: data });
    });


};
obj.prototype = new events.EventEmitter;
module.exports = obj;