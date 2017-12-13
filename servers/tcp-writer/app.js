var net = require('net');
var http = require('http');
const commonConfig = require('../config.common');
const config = require('./config');
const dataFetcher = require('./lib/dataFetcher');
let cycle = 0;
let previousData = [];

var server = net.createServer(function(socket) {
  let socketClosed = false;
  socket.on('close', () => {
    console.info('Socket Closed');
    socketClosed = true;
  });
  let writer = () => {
    cycle += 1;
    return dataFetcher
      .getProcessedData()
      .then(changedData => {
        if (changedData.length && !socketClosed) {
          socket.write(JSON.stringify(changedData));
        } else {
          console.info('Skiping Cycle ' + cycle);
        }
      })
      .catch(console.log)
      .then(() => {
        if (!socketClosed) {
          setTimeout(writer, config.refreshTimeMs);
        }
      });
  };
  writer();
});

server.listen(commonConfig.TCP_PORT, commonConfig.TCP_ADDR);
