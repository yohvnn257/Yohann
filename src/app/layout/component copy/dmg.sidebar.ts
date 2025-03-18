import { Component, ElementRef } from '@angular/core';
import { DmgMenu } from './dmg.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [DmgMenu],
    template: ` <div class="layout-sidebar">
        <app-menu></app-menu>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
