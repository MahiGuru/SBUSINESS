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
  addChildrenRows() {
  }
  removeCurrentRow(i) {
    // const control = this.myForm.controls.addRows as FormArray;
    // control.removeAt(i);
    // this.adjustCols.emit('remove');
  }
  addAnotherRow(row) {
    console.log(row);
    row.isNewRowEnabled = true;
    this.adjustCols.emit('new');
    // const control = this.myForm.controls.addRows as FormArray;
    // control.push(this.fb.group({
    //   itemNo: [1],
    //   itemDesc: [1],
    //   itemType: [''],
    //   partner: [1]
    // }));
    // this.adjustCols.emit('new');
  }
  addInitialRows() {
    // const control = this.myForm.controls.addRows as FormArray;
    // control.push(this.fb.group({
    //   itemNo: [1],
    //   itemDesc: [1],
    //   itemType: [''],
    //   partner: [1]
    // }));
    // control.controls[0].get('itemNo').setValue(this.selectedItem.itemId);
    // control.controls[0].get('itemDesc').setValue(this.selectedItem.itemId);
    // control.controls[0].get('itemType').setValue(this.selectedItem.itemType);
  }


}
