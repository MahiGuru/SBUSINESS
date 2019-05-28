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

  @Output() adjustCols: EventEmitter<any> = new EventEmitter();
  @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();

  editChildRowIndex;

  faWindowClose = faWindowClose;
  faCheckSquare = faCheckSquare;
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;

  constructor() { }

  ngOnInit() {
  }

  public getRowIndex(row: any): number {
    // console.log(row);
    return this.table.bodyComponent.getRowIndex(row);   // row being data object passed into the template
  }

  editValUpdate(event, row) {
    row.waste = event.target.value;
  }

  editChildrenRowClick(rowIndex, childrenIndex) {
    this.editChildRowIndex = childrenIndex;
    // console.log(this.editChildRowIndex);
  }
  cancelChildRowClick(rowIndex, childrenIndex) {
    this.editChildRowIndex = null;
  }
  updateEditedChildRowValue(rowIndex, childIndex, waste) {
    // console.log(rowIndex, childIndex, waste, this.rows[rowIndex].children[childIndex]);
    // this.rows[rowIndex].children[childIndex].waste = waste;

    this.editChildRowIndex = null;
  }
}
