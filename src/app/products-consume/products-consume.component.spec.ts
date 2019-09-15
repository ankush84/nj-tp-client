import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsConsumeComponent } from './products-consume.component';

describe('ProductsConsumeComponent', () => {
  let component: ProductsConsumeComponent;
  let fixture: ComponentFixture<ProductsConsumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsConsumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsConsumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
