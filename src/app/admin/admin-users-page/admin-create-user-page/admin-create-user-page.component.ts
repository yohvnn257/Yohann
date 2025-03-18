// src/app/pages/admin-create-user-page/admin-create-user-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../service/user.service';

@Component({
    selector: 'app-admin-create-user-page',
    templateUrl: './admin-create-user-page.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, PasswordModule, CheckboxModule, MessagesModule],
    providers: [MessageService]
})
export class AdminCreateUserPageComponent {
    formData = {
        email: '',
        password: '',
        roles: {
            ROLE_USER: true,
            ROLE_DMG: false,
            ROLE_ADMIN: false
        }
    };

    message: string | null = null;
    error: string | null = null;

    constructor(
        private userService: UserService,
        private router: Router,
        private messageService: MessageService
    ) {}

    handleChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target && target.name) {
            this.formData[target.name] = target.value;
        }
    }

    handleRoleChange(role: string): void {
        this.formData.roles[role] = !this.formData.roles[role];
    }

    handleSubmit(event: Event): void {
        event.preventDefault();

        // Clear previous messages
        this.message = null;
        this.error = null;

        // Validate form
        if (!this.formData.email || !this.formData.password) {
            this.error = 'Veuillez remplir tous les champs obligatoires.';
            return;
        }

        // Prepare roles array
        const roles = Object.keys(this.formData.roles).filter((role) => this.formData.roles[role]);

        // If no roles selected, default to USER
        if (roles.length === 0) {
            roles.push('ROLE_USER');
        }

        const userData = {
            email: this.formData.email,
            password: this.formData.password,
            roles: roles
        };

        this.userService.createUser(userData).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Utilisateur créé avec succès'
                });

                // Navigate after successful creation
                setTimeout(() => {
                    this.router.navigate(['/admin/users']);
                }, 1500);
            },
            error: (error) => {
                console.error('Error creating user', error);
                this.error = error.error?.message || "Une erreur est survenue lors de la création de l'utilisateur.";
            }
        });
    }
}
