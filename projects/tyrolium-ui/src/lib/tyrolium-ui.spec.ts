import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyroliumUi } from './tyrolium-ui';

describe('TyroliumUi', () => {
  let component: TyroliumUi;
  let fixture: ComponentFixture<TyroliumUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TyroliumUi],
    }).compileComponents();

    fixture = TestBed.createComponent(TyroliumUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
