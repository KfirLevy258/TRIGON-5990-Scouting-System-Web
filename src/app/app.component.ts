import { Component } from '@angular/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  authUser;

  constructor(private authService: AuthService,
              private router: Router) {
    this.authService.authUser$
      .subscribe(authUser => {
        this.authUser = authUser;
      });
  }

  logout() {
    this.authService.signOut()
      .then(() => {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigateByUrl('login');
      })
      .catch(err => console.log(err));
  }
}
