import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SharedOrdersService } from '../../shared/services/shared-orders.service';
import { Inventory } from '../../core/models/inventory';

@Component({
  selector: 'sb-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  rows = [];
  filterVal: any;
  temp = [];
  public newRowHeight: any = 100;
  public addedRows = [];
  public isAddNewBtnClicked = false;

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
    { name: 'Updated', width: 100 }
  ];
  constructor(public sharedOrderService: SharedOrdersService, public cdr: ChangeDetectorRef) {
  }

  toggleExpandRow(row) {
    this.isAddNewBtnClicked = true;
    // this.rows.unshift(new Inventory());
    // this.rows = [...this.rows];

    // const addRow = new Inventory();
    // this.addedRows = [
    //   ...this.addedRows, addRow
    // ];

    // setTimeout(() => {
    //   this.table.rowDetail.toggleExpandRow(this.rows[0]);
    // }, 100);
  }
  ngOnInit() {
    this.sharedOrderService.data$.subscribe((val) => {
      console.log('SUBSCRIBE >>>> ', val);
      this.rows = val;
    });
  }
  isAddBtnClicked(event) {
    this.isAddNewBtnClicked = event;
    this.cdr.detectChanges();
  }

}
