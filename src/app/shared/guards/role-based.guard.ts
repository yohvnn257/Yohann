// src/app/guards/role-based.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleBasedGuard {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // Check if user is logged in
        if (!this.authService.isLoggedIn()) {
            return this.router.createUrlTree(['/login']);
        }

        const requiredRoles: string[] = route.data['requiredRoles'] || [];

        // If no roles required, allow access
        if (requiredRoles.length === 0) {
            return true;
        }

        // Get current user roles from AuthService first
        const currentUser = this.authService.getCurrentUser();
        let userRoles: string[] = currentUser?.roles || [];

        // If no roles from current user, try to get from localStorage
        if (!userRoles || userRoles.length === 0) {
            const storedRoles = localStorage.getItem('user_roles');
            if (storedRoles) {
                try {
                    userRoles = JSON.parse(storedRoles);
                } catch (e) {
                    console.error('Error parsing user roles from localStorage', e);
                    userRoles = [];
                }
            }
        }

        console.log('User Roles:', userRoles);
        console.log('Required Roles:', requiredRoles);

        // If no roles found, deny access
        if (!userRoles || userRoles.length === 0) {
            console.log('No roles found, access denied');
            return this.router.createUrlTree(['/access-denied']);
        }

        // Check if user has any of the required roles
        const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

        console.log('Has required role:', hasRequiredRole);

        if (!hasRequiredRole) {
            return this.router.createUrlTree(['/access-denied']);
        }

        return true;
    }
}
