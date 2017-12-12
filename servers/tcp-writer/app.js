var net = require('net');
var http = require('http');
const commonConfig = require('../config.common')
const config = require('./config')
let cycle = 0;
let previousData = []

const trendIdentifiers = {
    INC: 'INC',
    SAME: 'SAME',
    DEC: 'DEC',
}
const processData = (data) => data.split("\n").map(row => {
    let values = row.split(",");
    return {
        currencyPair: values[0],
        timestamp: new Date(parseInt(values[1])),
        bidPrice: Number(values[2] + values[3]),
        offerPrice: Number(values[4] + values[5]),
        high: Number(values[6]),
        low: Number(values[7]),
        open: Number(values[8]),
    }
});

const addTrendsToData = (processedData) => {
    return processedData.map(dataPoint => {
        dataPoint.trends = {
            bidPrice: trendIdentifiers.SAME,
            offerPrice: trendIdentifiers.SAME,
            high: trendIdentifiers.SAME,
            low: trendIdentifiers.SAME,
        }
        let oldDataPoint = previousData.find(x => x.currencyPair === dataPoint.currencyPair)
        if(!oldDataPoint) {
            return dataPoint;
        }

        let bidPriceDifference = dataPoint.bidPrice - oldDataPoint.bidPrice;
        let offerPriceDifference = dataPoint.offerPrice - oldDataPoint.offerPrice;
        let highDifference = dataPoint.high - oldDataPoint.high;
        let lowDifference = dataPoint.lowPrice - oldDataPoint.lowPrice;

        if(bidPriceDifference < 0) {
            dataPoint.trends.bidPrice = trendIdentifiers.DEC
        } else if(bidPriceDifference > 0) {
            dataPoint.trends.bidPrice = trendIdentifiers.INC
        }

        if(offerPriceDifference < 0) {
            dataPoint.trends.offerPrice = trendIdentifiers.DEC
        } else if(offerPriceDifference > 0) {
            dataPoint.trends.offerPrice = trendIdentifiers.INC
        }

        if(highDifference > 0) {
            dataPoint.trends.high = trendIdentifiers.INC
        }

        if(lowDifference < 0) {
            dataPoint.trends.low = trendIdentifiers.DEC
        }

        
        return dataPoint;
    })
}
    

const getChangedDataWithTrends = (processedData) => {
    return addTrendsToData(processedData).filter(dataPoint => {
        return previousData.length === 0 || dataPoint.trends.bidPrice !== trendIdentifiers.SAME ||
        dataPoint.trends.offerPrice !== trendIdentifiers.SAME ||
        dataPoint.trends.high !== trendIdentifiers.SAME ||
        dataPoint.trends.low !== trendIdentifiers.SAME
    })
}
var server = net.createServer(function(socket) {
    let writer  = () => {
        cycle += 1;
        return getData()
        .then((data) => {
            let processedData = processData(data)
            let changedData = getChangedDataWithTrends(processedData)
            if(changedData.length) {
                previousData = processedData;
                socket.write(JSON.stringify(changedData))
            } else {
                console.log('No change. Skiping Cycle ' + cycle)
            }
        })
        .catch(console.log)
        .then(() => {
            setTimeout(writer, config.refreshTimeMs)            
        })
    }
    writer()    
});

const getData = () => {
    return new Promise((resolve, reject) => {
        http.get(config.dataUri, (res) => {
            let data = '';
            res.on('data', (chunk) => data = data + chunk);
            res.on('end', () => resolve(data.trim()));
            res.on('error', reject)
        }).on('error', reject)
    })
}

server.listen(commonConfig.TCP_PORT, commonConfig.TCP_ADDR);