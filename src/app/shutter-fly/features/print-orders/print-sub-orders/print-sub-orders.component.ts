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

  constructor(public printerService: PrintOrderService) { }

  ngOnInit() {
  }
  cancelChildRowClick(row) {
    row.editable = false;
  }
  onSavePropertyVal(row) {
    row.editable = false;
  }
  updateOrderStatus(id, status) {
    const orderRecord = [{
      PrintOrderId: id,
      Status: status
    }];
    this.printerService.updatePrintOrderStatus(orderRecord).subscribe(newRecords => {
      this.rowsUpdate.emit(newRecords);
      console.log(newRecords);
      _.each(this.rows, (row, i) => {
        _.each(row.children, (child, j) => {
          if (child.printOrderId === newRecords[0].printOrderId) {
            child.status = newRecords[0].status;
          }
        });
      });
      this.rows = [...this.rows];
      this.rowsUpdate.emit(this.rows);
    });
  }
}
