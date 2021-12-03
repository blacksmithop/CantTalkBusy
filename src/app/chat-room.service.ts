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

  setIdentity(room_name: string) {
    const session = JSON.parse(sessionStorage.getItem('session')!);
    session.room_name = room_name;
    this.socket.emit('set-identity', session);
  }

  // new message in room, (system messages handled in frontend)
  OnRoomMessage() {
    return this.socket.fromEvent('room message');
  }

  // new private message (WIP)
  OnPrivateMessage() {
    return this.socket.fromEvent('private message');
  }


  joinRoom(room_name: string) {
    this.socket.emit('join room', room_name);
  }

  listRooms() {
    return this.socket.fromEvent('list rooms');
  }


  // send message to room
  sendMessage(message: string) {
    this.socket.emit('send message', message);
  }

  // PM's only
  loadMessageHistory(receiver: string) {
    this.socket.emit('send private message', receiver);
  }
  // send message to user
  sendPrivateMessage(message: string, receiver: string, username: string) {
    this.socket.emit('send private message', { message: message, receiver: receiver, username: username });
  }

  sendImage(url: string) {
    this.socket.emit('send image', url);
  }


  onGiveIdentity() {
    return this.socket.fromEvent('request identity');
  }

  requestIdentity(id: string) {
    this.socket.emit('find user', id);
  }

  receiveIdentity(id: string) {
    return this.socket.fromEvent('give identity');
  }

  identifyToRequest(id: string) {
    const session = JSON.parse(sessionStorage.getItem('session')!);
    session.id = id;
    this.socket.emit('identify as', session);
  }

  // User events
  OnUserJoined() {
    return this.socket.fromEvent('user join');
  }

  OnUserLeft() {
    return this.socket.fromEvent('user leave');
  }

}

