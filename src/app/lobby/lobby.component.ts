import { Component, ElementRef, OnInit } from '@angular/core';

const chats = [
  {
    username: 'John',
    fname: 'John',
    lname: 'Doe',
    timestamp: '4:20',
    msg: {
      content: 'Hello, how are you?',
      read: true,
      forwaded: true
    }
  },
  {
    username: 'Amy',
    fname: 'Amy',
    lname: 'Wick',
    timestamp: '14:10',
    msg: {
      content: 'Let\'s meet up!',
      read: true,
      forwaded: false
    }
  }, {
    username: 'Tim',
    fname: 'Tim',
    lname: 'Wong',
    timestamp: '3:33',
    msg: {
      content: 'Meet for lunch?',
      read: false,
      forwaded: true
    }
  },
  {
    username: 'John',
    fname: 'John',
    lname: 'Doe',
    timestamp: '4:20',
    msg: {
      content: 'Hello, how are you?',
      read: true,
      forwaded: true
    }
  },
  {
    username: 'Amy',
    fname: 'Amy',
    lname: 'Wick',
    timestamp: '14:10',
    msg: {
      content: 'Let\'s meet up!',
      read: true,
      forwaded: false
    }
  }, {
    username: 'Tim',
    fname: 'Tim',
    lname: 'Wong',
    timestamp: '3:33',
    msg: {
      content: 'Meet for lunch?',
      read: false,
      forwaded: true
    }
  },
  {
    username: 'John',
    fname: 'John',
    lname: 'Doe',
    timestamp: '4:20',
    msg: {
      content: 'Hello, how are you?',
      read: true,
      forwaded: true
    }
  },
  {
    username: 'Amy',
    fname: 'Amy',
    lname: 'Wick',
    timestamp: '14:10',
    msg: {
      content: 'Let\'s meet up!',
      read: true,
      forwaded: false
    }
  }, {
    username: 'Tim',
    fname: 'Tim',
    lname: 'Wong',
    timestamp: '3:33',
    msg: {
      content: 'Meet for lunch?',
      read: false,
      forwaded: true
    }
  }
];

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  // declare interface for chats
  chats: any[] = chats;


  constructor() { }

  ngOnInit(): void {
  }



}
