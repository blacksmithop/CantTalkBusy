import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.loginForm = this.fb.group({
      band: this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      }),
    });
  }


  ngOnInit(): void {
  }

}
