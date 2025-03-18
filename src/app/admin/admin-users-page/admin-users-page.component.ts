// src/app/pages/admin-users-page/admin-users-page.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserService } from '../../service/user.service';

interface User {
    id: string;
    email: string;
    direction?: string;
    roles: string[];
}

@Component({
    selector: 'app-admin-users-page',
    templateUrl: './admin-users-page.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, TableModule, InputTextModule, DialogModule, CheckboxModule, ProgressSpinnerModule, TooltipModule, ChipModule, ConfirmDialogModule],
    providers: [ConfirmationService, MessageService]
})
export class AdminUsersPageComponent implements OnInit {
    @ViewChild('dt') dt: Table | undefined;

    users: User[] = [];
    loading = true;
    showModal = false;
    showEditModal = false;
    selectedUser: User | null = null;
    selectedUserIndex: number = -1;
    userForm = {
        email: '',
        direction: ''
    };

    roles = {
        ROLE_USER: false,
        ROLE_DMG: false,
        ROLE_ADMIN: false
    };

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.userService.getUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading users', error);
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les utilisateurs'
                });
            }
        });
    }

    handleEditRoles(user: User): void {
        // Trouver l'index de l'utilisateur dans le tableau
        this.selectedUserIndex = this.users.findIndex((u) => u.id === user.id);

        // Copier l'utilisateur pour éviter de modifier directement l'objet
        this.selectedUser = { ...user };

        // Réinitialiser tous les rôles à false
        this.resetRoles();

        // Activer les checkboxes pour les rôles que l'utilisateur possède
        if (user.roles && Array.isArray(user.roles)) {
            user.roles.forEach((role) => {
                if (role in this.roles) {
                    this.roles[role] = true;
                }
            });
        }

        // Afficher le modal
        this.showModal = true;
    }

    handleRoleChange(role: string): void {
        // Cette méthode est appelée par l'événement onChange des checkboxes
        // La valeur est déjà mise à jour par le binding bidirectionnel [(ngModel)]
        console.log(`Role ${role} changed to: ${this.roles[role]}`);
    }

    handleCloseModal(): void {
        this.showModal = false;
        this.selectedUser = null;
        this.selectedUserIndex = -1;
        this.resetRoles();
    }

    handleSaveRoles(): void {
        if (!this.selectedUser) return;

        // Collecter uniquement les rôles qui sont cochés (true)
        const updatedRoles = Object.keys(this.roles).filter((role) => this.roles[role]);
        console.log('Updated roles:', updatedRoles);

        // Appeler le service pour mettre à jour les rôles
        this.userService.updateUserRoles(this.selectedUser.email, updatedRoles).subscribe({
            next: () => {
                if (this.selectedUserIndex !== -1) {
                    // Créer une copie complète du tableau users
                    const updatedUsers = [...this.users];

                    // Mettre à jour l'objet utilisateur spécifique avec les nouveaux rôles
                    updatedUsers[this.selectedUserIndex] = {
                        ...updatedUsers[this.selectedUserIndex],
                        roles: [...updatedRoles] // Important: créer un nouveau tableau pour les rôles
                    };

                    // Remplacer complètement le tableau pour déclencher la détection de changement
                    this.users = updatedUsers;

                    console.log('Users array after update:', this.users);
                }

                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Rôles mis à jour avec succès'
                });

                this.handleCloseModal();
            },
            error: (error) => {
                console.error('Error updating roles', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de mettre à jour les rôles'
                });
            }
        });
    }

    confirmDelete(user: User): void {
        this.confirmationService.confirm({
            message: `Voulez-vous vraiment supprimer l'utilisateur ${user.email}?`,
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteUser(user);
            }
        });
    }

    deleteUser(user: User): void {
        this.userService.deleteUser(user.id).subscribe({
            next: () => {
                this.users = this.users.filter((u) => u.id !== user.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Suppression',
                    detail: 'Utilisateur supprimé avec succès'
                });
            },
            error: (error) => {
                console.error('Error deleting user', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "Impossible de supprimer l'utilisateur"
                });
            }
        });
    }

    resetRoles(): void {
        this.roles = {
            ROLE_USER: false,
            ROLE_DMG: false,
            ROLE_ADMIN: false
        };
    }

    getRoleChipStyle(role: string): object {
        const styles = {
            ROLE_USER: { background: '#E3F2FD', color: '#2196F3' },
            ROLE_DMG: { background: '#FFF8E1', color: '#FFA000' },
            ROLE_ADMIN: { background: '#FFEBEE', color: '#D32F2F' }
        };

        return styles[role] || {};
    }

    onSearch(event: Event): void {
        if (this.dt) {
            const input = event.target as HTMLInputElement;
            this.dt.filterGlobal(input.value, 'contains');
        }
    }

    navigateToCreateUser(): void {
        // Utiliser la méthode navigate du Router au lieu de routerLink
        try {
            this.router.navigate(['/admin/créer utilisateur']);
        } catch (error) {
            console.error('Navigation error:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur de navigation',
                detail: "La route vers la création d'utilisateur n'est pas configurée"
            });
        }
    }

    // Ajoutez ces propri

    // Remplacez votre méthode navigateToEditUser par celle-ci
    navigateToEditUser(userId: string): void {
        console.log("Bouton édition cliqué pour l'utilisateur ID:", userId);

        // Trouver l'utilisateur dans le tableau
        const userToEdit = this.users.find((u) => u.id === userId);
        if (userToEdit) {
            this.selectedUser = { ...userToEdit };
            this.selectedUserIndex = this.users.findIndex((u) => u.id === userId);

            // Préremplir le formulaire
            this.userForm = {
                email: userToEdit.email,
                direction: userToEdit.direction || ''
            };

            // Afficher le modal
            this.showEditModal = true;
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Utilisateur non trouvé'
            });
        }
    }

    // Ajoutez ces méthodes
    closeEditModal(): void {
        this.showEditModal = false;
        this.selectedUser = null;
    }

    handleSaveUserInfo(): void {
        if (!this.selectedUser) return;

        const userId = this.selectedUser.id;
        const updateData = {
            email: this.userForm.email,
            direction: this.userForm.direction
        };

        this.userService.updateUserInfo(userId, updateData).subscribe({
            next: (updatedUser) => {
                // Mettre à jour l'utilisateur dans le tableau
                if (this.selectedUserIndex !== -1) {
                    const updatedUsers = [...this.users];
                    updatedUsers[this.selectedUserIndex] = {
                        ...updatedUsers[this.selectedUserIndex],
                        ...updateData
                    };
                    this.users = updatedUsers;
                }

                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Informations utilisateur mises à jour'
                });

                this.closeEditModal();
            },
            error: (error) => {
                console.error('Error updating user info:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "Impossible de mettre à jour l'utilisateur: " + (error.error || error.message || 'Erreur inconnue')
                });
            }
        });
    }
}
