import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sb-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent implements OnInit {
  public selected: any;
  constructor() { }

  ngOnInit() {
    this.selected = 'premier';
  }

}
