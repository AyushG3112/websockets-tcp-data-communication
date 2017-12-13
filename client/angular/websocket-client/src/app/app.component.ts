import { Component } from '@angular/core';
import io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  socket: any;
  latestData: any[];
  constructor() {
    this.latestData = [];
    this.socket = io('http://localhost:3000');
    this.socket.on('connect', function() {
      console.log('connected');
    });

    this.socket.on('broadcast', data => {
      this.latestData = data;
    });
  }

  getTableClass(trend) {
    switch (trend) {
      case 'INC':
        return 'inc';
      case 'DEC':
        return 'dec';

      default:
        return 'default';
    }
  }
}
