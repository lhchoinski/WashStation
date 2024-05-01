import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

import * as io from "socket.io-client";


@Injectable()
export class MiddlewareCloudProvider {

  host: string = 'wss://wsapi.washstation.pt';
  socket: any = null;
  incomingPkgObs: Subject<any> = new Subject<any>();
  incomingMsgObs: Subject<any> = new Subject<any>();

  storage: any = new Storage({});
  sessionToken: string = null;

  constructor() {
    this.storage.get('id_token').then(idToken => { this.sessionToken = idToken; });
  }

  connect(userId) {
    if (this.socket || !userId) return;

    // NOTE: Check this workflow (connect/reconnect) for multiple joins
    this.socket = io.connect(this.host,  { reconnection: true });
    this.socket.on('connect', () => {
      this.socket.emit('join', { userId: userId });
    }).emit('authenticate', { token: this.sessionToken });

    this.socket.on('reconnect', () => {
      this.socket.emit('join', { userId: userId });
      this.socket.emit('authenticate', { token: this.sessionToken });
    });

    // Incomming messages.
    this.socket.on('send', (pkg) => {
      try {
        if (pkg.hasOwnProperty('vmconnected') && !pkg.vmconnected) {}
        this.incomingPkgObs.next(pkg);
      } catch (e) {}
    });

    this.socket.on('chargeAlert', (msg) => {
      this.incomingMsgObs.next(msg);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  send(pkg) {
    if (this.socket) {
      this.socket.emit('send1', pkg);      
    }
  }

  getPkg(): Observable<any> {
    return this.incomingPkgObs.asObservable();
  }

  getPushNotif(): Observable<any> {
    return this.incomingMsgObs.asObservable();
  }

  subscribeLaundry(laundryId) {
    if (this.socket) {
      this.socket.emit('subscribe', { room: `cloud.${laundryId}` });
      this.socket.emit('vmconnected', `cloud.${laundryId}`);
    }
  }

  unsubscribeLaundry(laundryId) {
    if (this.socket) {
      this.socket.emit('unsubscribe', { room: `cloud.${laundryId}` });
    }
  }
}
