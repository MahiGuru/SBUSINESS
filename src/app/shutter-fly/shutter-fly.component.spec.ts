import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShutterFlyComponent } from './shutter-fly.component';

describe('ShutterFlyComponent', () => {
  let component: ShutterFlyComponent;
  let fixture: ComponentFixture<ShutterFlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShutterFlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShutterFlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
