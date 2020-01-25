import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>  {
    console.log('auth guard');
    return this.authService.authUser$
      .pipe(
        map(user => !!user),
        tap(
          ok => {
            if (!ok) {
              // noinspection JSIgnoredPromiseFromCall
              this.router.navigateByUrl('login');
            }
          }
        )
      );
  }

}
