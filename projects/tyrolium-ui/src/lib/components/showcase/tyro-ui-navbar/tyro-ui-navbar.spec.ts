import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyroUiNavbar } from './tyro-ui-navbar';

describe('TyroUiNavbar', () => {
  let component: TyroUiNavbar;
  let fixture: ComponentFixture<TyroUiNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TyroUiNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(TyroUiNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
