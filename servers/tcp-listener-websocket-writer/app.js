var net = require('net');
var http = require('http');
var eventEmitter = new (require('events')).EventEmitter();
const commonConfig = require('../config.common');
const io = require('socket.io')();
const utils = require('./lib/utility');
let activeClients = 0;

let dataObj = {};

var client = new net.Socket();
client.connect(commonConfig.TCP_PORT, commonConfig.TCP_ADDR, () => {
  console.log('Connected to TCP Server');
});

client.on('data', data => {
  let indexedData = utils.indexArrayByField(JSON.parse(data), 'currencyPair');
  Object.getOwnPropertyNames(indexedData).forEach(currencyPair => {
    dataObj[currencyPair] = indexedData[currencyPair];
  });
  if (activeClients > 0) {
    eventEmitter.emit('dataChanged', Object.getOwnPropertyNames(dataObj).map(x => dataObj[x]));
  } else {
    console.log('No WebSocket Clients connected. Skipping.');
  }
});

client.on('close', () => {
  console.log('Connection closed');
});

eventEmitter.on('dataChanged', data => {
  if (activeClients > 0) {
    io.emit('broadcast', data);
  }
});

io.on('connection', function(client) {
  activeClients += 1;
  client.on('disconnect', () => {
    console.log('disconnect');
    activeClients -= 1;
  });
  console.log('connected');
});

io.listen(3000);
