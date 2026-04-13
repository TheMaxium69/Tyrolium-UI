import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyroUiSubnav } from './tyro-ui-subnav';

describe('TyroUiSubnav', () => {
  let component: TyroUiSubnav;
  let fixture: ComponentFixture<TyroUiSubnav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TyroUiSubnav],
    }).compileComponents();

    fixture = TestBed.createComponent(TyroUiSubnav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
