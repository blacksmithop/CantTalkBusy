import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;

  @ViewChild('login') loginDiv!: ElementRef;
  @ViewChild('register') registerDiv!: ElementRef;


  constructor(private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private renderer: Renderer2,
    private toastr: ToastrService) {

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      password2: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    });
  }

  passwordValidator() {
    let upperCaseCharacters = /[A-Z]+/g;
    let lowerCaseCharacters = /[a-z]+/g;
    let numberCharacters = /[0-9]+/g;
    let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    let value = this.registerForm.get('password')!.value;

    return (value.match(upperCaseCharacters) && value.match(lowerCaseCharacters) && value.match(numberCharacters) && value.match(specialCharacters));
  }

  passwordMatch() {
    if (!(this.registerForm.get('password')!.value === '' && this.registerForm.get('password2')!.value === '')) {
      return this.registerForm.get('password')!.value == this.registerForm.get('password2')!.value
    }
    else {
      return false;
    }
  }

  onRegister() {
  }

  onLogin() {
    this.http.get('http://localhost:3000/').subscribe(
      (response) => {                           //Next callback
        this.toastr.success('Welcome back!', 'Connected to General');

        this.router.navigate(['/home/general']);
      },
      (error) => {                              //Error callback
        this.toastr.warning('No internet connection!');
      }
    )
  }

  showLogin() {
    this.renderer.removeClass(this.loginDiv.nativeElement, 'd-none');
    this.renderer.addClass(this.registerDiv.nativeElement, 'd-none');
  }

  showRegister() {
    this.renderer.addClass(this.loginDiv.nativeElement, 'd-none');
    this.renderer.removeClass(this.registerDiv.nativeElement, 'd-none');
  }

  ngOnInit(): void {
  }

}
