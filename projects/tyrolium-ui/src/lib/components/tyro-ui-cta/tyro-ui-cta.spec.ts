import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TyroUiCTA } from "./tyro-ui-cta";

describe("TyroUiCTA", () => {
  let component: TyroUiCTA;
  let fixture: ComponentFixture<TyroUiCTA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TyroUiCTA],
    }).compileComponents();

    fixture = TestBed.createComponent(TyroUiCTA);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
