import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {

    this.form = fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

  }

  ngOnInit() {
  }

  login() {
    const values = this.form.getRawValue();
    this.authService.signIn(values.email, values.password)
      .then((res) => {
        console.log(res);
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigateByUrl('');
      })
      .catch(err => console.log(err));
  }
}
