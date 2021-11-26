import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
//import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {
  constructor(private socket: Socket) { }
  id: string = '';

  getIdentity() {
    this.socket.emit('whoami');

    return this.socket.fromEvent('socket-id');

  }

  listUsers() {
    this.socket.emit('list users');

    return this.socket.fromEvent('users-list');
  }

  OnRoomMessage() {
    return this.socket.fromEvent('room message');
  }

  OnSystemMessage() {
    return this.socket.fromEvent('system message');
  }

  public sendMessage(message: string) {
    this.socket.emit('send message', message);
  }


}

