import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteEditComponent } from './cliente-edit';

describe('ClienteEditComponent', () => {
  let component: ClienteEditComponent;
  let fixture: ComponentFixture<ClienteEditComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
