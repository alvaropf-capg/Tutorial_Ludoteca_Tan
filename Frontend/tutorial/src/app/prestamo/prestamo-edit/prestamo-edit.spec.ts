import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoEditComponent } from './prestamo-edit';

describe('PrestamoEditComponent', () => {
  let component: PrestamoEditComponent;
  let fixture: ComponentFixture<PrestamoEditComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamoEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrestamoEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
