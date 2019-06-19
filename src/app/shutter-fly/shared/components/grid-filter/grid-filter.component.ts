import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'sb-grid-filter',
  templateUrl: './grid-filter.component.html',
  styleUrls: ['./grid-filter.component.scss']
})
export class GridFilterComponent implements OnInit, OnChanges {
  @Input() rows: any;
  @Input() totalRows: any;

  @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();

  origRows: any;
  filterVal: any;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {


  }
  ngOnInit() {
    console.log('this.originalRows', this.totalRows);
  }

  updateFilter(filterVal) {
    if (filterVal === '') { this.rowsUpdate.emit(this.rows); }
    const val = filterVal ? filterVal.toLowerCase() : filterVal;
    // filter our data
    const temp = this.totalRows.filter((d) => {
      if (d.itemPartner) {
        return (d.itemPartner.item.itemNo.toLowerCase().indexOf(val) !== -1 ||
          d.itemPartner.item.itemType.toLowerCase().indexOf(val) !== -1 ||
          d.itemPartner.item.itemDescription.toLowerCase().indexOf(val) !== -1
          || !val);
      }
      return false;
    });
    // update the rows
    this.rows = temp;
    this.rowsUpdate.emit(temp);
  }

  cleaFilterInput() {
    console.log('clearInput', this.totalRows);
    this.filterVal = '';
    this.rows = this.totalRows;
    this.rowsUpdate.emit(this.totalRows);
  }



}
