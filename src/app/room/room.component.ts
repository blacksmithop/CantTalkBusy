import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { FormControl, Validators } from '@angular/forms';
import { ChatRoomService } from '../chat-room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class RoomComponent implements OnInit {
  // name of room
  @Input() roomName!: string;

  @Input() roomList!: [];

  myId!: string;
  // list of users in room
  users: any[] = [];
  // Create room Modal
  modalRef?: BsModalRef;
  // Create room input
  @Input() newRoomName!: string;
  // File upload
  fileToUpload: File | null = null;

  chatMessage = new FormControl('', [Validators.maxLength(100), Validators.required]);
  messages = [{
    body: `Welcome!`, author: 'socket_id', system: false, time: new Date(),
    user: {
      username: 'System',
    }
  }]
  constructor(private Api: ChatRoomService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private http: HttpClient,
    private toastr: ToastrService) {
    this.roomName = this.route.snapshot.paramMap.get('roomName')!;

    this.Api.getIdentity().subscribe((id: any) => {
      // get your Id
      this.myId = id;
    });
  }

  handleFileInput(files: any) {
    this.fileToUpload = files.target.files.item(0);
    console.log(this.fileToUpload);
    this.uploadImage(this.fileToUpload);
    this.fileToUpload = null;
    console.log(this.fileToUpload);

    return this.toastr.success('Image sent!');
  }

  // Image upload
  uploadImage(image: any) {
    this.http.post('http://localhost:3000/upload', { image: image }).subscribe(res => {
      console.log(res);
    });
  }

  // Modal
  openRoomCreator(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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
        user: data.user
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
