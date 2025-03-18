import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private loginService: AuthService,
        private route: Router
    ) {}

    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        const token = this.loginService.getToken();
        if (!token || !this.loginService.isLoggedIn()) {
            window.location.href = 'http://localhost:4200/login';
            return false;
        }
        return true;
    }
}
