import {
  Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter,
  Input, SimpleChanges, OnChanges
} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SharedOrdersService } from '../../services/shared-orders.service';
import { Inventory } from '../../../core/models/inventory';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'sb-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataGridComponent implements OnInit, OnChanges {
  @Input() cols: any;
  @Input() rows: any;
  @Input() newBtnClicked: boolean;
  public originalRows: any;
  public newAddedRow: any = [];
  @Output() isAddBtnClicked: EventEmitter<any> = new EventEmitter();
  filterVal: any;
  public addedRows = [];
  public newRowHeight: any = 100;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  constructor(public sharedOrderService: SharedOrdersService, public http: HttpClient) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.newBtnClicked && changes.newBtnClicked.currentValue) {
      this.newBtnClicked = changes.newBtnClicked.currentValue;
      this.addNewBtnClicked();
    }
  }

  ngOnInit() {
    this.originalRows = this.rows;

  }

  addNewBtnClicked() {
    this.rows.unshift(new Inventory());
    this.rows = [...this.rows];
    const addRow = new Inventory();
    this.addedRows = [
      ...this.addedRows, addRow
    ];
    console.log('addedRows >>> ', this.addedRows);
    setTimeout(() => {
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
    }, 100);
  }

  updateFilter(filterVal) {
    if (filterVal === '') { this.rows = this.originalRows; }
    const val = filterVal.toLowerCase();
    // filter our data
    const temp = this.rows.filter((d) => {
      return d.itemType.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
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
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  addRowsToInventory() {
    if (this.addedRows.length > 0) {
      this.rows.splice(0, 1);
      this.addedRows.forEach(row => {
        this.rows.unshift(row);
      });
      this.rows = [...this.rows];
      this.sharedOrderService.updateOrders(this.rows);
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
    }
  }
  cancelNewInventory() {
    this.rows.splice(0, 1);
    this.addedRows = [];
    this.rows = [...this.rows];
    this.table.rowDetail.toggleExpandRow(this.rows[0]);
    this.isAddBtnClicked.emit(false);
  }
}
