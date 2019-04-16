import { Component, OnInit, ViewChild } from '@angular/core';
import { ORDERS } from '../core/models/order-state';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SharedOrdersService } from '../shared/services/shared-orders.service';
import { MatDialog } from '@angular/material';
import { Inventory } from '../core/models/inventory';

@Component({
  selector: 'sb-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss']
})
export class ReleasesComponent implements OnInit {
  rows = [];
  filterVal: any;
  temp = [];
  public newRowHeight: any = 100;
  public addedRows = [];
  public OrdersState = ORDERS;
  columns = [
    { prop: 'id', name: 'Item #', width: 100 },
    { name: 'Description', width: 250 },
    { prop: 'itemType', name: 'Item Type', width: 100 },
    { prop: 'assemblyPartner', name: 'Assembly Partner', width: 100 },
    { name: 'Received', width: 100 },
    { name: 'Committed', width: 100 },
    { name: 'Adjustment', width: 100 },
    { name: 'Shipped', width: 100 },
    { name: 'On-hand', prop: 'onhand', width: 100 },
    { name: 'Updated', width: 100 },
    { name: 'Status', prop: 'status', width: 100 }
  ];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  names: any;
  constructor(public sharedOrderService: SharedOrdersService, public dialog: MatDialog) {

  }

  updateFilter(filterVal) {
    const val = filterVal.toLowerCase();
    // filter our data
    const temp = this.temp.filter((d) => {
      return d.itemType.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  toggleExpandRow(row) {
    this.rows.unshift(new Inventory());
    this.rows = [...this.rows];

    const addRow = new Inventory();
    this.addedRows = [
      ...this.addedRows, addRow
    ];

    setTimeout(() => {
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
    }, 100);
  }
  addAnotherRow() {
    const addRow = new Inventory();
    this.addedRows.push(addRow);
    this.newRowHeight += 30;
  }
  removeCurrentRow(currentRow) {
    this.addedRows.splice(this.addedRows.indexOf(currentRow), 1);
    this.newRowHeight -= 30;
  }
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  ngOnInit() {
    this.sharedOrderService.data$.subscribe((val) => {
      console.log('PRINT ORDER >>> SUBSCRIBE >>>> ', val);
      this.rows = val;
    });
  }
  addRowsToInventory() {
    if (this.addedRows.length > 0) {
      this.rows.splice(0, 1);
      this.addedRows.forEach(row => {
        this.rows.unshift(row);
      });
      this.rows = [...this.rows];
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
    }
  }
  cancelNewInventory() {
    this.rows.splice(0, 1);
    this.addedRows = [];
    this.rows = [...this.rows];
    this.table.rowDetail.toggleExpandRow(this.rows[0]);
  }



}
