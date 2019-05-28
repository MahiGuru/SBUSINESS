import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubOrdersComponent } from './sub-orders.component';

describe('SubOrdersComponent', () => {
  let component: SubOrdersComponent;
  let fixture: ComponentFixture<SubOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
