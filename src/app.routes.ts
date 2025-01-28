import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { HomeComponent } from './app/modules/admin/home/home.component';
import { UtilisateurComponent } from './app/modules/admin/utilisateur/utilisateur.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'utilisateur',
                component: UtilisateurComponent
            }
        ]
    }
];
