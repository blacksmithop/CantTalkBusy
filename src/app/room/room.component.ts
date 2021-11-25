import { Component, OnInit } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class RoomComponent implements OnInit {
  roomName: string;
  chatMessage = new FormControl('', [Validators.maxLength(100), Validators.required]);
  messages = [{
    body: 'Hello', author: false
  }]
  constructor() {
    this.roomName = 'Room 1';
  }

  sendMessage() {
    if (this.chatMessage.valid) {
      console.log(this.chatMessage.value);
      this.messages.push({ body: this.chatMessage.value, author: true });

      this.chatMessage.reset();
    }
  }
  ngOnInit(): void {

  }
}
