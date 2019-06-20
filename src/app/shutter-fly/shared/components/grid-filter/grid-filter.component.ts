import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import * as _ from 'lodash';

@Component({
  selector: 'sb-grid-filter',
  templateUrl: './grid-filter.component.html',
  styleUrls: ['./grid-filter.component.scss']
})
export class GridFilterComponent implements OnInit, OnChanges {
  @Input() rows: any;
  @Input() totalRows: any;
  @Input() csvHeaders: any;

  @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();
  csvOptions: any;

  origRows: any;
  filterVal: any;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {


  }
  ngOnInit() {
    console.log('this.originalRows', this.totalRows);
    this.csvHeaders = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useBom: true,
      noDownload: false,
      headers: ['Item Id', 'Item No', 'itemDescription', 'itemType', 'partnerType',
        'recieved', 'sflyWip', 'collated', 'waste', 'overAge',
        'completed', 'sfOnHand', 'pOnHand', 'updatedAt']
    };
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

  exportCsv() {
    const csvRows = _.map(this.rows, (row: any) => {
      // console.log(row, row.children);
      return {
        itemId: row.itemPartner.item.itemId,
        itemNo: row.itemPartner.item.itemNo,
        itemDescription: row.itemPartner.item.itemDescription,
        itemType: row.itemPartner.item.itemType,
        partnerType: row.itemPartner.partner.partnerCode,
        recieved: row.recieved,
        sflyWip: row.sflyWip,
        collated: row.collated,
        waste: row.waste,
        overAge: row.overAge,
        completed: row.completed,
        sfOnHand: row.sfOnHand,
        pOnHand: row.pOnHand,
        updatedAt: row.updatedAt
      };
    });
    return new AngularCsv(csvRows, 'Inventory Orders', this.csvHeaders);
  }


}
