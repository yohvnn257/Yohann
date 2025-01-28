import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(
        private primengConfig: PrimeNG,
        private translateService: TranslateService
    ) {}

    ngOnInit() {
        this.primengConfig.ripple.set(true);
        this.translateService.use('FR');
        this.translateService.stream('COMPONENTS.PRIMENG').subscribe((data) => {
            this.primengConfig.setTranslation(data);
        });
    }
}
