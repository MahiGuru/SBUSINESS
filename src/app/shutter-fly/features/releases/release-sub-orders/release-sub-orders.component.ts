import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import {
  faWindowClose, faCheckSquare,
  faPencilAlt, faTrashAlt, faShare, faBan, faPrint, faCheckCircle
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

  faWindowClose = faWindowClose;
  faCheckSquare = faCheckSquare;
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faShare = faShare;
  faBan = faBan;
  faPrint = faPrint;
  faCheckCircle = faCheckCircle;
  public OrdersState = ORDERS;

  constructor(public releaseService: ReleasesService) { }

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
    this.releaseService.updateReleaseOrderStatus(orderRecord).subscribe(newRecords => {
      console.log(newRecords);
    });
  }
}
