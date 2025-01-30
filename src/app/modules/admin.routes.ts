import { Route } from '@angular/router';
import { HomeComponent } from './admin/home/home.component';
import { UtilisateurComponent } from './admin/utilisateur/utilisateur.component';
import { ParticuliersComponent } from './admin/particuliers/particuliers.component';
import { EntreprisesComponent } from './admin/entreprises/entreprises.component';
import { ValidationsComponent } from './admin/validations/validations.component';

export const ADMIN_ROUTES: Route[] = [
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
    }
];
