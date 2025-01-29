import { Component } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-home',
    imports: [DatePickerModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {}
