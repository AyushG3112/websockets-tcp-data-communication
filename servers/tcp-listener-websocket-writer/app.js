var eventEmitter = new (require('events')).EventEmitter();
const commonConfig = require('../config.common');
const TCPListener = require('./lib/tcpListener');
const WebsocketWriter = require('./lib/websocketWriter');
const config = require('./config');
const tcpListener = new TCPListener(commonConfig.TCP_PORT, commonConfig.TCP_ADDR);
tcpListener.setEventEmitter(eventEmitter);
tcpListener.start();

const websocketWriter = new WebsocketWriter(config.SOCKET_PORT);
websocketWriter.setEventEmitter(eventEmitter);
websocketWriter.start();
