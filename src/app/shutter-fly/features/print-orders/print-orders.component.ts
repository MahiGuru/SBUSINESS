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

  // updateFilter(filterVal) {
  //   const val = filterVal.toLowerCase();
  //   // filter our data
  //   const temp = this.temp.filter((d) => {
  //     return d.itemType.toLowerCase().indexOf(val) !== -1 || !val;
  //   });

  //   // update the rows
  //   this.rows = temp;
  //   // Whenever the filter changes, always go back to the first page
  //   this.table.offset = 0;
  // }
  // toggleExpandRow(row) {
  //   this.rows.unshift(new Inventory());
  //   this.rows = [...this.rows];

  //   const addRow = new Inventory();
  //   this.addedRows = [
  //     ...this.addedRows, addRow
  //   ];

  //   setTimeout(() => {
  //     this.table.rowDetail.toggleExpandRow(this.rows[0]);
  //   }, 100);
  // }
  // addAnotherRow() {
  //   const addRow = new Inventory();
  //   this.addedRows.push(addRow);
  //   this.newRowHeight += 30;
  // }
  // removeCurrentRow(currentRow) {
  //   this.addedRows.splice(this.addedRows.indexOf(currentRow), 1);
  //   this.newRowHeight -= 30;
  // }
  // onDetailToggle(event) {
  //   // console.log('Detail Toggled', event);
  // }
  ngOnInit() {
    // this.sharedOrderService.data$.subscribe((val) => {
    //   // console.log('PRINT ORDER >>> SUBSCRIBE >>>> ', val);
    //   this.rows = val;
    // });
    this.printService.getAllPrintRecords().subscribe((rows: any) => {
      // // console.log('ROWS, ', rows);
      const tempRows = [];
      _.each(rows, (row) => {
        const inventory = new PrintOrder(row);
        tempRows.push(inventory);
      });

      this.rows = tempRows;
      // // console.log(this.rows, tempRows, '\n\n\n\n\n');
    });
  }
  toggleExpandRow(row) {
    this.isAddNewBtnClicked = true;
  }
  // addRowsToInventory() {
  //   if (this.addedRows.length > 0) {
  //     this.rows.splice(0, 1);
  //     this.addedRows.forEach(row => {
  //       this.rows.unshift(row);
  //     });
  //     this.rows = [...this.rows];
  //     this.table.rowDetail.toggleExpandRow(this.rows[0]);
  //   }
  // }
  // cancelNewInventory() {
  //   this.rows.splice(0, 1);
  //   this.addedRows = [];
  //   this.rows = [...this.rows];
  //   this.table.rowDetail.toggleExpandRow(this.rows[0]);
  // }

  // deleteOrder() {
  //   const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //     width: '350px',
  //     height: '350px',
  //     data: {}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     // console.log('The dialog was closed');
  //     // this.animal = result;
  //   });
  // }

  isAddBtnClicked(event) {
    this.isAddNewBtnClicked = event;
    this.cdr.detectChanges();
  }

}
