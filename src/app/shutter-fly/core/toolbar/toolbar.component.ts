import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sb-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent implements OnInit {
  public selected: any;
  public username: any;
  constructor(public router: Router) { }

  ngOnInit() {
    this.selected = 'premier';
    this.username = localStorage.getItem('username');
  }
  logoutClick() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
