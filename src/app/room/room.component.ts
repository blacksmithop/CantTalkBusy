import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { FormControl, Validators } from '@angular/forms';
import { ChatRoomService } from '../chat-room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

interface Message {
  body: string, author: string, system: boolean, time: Date, type: string,
  user: {
    username: string
  }
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.css', './users.css', './message.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class RoomComponent implements OnInit {
  // name of room
  @Input() roomName!: string;

  @Input() roomList!: [];

  myId!: string;
  receiver_id!: string;
  // list of users in room
  users: any[] = [];
  // Create room Modal
  modalRef?: BsModalRef;
  // Private chat Modal
  chatModalRef?: BsModalRef;
  // Create room input
  @Input() newRoomName!: string;
  // File upload
  fileToUpload: File | null = null;

  chatMessage = new FormControl('', [Validators.required]);
  privateMessage = new FormControl('', [Validators.required]);

  messages: Message[] = [];

  private_messages: {
    [key: string]: Message[]
  } = {};

  constructor(private Api: ChatRoomService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private http: HttpClient,
    private toastr: ToastrService) {
    this.roomName = this.route.snapshot.paramMap.get('roomName')!;

    // Get socket id (self)
    this.Api.getIdentity().subscribe((id: any) => {
      this.myId = id;
    });
  }

  // File upload
  handleFileInput(files: any) {
    this.fileToUpload = files.target.files[0];

    this.uploadImage(this.fileToUpload);
    this.fileToUpload = null;

    return this.toastr.success('Image sent!');
  }

  // Send image to backend
  uploadImage(image: any) {
    let formData = new FormData();
    formData.append('image_upload', image);
    this.http.post('http://localhost:3000/upload', formData).subscribe((res: any) => {
      this.Api.sendImage(res.url);
      this.chatMessage.reset();
    });

  }

  // Room creator Modal
  openRoomCreator(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  // Private chat Modal
  openPrivateChat(template: TemplateRef<any>, id: string) {
    this.receiver_id = id;
    if (this.receiver_id in this.private_messages) {
    }
    else {
      this.private_messages[this.receiver_id] = [];
    }
    this.chatModalRef = this.modalService.show(template);
  }

  sendPrivateMessage() {
    if (this.privateMessage.valid) {
      this.Api.sendPrivateMessage(this.privateMessage.value, this.receiver_id);
      this.private_messages[this.receiver_id].push({
        body: this.privateMessage.value,
        author: this.myId, system: false,
        time: new Date(),
        user: { username: 'You' },
        type: 'msg'
      });
      this.privateMessage.reset();
    }
  }


  onEnterPress(event: any) {
    if (event.key === "Enter") {
      return this.sendMessage();
    }
  }


  sendMessage() {
    if (this.chatMessage.valid) {

      this.Api.sendMessage(this.chatMessage.value);
      this.chatMessage.reset();
    }
  }
  ngOnInit(): void {
    // Get your socket id
    this.Api.getIdentity().subscribe((id: any) => {
      this.myId = id;
    });

    this.Api.setIdentity(this.roomName);

    // Get messages from server
    this.Api.OnRoomMessage().subscribe((data: any) => {

      this.messages.push({
        body: data.msg,
        author: data.author, system: false,
        time: new Date(),
        user: data.user,
        type: data.type
      });
    });

    this.Api.OnPrivateMessage().subscribe((data: any) => {
      if (this.receiver_id in this.private_messages) {
      }
      else {
        this.private_messages[this.receiver_id] = [];
      }

      this.private_messages[this.receiver_id].push({
        body: data.msg,
        author: data.author, system: false,
        time: new Date(),
        user: data.user,
        type: data.type
      });
    });


    // User join
    this.Api.OnUserJoined().subscribe((data: any) => {
      if (data.id != this.myId) {
        this.users.push(data);
      }
    });

    // User leave
    this.Api.OnUserLeft().subscribe((data: any) => {
      // delete from array
      this.users = this.users.filter(function (obj) {
        return obj.id !== data;
      });
    });

    this.Api.listRooms().subscribe((data: any) => {
      this.roomList = data;
    });

  }

  enterRoom(room_name: string) {
    this.Api.joinRoom(room_name);
    this.toastr.success('Joined room!', room_name);
    return this.router.navigate(['/room', room_name]);
  }

  //Create room
  createRoom() {
    if (this.newRoomName) {
      this.modalRef!.hide();
      this.roomName = this.newRoomName;

      this.toastr.success('Room Created!', this.newRoomName);
      this.Api.joinRoom(this.newRoomName);

      return this.router.navigate(['/room', this.newRoomName]);
    }
    else {
      return this.toastr.error('Room name is required!', 'Error');
    }
  }
}
