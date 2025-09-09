import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const roles = this.authService.getUserRoles();
    
    // Checks if the user is both authenticated and has the 'ADMIN' role.
    if (this.authService.isAuthenticated() && roles.includes('ADMIN')) {
      return true;
    }

    // If the user is not an admin, redirect them to the main dashboard.
    this.router.navigate(['/dashboard']);
    return false;
  }
}