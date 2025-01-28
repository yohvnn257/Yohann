import { SelectOption } from 'shared/models/select-option.model';

export const RolesOptions: SelectOption[] = [
    {
        designation: 'Admin',
        code: 'ADMIN'
    },
    {
        designation: 'User',
        code: 'USER'
    }
];

export const TypeEmployes: SelectOption[] = [
    {
        designation: 'Collaborateur',
        code: 'COLLABORATEUR'
    },
    {
        designation: 'Directeur',
        code: 'DIRECTEUR'
    },
    {
        designation: 'Chef service',
        code: 'CHEF_SERVICE'
    },
    {
        designation: 'Chef departement',
        code: 'CHEF_DEPARTEMENT'
    }
];
