import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../service/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ProgressSpinnerModule],
    template: `
        <div class="min-h-screen flex items-center justify-center overflow-hidden relative">
            <!-- Animations d'arrière-plan -->
            <div class="background-animation">
                <div class="circle circle-1"></div>
                <div class="circle circle-2"></div>
                <div class="circle circle-3"></div>
                <div class="circle circle-4"></div>
                <div class="particle-container">
                    <div *ngFor="let particle of particles" class="particle" [ngStyle]="{ left: particle.x + '%', top: particle.y + '%', 'animation-delay': particle.delay + 's' }"></div>
                </div>
            </div>

            <!-- Formulaire de connexion -->
            <div
                class="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl w-full max-w-md z-10 backdrop-filter backdrop-blur-sm transform transition-all duration-500 hover:shadow-2xl"
                [@formAnimation]="formState"
                (mouseenter)="formState = 'active'"
                (mouseleave)="formState = 'inactive'"
            >
                <div class="logo-container mb-6 flex justify-center">
                    <div class="logo-circle">
                        <span class="logo-letter">A</span>
                    </div>
                </div>

                <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">Authentification</h2>

                <form #loginForm="ngForm" (ngSubmit)="loginForm.valid && onLogin()" class="space-y-6">
                    <div class="input-group" [@inputAnimation]="formState">
                        <label for="email" class="block text-gray-700 text-sm font-medium mb-2">Email</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                #emailInput="ngModel"
                                [(ngModel)]="email"
                                required
                                minlength="3"
                                class="w-full pl-10 pr-3 py-3 border-b-2 border-gray-300 focus:border-blue-500 bg-transparent focus:outline-none transition-all duration-300"
                                [ngClass]="{ 'border-red-500': emailInput.invalid && (emailInput.dirty || emailInput.touched) }"
                                placeholder="Entrez votre Email"
                            />
                        </div>
                        <div *ngIf="emailInput.invalid && (emailInput.dirty || emailInput.touched)" class="text-red-500 text-xs mt-1">
                            <div *ngIf="emailInput.errors?.['required']">L'email est requis.</div>
                            <div *ngIf="emailInput.errors?.['minlength']">L'email complet est requis.</div>
                        </div>
                    </div>

                    <div class="input-group" [@inputAnimation]="formState">
                        <label for="password" class="block text-gray-700 text-sm font-medium mb-2">Mot de passe</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                </svg>
                            </span>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                #passwordInput="ngModel"
                                [(ngModel)]="password"
                                required
                                minlength="6"
                                class="w-full pl-10 pr-3 py-3 border-b-2 border-gray-300 focus:border-blue-500 bg-transparent focus:outline-none transition-all duration-300"
                                [ngClass]="{ 'border-red-500': passwordInput.invalid && (passwordInput.dirty || passwordInput.touched) }"
                                placeholder="Entrez votre mot de passe"
                            />
                        </div>
                        <div *ngIf="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)" class="text-red-500 text-xs mt-1">
                            <div *ngIf="passwordInput.errors?.['required']">Le mot de passe est requis.</div>
                            <div *ngIf="passwordInput.errors?.['minlength']">Le mot de passe doit contenir au moins 6 caractères.</div>
                        </div>
                    </div>

                    <div class="input-group" [@inputAnimation]="formState">
                        <label for="direction" class="block text-gray-700 text-sm font-medium mb-2">Direction</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.94 6.94a1.5 1.5 0 012.12 0L10 11.88l4.94-4.94a1.5 1.5 0 112.12 2.12l-6 6a1.5 1.5 0 01-2.12 0l-6-6a1.5 1.5 0 010-2.12z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                id="direction"
                                name="direction"
                                #directionInput="ngModel"
                                [(ngModel)]="direction"
                                required
                                class="w-full pl-10 pr-3 py-3 border-b-2 border-gray-300 focus:border-blue-500 bg-transparent focus:outline-none transition-all duration-300"
                                [ngClass]="{ 'border-red-500': directionInput.invalid && (directionInput.dirty || directionInput.touched) }"
                                placeholder="Entrez votre direction"
                            />
                        </div>
                        <div *ngIf="directionInput.invalid && (directionInput.dirty || directionInput.touched)" class="text-red-500 text-xs mt-1">
                            <div *ngIf="directionInput.errors?.['required']">La direction est requise.</div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        [disabled]="!loginForm.valid"
                        [ngClass]="{ 'opacity-50 cursor-not-allowed': !loginForm.valid }"
                        class="submit-button w-full py-3 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 hover:shadow-lg"
                    >
                        <span>Se connecter</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 inline" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </form>

                <div class="mt-6 text-center">
                    <span class="text-gray-600">Vous n'avez pas de compte?</span>
                    <a (click)="navigateToRegister()" class="text-blue-500 hover:text-blue-700 ml-1 font-medium transition-colors cursor-pointer">S'enregistrer</a>
                </div>
            </div>
        </div>

        <div *ngIf="errorMessage" class="text-red-500 text-center mb-4">
            {{ errorMessage }}
        </div>

        <!-- Spinner with overlay for loading -->
        <div *ngIf="isSubmitting" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div class="card p-6 shadow-xl">
                <p-progressSpinner strokeWidth="5" animationDuration="1s" class="w-16 h-16"></p-progressSpinner>
                <div class="text-center mt-4 font-medium">Traitement en cours...</div>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
            }

            .background-animation {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
                overflow: hidden;
                z-index: 0;
            }

            .circle {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                animation: float 15s infinite ease-in-out;
            }

            .circle-1 {
                width: 300px;
                height: 300px;
                top: -100px;
                left: -100px;
                animation-delay: 0s;
            }

            .circle-2 {
                width: 400px;
                height: 400px;
                top: 60%;
                right: -150px;
                animation-delay: 2s;
                background: rgba(255, 255, 255, 0.15);
            }

            .circle-3 {
                width: 200px;
                height: 200px;
                bottom: 10%;
                left: 10%;
                animation-delay: 4s;
                background: rgba(255, 255, 255, 0.1);
            }

            .circle-4 {
                width: 150px;
                height: 150px;
                top: 20%;
                right: 20%;
                animation-delay: 6s;
                background: rgba(255, 255, 255, 0.12);
            }

            .particle-container {
                position: absolute;
                width: 100%;
                height: 100%;
            }

            .particle {
                position: absolute;
                width: 8px;
                height: 8px;
                background-color: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                animation: rise 15s infinite linear;
            }

            .logo-container {
                animation: pulse 2s infinite;
            }

            .logo-circle {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background: linear-gradient(to right, #3182ce, #5a67d8);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }

            .logo-letter {
                color: white;
                font-size: 36px;
                font-weight: bold;
            }

            .submit-button {
                position: relative;
                overflow: hidden;
            }

            .submit-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.1);
                transform: translateX(-100%);
                transition: transform 0.6s;
            }

            .submit-button:hover::before {
                transform: translateX(0);
            }

            @keyframes float {
                0%,
                100% {
                    transform: translateY(0) translateX(0);
                }
                25% {
                    transform: translateY(-30px) translateX(30px);
                }
                50% {
                    transform: translateY(20px) translateX(-20px);
                }
                75% {
                    transform: translateY(30px) translateX(40px);
                }
            }

            @keyframes rise {
                0% {
                    transform: translateY(100%) translateX(0);
                    opacity: 0;
                }
                20% {
                    opacity: 1;
                }
                80% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100%) translateX(20px);
                    opacity: 0;
                }
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    transform: scale(1);
                }
            }
        `
    ],
    animations: [
        trigger('formAnimation', [
            state(
                'inactive',
                style({
                    transform: 'scale(1)'
                })
            ),
            state(
                'active',
                style({
                    transform: 'scale(1.02)'
                })
            ),
            transition('inactive => active', animate('300ms ease-in')),
            transition('active => inactive', animate('300ms ease-out'))
        ]),
        trigger('inputAnimation', [
            state(
                'inactive',
                style({
                    transform: 'translateX(0)'
                })
            ),
            state(
                'active',
                style({
                    transform: 'translateX(5px)'
                })
            ),
            transition('inactive => active', animate('300ms ease-in')),
            transition('active => inactive', animate('300ms ease-out'))
        ])
    ]
})
export class LoginComponent implements OnInit {
    email: string = '';
    password: string = '';
    direction: string = ''; // New direction field
    formState: string = 'inactive';
    particles: any[] = [];
    isSubmitting: boolean = false; // New state for spinner
    errorMessage: string;

    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        // Génère 30 particules avec des positions aléatoires
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                delay: Math.random() * 10
            });
        }
    }

    onLogin(): void {
        this.isSubmitting = true;
        this.errorMessage = '';

        const authRequest = { email: this.email, password: this.password, direction: this.direction };
        console.log('Données envoyées pour login :', authRequest);

        this.authService.login(authRequest).subscribe({
            next: (response: any) => {
                this.isSubmitting = false;
                console.log('Login successful', response);

                // Stockez les rôles dans localStorage si ce n'est pas déjà fait
                const currentUser = this.authService.getCurrentUser();
                const userRoles = currentUser?.roles || [];

                // Stockage des rôles dans localStorage
                if (userRoles.length > 0) {
                    localStorage.setItem('user_roles', JSON.stringify(userRoles));
                }

                // Redirection basée sur le rôle
                if (userRoles.includes('ROLE_ADMIN')) {
                    this.router.navigate(['/admin']);
                } else if (userRoles.includes('ROLE_DMG')) {
                    this.router.navigate(['/dmg']);
                } else if (userRoles.includes('ROLE_USER')) {
                    this.router.navigate(['/beneficiary']);
                } else {
                    this.router.navigate(['/access-denied']); // Redirection par défaut
                }
            },
            error: (error: { error: { message: string } }) => {
                this.isSubmitting = false;
                console.error('Login failed', error);
                this.errorMessage = error.error?.message || 'Échec de la connexion. Veuillez vérifier vos informations.';
            }
        });
    }

    navigateToRegister(): void {
        this.router.navigate(['/register']);
    }
}
