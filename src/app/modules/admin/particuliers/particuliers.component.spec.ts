import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticuliersComponent } from './particuliers.component';

describe('ParticuliersComponent', () => {
  let component: ParticuliersComponent;
  let fixture: ComponentFixture<ParticuliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticuliersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticuliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
