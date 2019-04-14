import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'sb-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  // rows = [
  //   {
  //     name: 'Austin', description: 'Male', itemType: 'Swimlane',
  //     assemblyPartner: 'Male', received: 'Swimlane', committed: 'Male', adjustment: 'Swimlane'
  //     , shipped: 'Swimlane'
  //     , onhand: 'Swimlane'
  //     , updated: 'Swimlane'
  //   }

  // ];
  // columns = [
  //   { prop: 'Item#', name: 'Item #' },
  //   { name: 'Description' },
  //   { name: 'Item Type' },
  //   { name: 'Assembly Partner' },
  //   { name: 'Received' },
  //   { name: 'Committed' },
  //   { name: 'Adjustment' },
  //   { name: 'Shipped' },
  //   { name: 'On-hand', prop: 'onhand' },
  //   { name: 'Updated' }
  // ];
  rows = [];
  filterVal: any;
  temp = [];

  columns = [
    { prop: 'id', name: 'Item #' },
    { name: 'Description' },
    { prop: 'itemType', name: 'Item Type' },
    { prop: 'assemblyPartner', name: 'Assembly Partner' },
    { name: 'Received' },
    { name: 'Committed' },
    { name: 'Adjustment' },
    { name: 'Shipped' },
    { name: 'On-hand', prop: 'onhand' },
    { name: 'Updated' }
  ];
  @ViewChild(DatatableComponent) table: DatatableComponent;

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
  ngOnInit() {

  }
}
