import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationCompteParticulierComponent } from './creation-compte-particulier.component';

describe('CreationCompteParticulierComponent', () => {
  let component: CreationCompteParticulierComponent;
  let fixture: ComponentFixture<CreationCompteParticulierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationCompteParticulierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationCompteParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
