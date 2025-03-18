import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { EvaluationSubmission } from '../models/evaluation.submission';

@Injectable({
    providedIn: 'root'
})
export class DmgService {
    // Use environment variables for production
    private apiUrl = 'http://localhost:8080/api/dmg';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}

    // Create HTTP options with proper headers
    private createHttpOptions(): { headers: HttpHeaders } {
        const token = localStorage.getItem('token'); // Si tu utilises localStorage pour stocker le token
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: token ? `Bearer ${token}` : '' // Inclure le token si disponible
            })
        };
    }

    // Beneficiary endpoints
    submitBeneficiaryEvaluation(data: EvaluationSubmission): Observable<any> {
        console.log('Submitting beneficiary evaluation:', data);
        return this.http.post(`${this.apiUrl}/beneficiary/submit`, data, this.authService.getAuthHeaders()).pipe(
            retry(1), // Retry once before failing
            catchError(this.handleError)
        );
    }

    getBeneficiaryEvaluations(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/beneficiary/evaluations`, this.authService.getAuthHeaders()).pipe(catchError(this.handleError));
    }

    // DMG endpoints
    getPendingEvaluations(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/dashboard/pending-forms`, this.authService.getAuthHeaders()).pipe(catchError(this.handleError));
    }

    // Added method to approve beneficiary evaluation
    approveBeneficiaryEvaluation(evaluationId: number): Observable<any> {
        console.log(`Approving evaluation ${evaluationId}`);
        return this.http.post(`${this.apiUrl}/dashboard/approve/${evaluationId}`, {}, this.authService.getAuthHeaders()).pipe(
            retry(1), // Retry once before failing
            catchError(this.handleError)
        );
    }

    // Fixed reject method to match backend controller
    rejectBeneficiaryEvaluation(evaluationId: number, reason: string): Observable<any> {
        const payload = { reason: reason };
        console.log(`Rejecting evaluation ${evaluationId} with reason: ${reason}`);

        return this.http.post(`${this.apiUrl}/dashboard/reject/${evaluationId}`, payload, this.authService.getAuthHeaders()).pipe(
            retry(1), // Retry once before failing
            catchError(this.handleError)
        );
    }

    submitDmgEvaluation(data: EvaluationSubmission): Observable<any> {
        console.log('Submitting DMG evaluation:', data);
        return this.http.post(`${this.apiUrl}/dashboard/submit`, data, this.authService.getAuthHeaders()).pipe(catchError(this.handleError));
    }

    // Notification endpoints
    getNotificationsCount(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/dashboard/notifications`, this.authService.getAuthHeaders()).pipe(catchError(this.handleError));
    }

    getNotifications(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/dashboard/notifications`, this.authService.getAuthHeaders()).pipe(catchError(this.handleError));
    }

    markNotificationAsRead(notificationId: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/dashboard/notifications/${notificationId}/read`, {}, this.authService.getAuthHeaders()).pipe(retry(1), catchError(this.handleError));
    }

    // Enhanced error handling with more detailed information
    private handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Erreur: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Code: ${error.status}\nMessage: ${error.message}`;

            // Log additional information for debugging
            console.error('Response body:', error.error);
        }
        console.error('DmgService error:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
    }
}
