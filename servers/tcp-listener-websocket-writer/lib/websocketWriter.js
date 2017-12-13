const io = require('socket.io')();

class WebsocketWriter {
  constructor(port) {
    this._port = port;
  }

  setEventEmitter(eventEmitter) {
    this._eventEmitter = eventEmitter;
    this._eventEmitter.on('dataChanged', data => {
      io.emit('broadcast', data);
    });
  }

  start() {
    io.on('connection', client => {
      this._eventEmitter.emit('clientConnection', {});
      client.on('disconnect', () => {
        this._eventEmitter.emit('clientDisconnection', {});
      });
    });

    io.listen(this._port);
  }
}

module.exports = WebsocketWriter;
