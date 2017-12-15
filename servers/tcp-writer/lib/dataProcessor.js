const trendIdentifiers = require('../mappings/trendIndentifiers');

class DataProcessor {
  constructor() {
    this.previousData = [];
  }

  setPreviousData(data) {
    this.previousData = data;
  }

  processData(data) {
    return data.split('\n').map(row => {
      let values = row.split(',');
      return {
        currencyPair: values[0],
        timestamp: new Date(parseInt(values[1])),
        bidPrice: Number(values[2] + values[3]),
        offerPrice: Number(values[4] + values[5]),
        high: Number(values[7]),
        low: Number(values[6]),
        open: Number(values[8])
      };
    });
  }

  addTrendsToData(processedData) {
    return processedData.map(dataPoint => {
      dataPoint.trends = {
        bidPrice: trendIdentifiers.SAME,
        offerPrice: trendIdentifiers.SAME,
        high: trendIdentifiers.SAME,
        low: trendIdentifiers.SAME
      };
      let oldDataPoint = this.previousData.find(x => x.currencyPair === dataPoint.currencyPair);
      if (!oldDataPoint) {
        return dataPoint;
      }

      let bidPriceDifference = dataPoint.bidPrice - oldDataPoint.bidPrice;
      let offerPriceDifference = dataPoint.offerPrice - oldDataPoint.offerPrice;
      let highDifference = dataPoint.high - oldDataPoint.high;
      let lowDifference = dataPoint.lowPrice - oldDataPoint.lowPrice;

      if (bidPriceDifference < 0) {
        dataPoint.trends.bidPrice = trendIdentifiers.DEC;
      } else if (bidPriceDifference > 0) {
        dataPoint.trends.bidPrice = trendIdentifiers.INC;
      }

      if (offerPriceDifference < 0) {
        dataPoint.trends.offerPrice = trendIdentifiers.DEC;
      } else if (offerPriceDifference > 0) {
        dataPoint.trends.offerPrice = trendIdentifiers.INC;
      }

      if (highDifference > 0) {
        dataPoint.trends.high = trendIdentifiers.INC;
      }

      if (lowDifference < 0) {
        dataPoint.trends.low = trendIdentifiers.DEC;
      }

      return dataPoint;
    });
  }

  getChangedDataWithTrends(processedData) {
    return this.addTrendsToData(processedData).filter(dataPoint => {
      return (
        this.previousData.length === 0 ||
        dataPoint.trends.bidPrice !== trendIdentifiers.SAME ||
        dataPoint.trends.offerPrice !== trendIdentifiers.SAME ||
        dataPoint.trends.high !== trendIdentifiers.SAME ||
        dataPoint.trends.low !== trendIdentifiers.SAME
      );
    });
  }
}

module.exports = DataProcessor;
