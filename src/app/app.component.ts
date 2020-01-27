import {Component, Input} from '@angular/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  authUser;
  userName;

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this.getUserName();
  }

  constructor(private authService: AuthService,
              private router: Router,
              private db: AngularFirestore) {
    this.authService.authUser$
      .subscribe(authUser => {
        this.authUser = authUser;
      });
  }

  getUserName() {
    console.log(this.authUser.name);
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
