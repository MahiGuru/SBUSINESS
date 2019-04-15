import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Inventory } from 'src/app/core/models/inventory';

@Component({
  selector: 'sb-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataGridComponent implements OnInit {
  rows = [];
  filterVal: any;
  temp = [];
  @Output() totalRows: EventEmitter<any> = new EventEmitter();
  public newRowHeight: any = 100;
  public newRow = {
    id: 0,
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

      // push our inital complete list
      console.log(data);
      data.forEach(item => {
        console.log(item);
        const itemRow = new Inventory(item);
        this.temp.push(itemRow);
      });
      this.rows = this.temp;
      // this.rows = data;
    });

  }
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/data.json`);
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
    this.rows = temp;
    this.totalRows.emit(this.rows);
    this.table.offset = 0;
  }
  toggleExpandRow(row) {
    this.rows.unshift(this.newRow);
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

  addRowsToInventory() {
    if(this.addedRows.length > 0){
      this.rows.splice(0, 1);
      this.addedRows.forEach(row => {
        this.rows.unshift(row);
      });
      this.rows = [...this.rows];
      this.totalRows.emit(this.rows);
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
    }
  }
  cancelNewInventory(){
      this.rows.splice(0, 1);
      this.addedRows = [];
      this.rows = [...this.rows];
      this.totalRows.emit(this.rows);
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
  }
  ngOnInit() {

  }
}
