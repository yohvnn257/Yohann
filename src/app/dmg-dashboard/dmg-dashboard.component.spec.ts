import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmgDashboardComponent } from './dmg-dashboard.component';

describe('DmgDashboardComponent', () => {
    let component: DmgDashboardComponent;
    let fixture: ComponentFixture<DmgDashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DmgDashboardComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DmgDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
