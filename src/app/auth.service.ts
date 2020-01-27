import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {User as AuthUser} from 'firebase';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  authUser$: BehaviorSubject<AuthUser> = new BehaviorSubject<AuthUser>(null);
  constructor(private auth: AngularFireAuth) {

    this.auth.authState
      .subscribe((authUser: AuthUser) => {
        this.loaded$.next(true);
        this.authUser$.next(authUser);
      });
  }

  load() {
    console.log('auth load started');
    return  new Promise((resolve) => {
      this.auth.authState
        .pipe(take(1))
        .subscribe(authUser => {
          this.loaded$.next(true);
          this.authUser$.next(authUser);
          console.log('auth load resolved', authUser);
          resolve(true);
        });
    });

  }

  signIn(email: string, password: string) {
    return this.auth.auth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.auth.auth.signOut();
  }


}
