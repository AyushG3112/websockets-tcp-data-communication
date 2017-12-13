let activeClients = 0;
let dataObj = {};
const utils = require('./utility');
const net = require('net');

class TCPListener {
  constructor(tcpPort, tcpAddr) {
    this._addr = tcpAddr;
    this._port = tcpPort;
    this._client = new net.Socket();
  }

  setEventEmitter(eventEmitter) {
    this._eventEmitter = eventEmitter;
    this._eventEmitter.on('clientConnection', () => {
      activeClients += 1;
    });
    this._eventEmitter.on('clientDisconnection', () => {
      activeClients -= 1;
    });
  }

  start() {
    this._client.connect(this._port, this._addr, () => {
      console.log('Connected to TCP Server');
    });
    this._client.on('data', data => {
      let indexedData = utils.indexArrayByField(JSON.parse(data), 'currencyPair');
      Object.getOwnPropertyNames(indexedData).forEach(currencyPair => {
        dataObj[currencyPair] = indexedData[currencyPair];
      });
      if (activeClients > 0) {
        this._eventEmitter.emit(
          'dataChanged',
          Object.getOwnPropertyNames(dataObj).map(x => dataObj[x])
        );
      } else {
        console.log('No WebSocket Clients connected. Skipping.');
      }
    });

    this._client.on('close', () => {
      console.log('Connection closed');
    });
  }
}

module.exports = TCPListener;
