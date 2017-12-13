var net = require('net');
var http = require('http');

const commonConfig = require('../config.common');

let dataObj = {};

const indexArrayByField = (array, fieldName) => {
  let obj = {};
  for (let i = 0; i < array.length; i++) {
    obj[array[i][fieldName]] = array[i];
  }
  return obj;
};

var client = new net.Socket();
client.connect(commonConfig.TCP_PORT, commonConfig.TCP_ADDR, () => {
  console.log('Connected');
});

client.on('data', data => {
  let indexedData = indexArrayByField(JSON.parse(data), 'currencyPair');
  Object.getOwnPropertyNames(indexedData).forEach(currencyPair => {
    dataObj[currencyPair] = indexedData[currencyPair];
  });
  console.log(indexedData);
});

client.on('close', () => {
  console.log('Connection closed');
});
