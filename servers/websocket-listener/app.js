const config = require('./config')
const io = require('socket.io-client')

const socket = io(config.socketUri);
socket.on('connect', function() {
    console.log('connected');
});

socket.on('broadcast', (data) => console.log(data));