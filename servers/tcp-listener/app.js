var net = require('net');
var http = require('http')

const commonConfig = require('../config.common')

var client = new net.Socket();
client.connect(commonConfig.TCP_PORT, commonConfig.TCP_ADDR, function() {
	console.log('Connected');
	client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
});

client.on('close', function() {
	console.log('Connection closed');
});