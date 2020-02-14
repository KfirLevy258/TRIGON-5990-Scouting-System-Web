import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {concatMap, map, tap} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService,
              private db: AngularFirestore,
              private router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('Admin Guard');
    return this.authService.authUser$
      .pipe(
        concatMap(authUser => {
          return this.db.collection('users').doc(authUser.uid).get()
            .pipe(
              map(user => {
                console.log(user.data());
                return user.data().admin;
              }),
              tap(ok => {
                if (!ok) {
                  // noinspection JSIgnoredPromiseFromCall
                  this.router.navigateByUrl('');
                }
              })
            );
        })
      );
  }

}
