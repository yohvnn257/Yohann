import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Utilisateur } from '../../shared/models/utilisateur';

export const ADMIN_ROUTES: Route[] = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'utilisateur',
        component: Utilisateur
    }
];
