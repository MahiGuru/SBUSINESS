import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDataGridComponent } from './inventory-data-grid.component';

describe('InventoryDataGridComponent', () => {
  let component: InventoryDataGridComponent;
  let fixture: ComponentFixture<InventoryDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
