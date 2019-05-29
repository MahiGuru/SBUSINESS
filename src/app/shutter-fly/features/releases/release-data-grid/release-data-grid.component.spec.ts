import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReleaseDataGridComponent } from './release-data-grid.component';

describe('InventoryDataGridComponent', () => {
  let component: ReleaseDataGridComponent;
  let fixture: ComponentFixture<ReleaseDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseDataGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
