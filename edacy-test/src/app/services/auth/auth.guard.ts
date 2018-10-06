import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable , of } from 'rxjs';
import { isNull } from 'util';

@Injectable()
export class AuthGuard implements CanActivate {

constructor(
  private router: Router
) { }

canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    const isLoggedIn = !isNull(localStorage.getItem('user'));

    if (!isLoggedIn) {
    
      console.log('Vous n\'êtes pas connectés');
      this.router.navigate(['/login'], { queryParams: { redirectUrl: state.url }});
    }
    return isLoggedIn;
  }
}