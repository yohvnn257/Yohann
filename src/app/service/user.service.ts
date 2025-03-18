// src/app/service/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/api/admin/users';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, this.authService.getAuthHeaders());
    }

    updateUserRoles(email: string, roles: string[]): Observable<any> {
        // Changed to use email parameter and correct endpoint
        return this.http.put(`${this.apiUrl}/update-roles?email=${email}`, roles, this.authService.getAuthHeaders());
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, this.authService.getAuthHeaders());
    }

    createUser(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData, this.authService.getAuthHeaders());
    }
    // Dans user.service.ts
    updateUserInfo(userId: string, userInfo: { email: string; direction?: string }): Observable<any> {
        return this.http.put<any>(
            `${this.apiUrl}/${userId}/info`,
            userInfo,
            this.authService.getAuthHeaders() // N'oubliez pas d'ajouter les en-têtes d'authentification
        );
    }
}
