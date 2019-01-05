var config = {
    beam: {
        botname: '',
        botpass: '',
        botoauth: '',
        ownername: '',
        ownerpass: '',
        owneroauth: '',
        connectTo: 3705, //id of the channel we're connecting to.
    },
    rethinkdb: {
        host: 'localhost',
        port: 28015,
        authKey: '',
        db: 'iBot'
    }

};
module.exports = config;