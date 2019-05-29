import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryNewOrderComponent } from './inventory-new-order.component';


describe('NewOrderComponent', () => {
  let component: InventoryNewOrderComponent;
  let fixture: ComponentFixture<InventoryNewOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryNewOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryNewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
