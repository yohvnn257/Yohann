import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../service/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    apiUrl = environment.apiUrl;

    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();
        const isApiUrl = request.url.startsWith(this.apiUrl);

        // Fix: Check if token exists and is not undefined/null
        if (token !== null && token !== undefined && isApiUrl) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }

        return next.handle(request);
    }
}
