import { Route } from '@angular/router';
import { HomeComponent } from './admin/home/home.component';
import { UtilisateurComponent } from './admin/utilisateur/utilisateur.component';

export const ADMIN_ROUTES: Route[] = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'utilisateur',
        component: UtilisateurComponent
    }
];
