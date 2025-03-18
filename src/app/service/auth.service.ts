// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

// Models
export interface AuthenticationRequest {
    email: string;
    password: string;
}

export interface AuthenticationResponse {
    token: string;
    direction?: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    roles?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';
    private jwtHelper = new JwtHelperService();

    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser = this.currentUserSubject.asObservable();

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.checkAuthentication();
    }

    private checkAuthentication(): void {
        const token = this.getToken();
        console.log('Checking authentication, token:', token);
        if (token) {
            try {
                const decodedToken = this.jwtHelper.decodeToken(token);
                console.log('Decoded token:', decodedToken);
                if (!this.jwtHelper.isTokenExpired(token)) {
                    this.currentUserSubject.next({
                        email: decodedToken.sub,
                        roles: decodedToken.roles || [],
                        direction: this.getDirection() || ''
                    });
                    console.log('User authenticated:', this.currentUserSubject.value);
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('Invalid token', error);
                this.logout();
            }
        }
    }

    login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
        console.log('Login request:', request);
        return this.http.post<AuthenticationResponse>(`${this.apiUrl}/login`, request, this.httpOptions).pipe(
            tap((response) => {
                console.log('Login response:', response);
                if (response && response.token) {
                    localStorage.setItem('auth_token', response.token);
                    localStorage.setItem('user_direction', response.direction || '');

                    const decodedToken = this.jwtHelper.decodeToken(response.token);
                    console.log('Decoded token after login:', decodedToken);

                    // Fix: Ensure we're properly extracting roles from the token
                    const roles = decodedToken.roles || [];

                    this.currentUserSubject.next({
                        email: decodedToken.sub,
                        roles: roles,
                        direction: response.direction || ''
                    });
                    console.log('Current user after login:', this.currentUserSubject.value);
                }
            })
        );
    }

    register(request: RegisterRequest): Observable<string> {
        console.log('Register request:', request);
        return this.http.post<string>(`${this.apiUrl}/register`, request, this.httpOptions);
    }

    adminRegister(request: RegisterRequest): Observable<any> {
        console.log('Admin register request:', request);
        return this.http.post<any>(`${this.apiUrl}/admin/register`, request, this.getAuthHeaders());
    }

    logout(): void {
        console.log('Logging out...');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_direction');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        const isLoggedIn = !!this.getToken();
        console.log('Is user logged in?', isLoggedIn);
        return isLoggedIn;
    }

    getToken(): string | null {
        const token = localStorage.getItem('auth_token');
        console.log('Retrieved token:', token);
        return token;
    }

    getDirection(): string | null {
        const direction = localStorage.getItem('user_direction');
        console.log('Retrieved direction:', direction);
        return direction;
    }

    hasRole(role: string): boolean {
        const currentUser = this.currentUserSubject.value;
        const hasRole = currentUser?.roles?.includes(role) || false;
        console.log(`User has role ${role}:`, hasRole);
        return hasRole;
    }

    getAuthHeaders() {
        const token = this.getToken();
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            })
        };
    }

    getCurrentUser(): any {
        const currentUser = this.currentUserSubject.value;
        console.log('Current user:', currentUser);
        return currentUser;
    }

    public enregistrerToken(jwtToken: string): void {
        localStorage.setItem('token', jwtToken);
        console.log('Token enregistré:', jwtToken);
    }

    public enregistrerRole(role: string): void {
        localStorage.setItem('role', role);
        console.log('Rôle enregistré:', role);
    }
}
