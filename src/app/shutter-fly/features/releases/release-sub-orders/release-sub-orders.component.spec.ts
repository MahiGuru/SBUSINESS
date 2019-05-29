import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InventorySubOrdersComponent } from './inventory-sub-orders.component';


describe('SubOrdersComponent', () => {
  let component: InventorySubOrdersComponent;
  let fixture: ComponentFixture<InventorySubOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorySubOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySubOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
