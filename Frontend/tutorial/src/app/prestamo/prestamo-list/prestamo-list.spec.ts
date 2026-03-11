import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoListComponent } from './prestamo-list';

describe('PrestamoListComponent', () => {
  let component: PrestamoListComponent;
  let fixture: ComponentFixture<PrestamoListComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamoListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrestamoListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
