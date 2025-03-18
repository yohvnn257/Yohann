import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Menu',
                items: [
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/app'] },
                    { label: 'Particuliers', icon: 'pi pi-fw pi-user', routerLink: ['/app/particuliers'] },
                    { label: 'Entreprises', icon: 'pi pi-fw pi-user', routerLink: ['/app/entreprises'] },
                    { label: 'Validations', icon: 'pi pi-fw pi-user', routerLink: ['/app/validations'] },
                    { label: 'Dashboard DMG', icon: 'pi pi-fw pi-user', routerLink: ['/app/dmg-dashboard'] },
                    { label: 'Bénéficiaire', icon: 'pi pi-fw pi-user', routerLink: ['/app/create-formulaire'] }
                ]
            }
        ];
    }
}
