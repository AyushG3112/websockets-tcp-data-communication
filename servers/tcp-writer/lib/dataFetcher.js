var http = require('http');
const commonConfig = require('../../config.common');
const config = require('../config');
const dataProcessor = require('./dataProcessor');

class DataFetcher {
  getDataFromSource() {
    return new Promise((resolve, reject) => {
      http
        .get(config.dataUri, res => {
          let data = '';
          res.on('data', chunk => (data = data + chunk));
          res.on('end', () => resolve(data.trim()));
          res.on('error', reject);
        })
        .on('error', reject);
    });
  }

  getProcessedData() {
    return this.getDataFromSource().then(data => {
      let processedData = dataProcessor.processData(data);
      let changedData = dataProcessor.getChangedDataWithTrends(processedData);
      dataProcessor.setPreviousData(processedData);
      return changedData;
    });
  }
}

module.exports = new DataFetcher();
