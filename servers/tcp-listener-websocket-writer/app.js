var eventEmitter = new (require('events')).EventEmitter();
const TCPListener = require('./lib/tcpListener');
const WebsocketWriter = require('./lib/websocketWriter');
const config = require('./config');

const tcpListener = new TCPListener(config.TCP_PORT, config.TCP_ADDR);
tcpListener.setEventEmitter(eventEmitter);
tcpListener.start();

const websocketWriter = new WebsocketWriter(config.SOCKET_PORT);
websocketWriter.setEventEmitter(eventEmitter);
websocketWriter.start();
