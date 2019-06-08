import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SharedOrdersService } from '../../shared/services/shared-orders.service';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import * as _ from 'lodash';
import { Inventory } from '../../core/models/newInventory';
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
  }
  async ngOnInit() {
    this.inventoryService.getInventoryItems().subscribe((rows: any) => {
      // // console.log('ROWS, ', rows);
      const tempRows = [];
      _.each(rows, (row) => {
        const inventory = new Inventory(row);
        tempRows.push(inventory);
      });

      this.rows = tempRows;
      // // console.log(this.rows, tempRows);
    });
  }
  isAddBtnClicked(event) {
    this.isAddNewBtnClicked = event;
    this.cdr.detectChanges();
  }

}
