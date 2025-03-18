import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFormulaireComponent } from './create-formulaire.component';

describe('CreateFormulaireComponent', () => {
    let component: CreateFormulaireComponent;
    let fixture: ComponentFixture<CreateFormulaireComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateFormulaireComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CreateFormulaireComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
