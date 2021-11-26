import { Component, OnInit } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { FormControl, Validators } from '@angular/forms';
import { ChatRoomService } from '../chat-room.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class RoomComponent implements OnInit {
  // name of room
  roomName: string;
  // client's socket id
  socketId: string = '';;
  // list of users in room
  users: string[] = [];

  chatMessage = new FormControl('', [Validators.maxLength(100), Validators.required]);
  messages = [{
    body: 'Hello', author: false, system: false, time: new Date()
  }]
  constructor(private Api: ChatRoomService,
    private route: ActivatedRoute) {
    this.roomName = this.route.snapshot.paramMap.get('roomName')!;

  }

  onEnterPress(event: any) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.chatMessage.valid) {
      this.messages.push({
        body: this.chatMessage.value, author: true,
        system: false, time: new Date()
      });
      this.Api.sendMessage(this.chatMessage.value);
      this.chatMessage.reset();
    }
  }
  ngOnInit(): void {
    // Get your socket id
    this.Api.getIdentity().subscribe((id: any) => {
      this.socketId = id;
    });

    // Get messages from server
    this.Api.OnRoomMessage().subscribe((data: any) =>
      this.messages.push({
        body: data,
        author: false, system: false,
        time: new Date()
      }));

    // Get list of active users
    this.Api.listUsers().subscribe((users: any) => {
      this.users = users;
      console.log(this.users);
    });

  }

}
