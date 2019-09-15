import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsPurchaseComponent } from './products-purchase.component';

describe('ProductsPurchaseComponent', () => {
  let component: ProductsPurchaseComponent;
  let fixture: ComponentFixture<ProductsPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
