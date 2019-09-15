import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsAvailableComponent } from './products-available.component';

describe('ProductsAvailableComponent', () => {
  let component: ProductsAvailableComponent;
  let fixture: ComponentFixture<ProductsAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsAvailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
