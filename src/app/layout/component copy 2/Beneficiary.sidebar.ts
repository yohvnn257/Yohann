import { Component, ElementRef } from '@angular/core';
import { BeneficiaryMenu } from './Beneficiary.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [BeneficiaryMenu],
    template: ` <div class="layout-sidebar">
        <app-menu></app-menu>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
