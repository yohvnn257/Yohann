import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { HomeComponent } from './app/modules/admin/home/home.component';
import { UtilisateurComponent } from './app/modules/admin/utilisateur/utilisateur.component';
import { ParticuliersComponent } from './app/modules/admin/particuliers/particuliers.component';
import { EntreprisesComponent } from './app/modules/admin/entreprises/entreprises.component';
import { ValidationsComponent } from './app/modules/admin/validations/validations.component';
import { LoadingComponent } from './app/modules/loading/loading.component';

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
            ,
            {
                path: 'particuliers',
                component: ParticuliersComponent
            }
            ,
            {
                path: 'entreprises',
                component: EntreprisesComponent
            }
            ,
            {
                path: 'validations',
                component: ValidationsComponent
            },
            {
                path: ':role/:token', component: LoadingComponent
            },
        ]
    }
];
 