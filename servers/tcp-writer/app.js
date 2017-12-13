var net = require('net');
var http = require('http');
const commonConfig = require('../config.common');
const config = require('./config');
const DataFetcher = require('./lib/dataFetcher');
let previousData = [];
let activeConnectionsCount = 0;
let totalConnectionsCount = 0;
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

server.listen(commonConfig.TCP_PORT, commonConfig.TCP_ADDR);
