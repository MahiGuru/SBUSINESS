import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SharedOrdersService } from '../../shared/services/shared-orders.service';
import { Inventory } from '../../core/models/inventory';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import * as _ from 'lodash';
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
    { prop: 'itemNo', name: 'Item #', width: 100 },
    { name: 'Description', width: 850 },
    { prop: 'type', name: 'Type', width: 100 },
    { prop: 'partner', name: 'Partner', width: 100 },
    { name: 'Received', width: 100 },
    { prop: 'sflywip', name: 'SFLY WIP', width: 100 },
    { prop: 'collated', width: 100 },
    { prop: 'waste', width: 100 },
    { prop: 'average', name: 'Overage', width: 100 },
    { prop: 'completed', width: 100 },
    { prop: 'sfonhand', name: 'SF On-hand', width: 100 },
    { prop: 'ponhand', name: 'P On-hand', width: 100 },
    { prop: 'updated', width: 100 }


  ];
  constructor(
    public sharedOrderService: SharedOrdersService,
    public cdr: ChangeDetectorRef,
    public inventoryService: InventoryService) {
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
  async ngOnInit() {
    // this.sharedOrderService.data$.subscribe((val) => {
    //   console.log('SUBSCRIBE >>>> ', val);
    //   this.rows = val;
    // });
    this.inventoryService.getInventoryItems().subscribe((rows: any) => {
      console.log('ROWS, ', rows);
      const tempRows = [];
      _.each(rows, (row) => {
        const inventory = new Inventory(row);
        tempRows.push(inventory);
      });

      this.rows = tempRows;
      console.log(this.rows, tempRows);
    });
    const addedRows = [];
    const calculatedRows = [];
    // this.inventoryService.addedInventoryItems().subscribe((rows: any) => {
    //   addedRows = rows;
    //   this.inventoryService.calculatedInventoryItems().subscribe((rows: any) => {
    //     calculatedRows = rows;
    //     this.rows = _.merge(addedRows, calculatedRows);
    //     console.log("ROWS 2222 ", this.rows);
    //   });
    // });
  }
  isAddBtnClicked(event) {
    this.isAddNewBtnClicked = event;
    this.cdr.detectChanges();
  }

}
