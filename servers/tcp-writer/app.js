const config = require('./config');
const TCPWriter = require('./lib/tcpWriter');

const tcpWriter = new TCPWriter(config.TCP_PORT, config.TCP_ADDR);
tcpWriter.start()