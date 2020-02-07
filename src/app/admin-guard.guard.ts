import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from './auth.service';
import {map, tap} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {

  constructor(private authService: AuthService,
              private db: AngularFirestore,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>   {
    return this.authService.authUser$
      .pipe(
        map(user => {
          return true;
        }),
        tap(
          ok => {
            if (!ok) {
              // noinspection JSIgnoredPromiseFromCall
              this.router.navigateByUrl('login');
            }
          }
        )
      );  }

}
