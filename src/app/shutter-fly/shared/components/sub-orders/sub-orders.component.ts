import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  faWindowClose, faCheckSquare,
  faPencilAlt, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'sb-sub-orders',
  templateUrl: './sub-orders.component.html',
  styleUrls: ['./sub-orders.component.scss']
})
export class SubOrdersComponent implements OnInit {

  @Input() row: any;
  @Input() table: any;

  @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();

  faWindowClose = faWindowClose;
  faCheckSquare = faCheckSquare;
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;

  constructor() { }

  ngOnInit() {
  }
  cancelChildRowClick(row) {
    row.editable = false;
  }
  onSavePropertyVal(row) {
    row.editable = false;
  }
}
