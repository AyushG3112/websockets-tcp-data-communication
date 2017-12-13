const net = require('net');
let activeConnectionsCount = 0;
let totalConnectionsCount = 0;
const DataFetcher = require('./dataFetcher');
const config = require('../config');

class TCPWriter {
  constructor(tcpPort, tcpAddr) {
    this._addr = tcpAddr;
    this._port = tcpPort;
  }

  start() {
    var server = net.createServer(function(socket) {
      activeConnectionsCount += 1;
      totalConnectionsCount += 1;
      let connectionNumber = totalConnectionsCount;
      console.info('Connection ' + connectionNumber + ' Opened');
      const dataFetcher = new DataFetcher();
      let socketClosed = false;
      socket.on('close', () => {
        activeConnectionsCount--;
        console.info('Connection ' + connectionNumber + ' Closed');
        socketClosed = true;
      });
    
      let writer = () => {
        return dataFetcher
          .getProcessedData()
          .then(changedData => {
            if (changedData.length && !socketClosed) {
              socket.write(JSON.stringify(changedData));
            }
          })
          .catch(console.error)
          .then(() => {
            if (!socketClosed) {
              setTimeout(writer, config.refreshTimeMs);
            }
          });
      };
      writer();
    });
    
    server.listen(this._port, this._addr);
  }
}

module.exports = TCPWriter;
