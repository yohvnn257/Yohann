// src/app/app.routes.ts
import { Route, Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { DmgLayout } from './app/layout/component copy/dmg.layout';
import { BeneficiaryLayout } from './app/layout/component copy 2/Beneficiary.layout';
import { HomeComponent } from './app/modules/admin/home/home.component';
import { UtilisateurComponent } from './app/modules/admin/utilisateur/utilisateur.component';
import { ParticuliersComponent } from './app/modules/admin/particuliers/particuliers.component';
import { EntreprisesComponent } from './app/modules/admin/entreprises/entreprises.component';
import { ValidationsComponent } from './app/modules/admin/validations/validations.component';
import { LoadingComponent } from './app/modules/loading/loading.component';
import { CreateFormulaireComponent } from './app/create-formulaire/create-formulaire.component';
import { DmgDashboardComponent } from './app/dmg-dashboard/dmg-dashboard.component';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { AuthGuard } from '../src/app/shared/guards/auth.guard';
import { RoleBasedGuard } from '../src/app/shared/guards/role-based.guard';
import { AccessDeniedComponent } from '../src/app/shared/components/access-denied/access-denied.component';
import { AdminLayout } from '../src/app/layout/component copy 3/admin.layout';
import { AdminCreateUserPageComponent } from '../src/app/admin/admin-users-page/admin-create-user-page/admin-create-user-page.component';
import { AdminUsersPageComponent } from '../src/app/admin/admin-users-page/admin-users-page.component';

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'access-denied', component: AccessDeniedComponent },
    {
        path: 'dmg',
        component: DmgLayout,
        canActivate: [AuthGuard, RoleBasedGuard],
        data: { requiredRoles: ['ROLE_DMG', 'ROLE_ADMIN'] },
        children: [
            { path: '', component: HomeComponent },
            { path: 'dashboard', component: DmgDashboardComponent }
        ]
    },
    {
        path: 'beneficiary',
        component: BeneficiaryLayout,
        canActivate: [AuthGuard, RoleBasedGuard],
        data: { requiredRoles: ['ROLE_USER', 'ROLE_ADMIN'] },
        children: [
            { path: '', component: HomeComponent },
            { path: 'createFormulaire', component: CreateFormulaireComponent }
        ]
    },
    {
        path: 'admin',
        component: AdminLayout,
        //canActivate: [AuthGuard, RoleBasedGuard],
        //data: { requiredRoles: ['ADMIN'] },
        children: [
            { path: '', component: HomeComponent },
            { path: 'créer utilisateur', component: AdminCreateUserPageComponent },
            { path: 'utilisateurs', component: AdminUsersPageComponent },
            { path: 'admin/users/create', component: AdminCreateUserPageComponent },
            { path: 'admin/users/edit/:id', component: AdminCreateUserPageComponent }
        ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: ':role/:token',
        component: LoadingComponent
    }
];
