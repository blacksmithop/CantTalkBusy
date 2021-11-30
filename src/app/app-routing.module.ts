import { Host, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'room/:roomName', component: RoomComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
