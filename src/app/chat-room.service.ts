import { Injectable } from '@angular/core';
import { Message } from './message';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/internal/Observable';
import { FormBuilder, FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {
  constructor(private socket: Socket,
    private formBuilder: FormBuilder) { }


  public sendMessage(message: Message) {
    this.socket.emit('new-message', message);
  }

  public getMessages = () => {
    return new Observable((observer) => {
      this.socket.on('new-message', (message: Message) => {
        observer.next(message);
      });
    });
  }
}

