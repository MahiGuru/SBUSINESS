import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import {
  faWindowClose, faCheckSquare,
  faPencilAlt, faTrashAlt, faShare, faBan, faPrint, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { PrintOrderService } from 'src/app/shutter-fly/shared/services/print-order.service';

@Component({
  selector: 'sb-print-sub-orders',
  templateUrl: './print-sub-orders.component.html',
  styleUrls: ['./print-sub-orders.component.scss']
})
export class PrintSubOrdersComponent implements OnInit {

  @Input() row: any;
  @Input() rows: any;
  @Input() table: any;

  @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();

  faWindowClose = faWindowClose;
  faCheckSquare = faCheckSquare;
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faShare = faShare;
  faBan = faBan;
  faPrint = faPrint;
  faCheckCircle = faCheckCircle;
  role: any;
  constructor(public printerService: PrintOrderService) { }

  ngOnInit() {
    this.role = localStorage.getItem('role');
  }
  cancelChildRowClick(row) {
    row.editable = false;
  }
  onSavePropertyVal(row) {
    row.editable = false;
  }
  updateOrderStatus(row, status) {
    const orderRecord = [{
      PrintOrderId: row.printOrderId,
      Quantity: row.quantity,
      ItemPartnerId: row.itemPartner.item.itemId,
      Status: status
    }];
    this.printerService.updatePrintOrderStatus(orderRecord).subscribe(newRecords => {
      console.log('SAVEDDDD', newRecords);
      this.rowsUpdate.emit(this.rows);
    });
  }
}
