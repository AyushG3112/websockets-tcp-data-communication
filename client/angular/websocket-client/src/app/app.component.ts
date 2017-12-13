import { Component } from '@angular/core';
import io from 'socket.io-client';
import { environment } from '../environments/environment.prod';

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
  }

  ngOnInit() {
    this.socket = io(environment.socketUri);
    this.socket.on('connect', function() {
      console.log('connected');
    });

    this.socket.on('broadcast', (data) => this.handleData(data));
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

  handleData(data) {
    this.latestData = data;
  }
}
