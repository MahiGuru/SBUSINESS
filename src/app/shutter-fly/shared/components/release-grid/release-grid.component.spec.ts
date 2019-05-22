import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseGridComponent } from './release-grid.component';

describe('ReleaseGridComponent', () => {
  let component: ReleaseGridComponent;
  let fixture: ComponentFixture<ReleaseGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReleaseGridComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
