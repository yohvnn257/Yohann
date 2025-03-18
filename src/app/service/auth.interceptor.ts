// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.authService.getToken();

        // Apply token to all API requests
        if (token && request.url.includes('http://localhost:8080/api')) {
            const authReq = request.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
            return next.handle(authReq);
        }

        return next.handle(request);
    }
}
