var net = require('net');
var http = require('http');
var eventEmitter = new (require('events')).EventEmitter();
const commonConfig = require('../config.common');
const utils = require('./lib/utility');
const TCPListener = require('./lib/tcpListener');
const WebsocketWriter = require('./lib/websocketWriter');

const tcpListener = new TCPListener(commonConfig.TCP_PORT, commonConfig.TCP_ADDR);
tcpListener.setEventEmitter(eventEmitter);
tcpListener.start();

const websocketWriter = new WebsocketWriter(3000);
websocketWriter.setEventEmitter(eventEmitter);
websocketWriter.start();
