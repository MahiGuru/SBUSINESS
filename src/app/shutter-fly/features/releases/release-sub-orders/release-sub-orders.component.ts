import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import {
  faWindowClose, faCheckSquare,
  faPencilAlt, faTrashAlt, faShare, faBan, faPrint, faCheckCircle, faDownload
} from '@fortawesome/free-solid-svg-icons';
import { PrintOrderService } from 'src/app/shutter-fly/shared/services/print-order.service';
import { ReleasesService } from 'src/app/shutter-fly/shared/services/releases.service';
import { ORDERS } from 'src/app/shutter-fly/core/models/order-state';

@Component({
  selector: 'sb-release-sub-orders',
  templateUrl: './release-sub-orders.component.html',
  styleUrls: ['./release-sub-orders.component.scss']
})
export class ReleaseSubOrdersComponent implements OnInit {

  @Input() row: any;
  @Input() rows: any;
  @Input() table: any;

  @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();
  @Output() adjustCols: EventEmitter<any> = new EventEmitter();

  faWindowClose = faWindowClose;
  faCheckSquare = faCheckSquare;
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faShare = faShare;
  faBan = faBan;
  faPrint = faPrint;
  faDownload = faDownload;
  faCheckCircle = faCheckCircle;
  public OrdersState = ORDERS;
  role: any;
  isNewRowEnabled: any;
  constructor(public releaseService: ReleasesService) { }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.addInitialRows();
  }
  cancelChildRowClick(row) {
    row.editable = false;
  }
  onSavePropertyVal(row) {
    row.editable = false;
  }
  updateOrderStatus(row, status) {
    console.log(row);
    const orderRecord = [{
      ReleaseOrderId: row.releaseOrderId,
      Quantity: row.quantity,
      ItemPartnerId: row.itemPartner.item.itemId,
      Status: status
    }];
    this.releaseService.updateReleaseOrderStatus(orderRecord).subscribe(newRecords => {
      console.log(newRecords);
      this.rowsUpdate.emit(newRecords);
    });
  }
  addAnotherRow(row) {
    console.log('ADD ANOTHER ROW >>> ', row);
    row.isNewRowEnabled = true;
    this.isNewRowEnabled = true;
    if (!(row.childrenHeight && row.childrenHeight.length === 0)) { row.childrenHeight = 60; }
    console.log('ADJUST COLSSS', row.childrenHeight);
    row.childrenHeight = row.childrenHeight + 30;

    this.adjustCols.emit('new');
  }
  addInitialRows() {

  }
  adjustNewCols(val, row) {
    console.log(val, row.childrenHeight);
    if (row.childrenHeight.length === 0) { row.childrenHeight = 60; }
    console.log('ADJUST COLSSS', val, row.childrenHeight);
    if (val === 'new') {
      row.childrenHeight = row.childrenHeight + 30;
    } else {
      row.childrenHeight = row.childrenHeight - 20;
    }
    this.adjustCols.emit(val);
  }


}
