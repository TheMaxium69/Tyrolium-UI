import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyroUiFooter } from './tyro-ui-footer';

describe('TyroUiFooter', () => {
  let component: TyroUiFooter;
  let fixture: ComponentFixture<TyroUiFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TyroUiFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(TyroUiFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
