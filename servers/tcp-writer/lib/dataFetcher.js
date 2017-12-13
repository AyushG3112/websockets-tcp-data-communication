var http = require('http');
const config = require('../config');
const DataProcessor = require('./dataProcessor');

class DataFetcher {
  constructor() {
    this._dataProcessor = new DataProcessor();
  }
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
      let processedData = this._dataProcessor.processData(data);
      let changedData = this._dataProcessor.getChangedDataWithTrends(processedData);
      this._dataProcessor.setPreviousData(processedData);
      return changedData;
    });
  }
}

module.exports = DataFetcher;
