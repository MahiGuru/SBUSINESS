import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog } from '@angular/material';
import { ORDERS } from '../../core/models/order-state';
import { PrintOrderService } from './../../shared/services/print-order.service';
import * as _ from 'lodash';
import { PrintOrder } from 'src/app/shutter-fly/core/models/printOrder';

@Component({
  selector: 'sb-print-orders',
  templateUrl: './print-orders.component.html',
  styleUrls: ['./print-orders.component.scss']
})
export class PrintOrdersComponent implements OnInit {
  rows = [];
  filterVal: any;
  temp = [];
  public newRowHeight: any = 100;
  public addedRows = [];
  public OrdersState = ORDERS;
  public isAddNewBtnClicked = false;
  columns = [
    { prop: 'itemNo', name: 'Item #', width: 100 },
    { name: 'Description', width: 850 },
    { prop: 'type', name: 'Type', width: 100 },
    { prop: 'partner', name: 'Partner', width: 100 },
    { prop: 'quantity', name: 'Quantity', width: 100 },
    { prop: 'poNum', name: 'PO #', width: 100 },
    { prop: 'quantity', name: 'Quantity', width: 100 },
    { prop: 'poNum', name: 'PO #', width: 100 },
    { prop: 'jobNum', name: 'Job #', width: 100 },
    { prop: 'createdAt', name: 'Created', width: 100 },
    { prop: 'status', name: 'Status' }
  ];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  names: any;
  constructor(public printService: PrintOrderService, public dialog: MatDialog, public cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.printService.getAllPrintRecords().subscribe((rows: any) => {
      const tempRows = [];
      _.each(rows, (row) => {
        const inventory = new PrintOrder(row);
        tempRows.push(inventory);
      });

      this.rows = tempRows;
    });
  }
  toggleExpandRow(row) {
    this.isAddNewBtnClicked = true;
  }

  isAddBtnClicked(event) {
    this.isAddNewBtnClicked = event;
    this.cdr.detectChanges();
  }

}
