import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sb-shutter-fly',
  templateUrl: './shutter-fly.component.html',
  styleUrls: ['./shutter-fly.component.scss']
})
export class ShutterFlyComponent implements OnInit {
  windowHeight: number;
  windowWidth: number;
  tabIndex = 0;
  isAdmin = false;
  isPrinter = false;
  isAssembler = false;

  constructor(public router: Router) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    console.log('shutterfly ', this.windowHeight, this.windowWidth);
  }
  ngOnInit() {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      this.isAdmin = true;
    } else if (role === 'printer') {
      this.isPrinter = true;
      this.tabIndex = 1;

    } else if (role === 'assembler') {
      this.isAssembler = true;
      this.tabIndex = 0;
    }
    this.tabIndex = 0;
    // this.router.navigate(['layout', 'inventory']);
  }
  selectedTab($event) {
    console.log('TAB ', $event);
    this.tabIndex = $event.index;
  }

}
