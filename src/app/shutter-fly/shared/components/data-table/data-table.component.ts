import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'ag-grid-enterprise';

@Component({
  selector: 'sb-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.sass']
})
export class DataTableComponent implements OnInit {

  public gridApi;
  public gridColumnApi;

  public columnDefs;
  public defaultColDef;
  public rowData: any = [];
  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        headerName: 'Country',
        field: 'country',
        width: 120,
        rowGroup: true
      },
      {
        headerName: 'Year',
        field: 'year',
        width: 90,
        rowGroup: true
      },
      {
        headerName: 'Sport',
        field: 'sport',
        width: 110
      },
      {
        headerName: 'Athlete',
        field: 'athlete',
        width: 200
      },
      {
        headerName: 'Gold',
        field: 'gold',
        width: 100
      },
      {
        headerName: 'Silver',
        field: 'silver',
        width: 100
      },
      {
        headerName: 'Bronze',
        field: 'bronze',
        width: 100
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 100
      },
      {
        headerName: 'Age',
        field: 'age',
        width: 90
      },
      {
        headerName: 'Date',
        field: 'date',
        width: 110
      }
    ];
    this.defaultColDef = {
      sortable: true,
      filter: true
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get(
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json'
      )
      .subscribe(data => {
        this.rowData = data;
      });
  }
  ngOnInit() { }
}
