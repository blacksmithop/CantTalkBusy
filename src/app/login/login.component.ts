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

  passwordValidator(form: any) {
    let upperCaseCharacters = /[A-Z]+/g;
    let lowerCaseCharacters = /[a-z]+/g;
    let numberCharacters = /[0-9]+/g;
    let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    let value = form.get('password')!.value;

    return (value.match(upperCaseCharacters) && value.match(lowerCaseCharacters) && value.match(numberCharacters) && value.match(specialCharacters));
  }

  usernameUnique() {
    const uname = this.registerForm.get('username')!.value;
    console.log(uname)
    let unique = true;
    this.http.get(`http://localhost:3000/unique/username/${uname}`).subscribe(
      (response) => {
        console.log(response)                        //Next callback
        this.toastr.success('Username is valid!');
      },
      (error) => {
        console.log(error)                //Error callback
        this.toastr.warning('Username is already taken');
        unique = false;
      }
    )
    return unique;

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
    if (this.usernameUnique() && this.passwordMatch()) {
      this.http.post('http://localhost:3000/signup', this.registerForm.value).subscribe(
        (response: any) => {
          //Next callback
          this.toastr.success('Registration Successful!');
          this.showLogin();
        },
        (error: any) => {
          this.toastr.success(error.message);
          this.toastr.warning('Could not register account')                          //Error callback
        }
      )
    }
  }

  onLogin() {
    this.http.post('http://localhost:3000/login', this.loginForm.value).subscribe(
      (response: any) => {
        //Next callback
        this.toastr.success(response.message);

        sessionStorage.setItem('session', JSON.stringify(response.data));

        this.toastr.success('Welcome back!', 'Connected to General');
        this.router.navigate(['/room/general']);
      },
      (error: any) => {
        console.log(error)
        this.toastr.warning(error.error.message);
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
