import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'sb-grid-filter',
  templateUrl: './grid-filter.component.html',
  styleUrls: ['./grid-filter.component.sass']
})
export class GridFilterComponent implements OnInit {
  @Input() rows: any;

  @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();

  origRows: any;
  filterVal: any;

  constructor() { }

  ngOnInit() {
  }

  updateFilter(filterVal) {
    console.log(this.rows);
    this.origRows = this.rows;
    if (filterVal === '') { this.rowsUpdate.emit(this.rows); }
    const val = filterVal.toLowerCase();
    // filter our data
    const temp = this.rows.filter((d) => {
      return d.itemPartner.item.itemNo.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
    this.rowsUpdate.emit(temp);
  }

  cleaFilterInput() {
    console.log('clearInput', this.origRows);
    this.filterVal = '';
    this.rows = this.origRows;
    this.rowsUpdate.emit(this.origRows);

  }



}
