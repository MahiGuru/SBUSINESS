import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvenoryDataGridComponent } from './invenory-data-grid.component';

describe('DataGridComponent', () => {
  let component: InvenoryDataGridComponent;
  let fixture: ComponentFixture<InvenoryDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvenoryDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvenoryDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
