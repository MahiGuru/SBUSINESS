import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sb-shutter-fly',
  templateUrl: './shutter-fly.component.html',
  styleUrls: ['./shutter-fly.component.scss']
})
export class ShutterFlyComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
    // this.router.navigate(['layout', 'inventory']);
  }

}
