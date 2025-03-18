import { Component, ElementRef } from '@angular/core';
import { AdminMenu } from './admin.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AdminMenu],
    template: ` <div class="layout-sidebar">
        <app-menu></app-menu>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
