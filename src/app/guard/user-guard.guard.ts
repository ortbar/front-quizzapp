import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuardGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(!this.authService.isAuthenticated()) {
        this.router.navigate(['login']);
        return false; // permite acceso si usuario autenticado (tiene token)
      } 

      if (this.authService.hasRole('USER')) {
        return true;
      }
  
      this.router.navigate(['/admin']);
      return false;

  }
  
}
