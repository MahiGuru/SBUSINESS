import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  faWindowClose, faCheckSquare,
  faPencilAlt, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'sb-release-sub-orders',
  templateUrl: './release-sub-orders.component.html',
  styleUrls: ['./release-sub-orders.component.scss']
})
export class ReleaseSubOrdersComponent implements OnInit {

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
