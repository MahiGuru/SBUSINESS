import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

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
  public newRow = {
    id: '',
    description: '',
    itemType: '',
    assemblyPartner: '',
    received: '',
    committed: '',
    adjustment: '',
    shipped: '',
    onhand: '',
    updated: ''

  };
  public addRows: any = {
    id: '',
    description: '',
    itemType: '',
    assemblyPartner: '',
    received: '',
    committed: '',
    adjustment: '',
    shipped: '',
    onhand: '',
    updated: ''
  };

  public addedRows = [];
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
  @ViewChild(DatatableComponent) table: DatatableComponent;
  names: any;
  constructor() {
    this.fetch((data) => {
      // cache our list
      this.temp = [...data];

      // push our inital complete list
      console.log(data);
      this.rows = data;
    });

  }
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/data.json`);
    this.names = ['MAHIPAL', 'GURJALA'];
    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
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
    this.rows.unshift(this.newRow);
    this.rows = [...this.rows];

    this.addedRows = [
      ...this.addedRows, this.addRows
    ];

    setTimeout(() => {
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
    }, 100);
  }
  addAnotherRow() {
    console.log(this.addedRows);
    this.addedRows = [
      ...this.addedRows, this.addRows
    ];
    this.newRowHeight += 30;
  }
  removeCurrentRow(currentRow) {
    console.log(this.addedRows.indexOf(currentRow));
    this.addedRows.splice(this.addedRows.indexOf(currentRow), 1);
  }
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  ngOnInit() {

  }
}
