import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SharedOrdersService } from '../../shared/services/shared-orders.service';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { ReleasesService } from 'src/app/shutter-fly/shared/services/releases.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ReleaseOrder } from 'src/app/shutter-fly/core/models/releaseOrder';
import { ORDERS } from 'src/app/shutter-fly/core/models/order-state';

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
  public OrdersState = ORDERS;
  public addedRows = [];
  public isAddNewBtnClicked = false;

  columns = [
    { prop: 'itemNo', name: 'Item #' },
    { name: 'Description' },
    { prop: 'type', name: 'Type' },
    { prop: 'printer', name: 'Printers' },
    { prop: 'quantity', name: 'Quantity' },
    { prop: 'poNum', name: 'PO #' },
    { prop: 'jobNum', name: 'Job #' },
    { prop: 'createdAt', name: 'Created' },
    { prop: 'status', name: 'Status' }


  ];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  names: any;
  constructor(public releaseService: ReleasesService, public dialog: MatDialog, public cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.releaseService.getAllReleaseRecords().subscribe((rows: any) => {
      console.log('ROWS, ', rows);
      const tempRows = [];
      _.each(rows, (row) => {
        const inventory = new ReleaseOrder(row);
        tempRows.push(inventory);
      });

      this.rows = tempRows;
      console.log(this.rows, tempRows, '\n\n\n\n\n');
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
