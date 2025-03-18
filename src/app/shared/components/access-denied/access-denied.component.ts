// src/app/shared/components/access-denied/access-denied.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-access-denied',
    standalone: true,
    template: `
        <div class="access-denied">
            <h1>Access Denied</h1>
            <p>Vous n'avez pas la permission d'accéder a cette page.</p>
            <button (click)="goBack()">Go Back</button>
            <button (click)="goToLogin()">Go to Login</button>
        </div>
    `,
    styles: [
        `
            .access-denied {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
            }
            button {
                margin: 10px;
                padding: 8px 16px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            button:hover {
                background-color: #0056b3;
            }
        `
    ]
})
export class AccessDeniedComponent {
    constructor(private router: Router) {}

    goBack(): void {
        window.history.back();
    }

    goToLogin(): void {
        this.router.navigate(['/login']);
    }
}
