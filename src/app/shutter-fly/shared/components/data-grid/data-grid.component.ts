import {
  Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter,
  Input, SimpleChanges, OnChanges, ChangeDetectorRef, HostListener, ElementRef, Renderer2, AfterViewInit, AfterContentInit, AfterViewChecked
} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SharedOrdersService } from '../../services/shared-orders.service';

import * as _ from 'lodash';

import {
  faCaretRight, faCaretDown, faWindowClose, faCheckSquare,
  faPencilAlt, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { Inventory } from '../../../core/models/newInventory';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import { FormBuilder } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'sb-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataGridComponent implements OnInit, OnChanges/*, AfterViewInit, AfterViewChecked */ {
  @Input() cols: any;
  @Input() rows: any;
  @Input() newBtnClicked: boolean;
  public originalRows: any;
  public newAddedRow: any = [];

  faCaretRight = faCaretRight;
  faCaretDown = faCaretDown;
  faWindowClose = faWindowClose;
  faCheckSquare = faCheckSquare;
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;

  isNewRowEnabled: boolean;

  @Output() isAddBtnClicked: EventEmitter<any> = new EventEmitter();
  filterVal: any;
  public addedRows = [];
  public newRowHeight: any = 100;

  isEditable = {};
  isChildrenEditable = {};
  editChildRowIndex;
  windowHeight: any;
  windowWidth: any;
  colWidth: any;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  colCount: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth - 200;
    console.log(this.windowHeight, this.windowWidth);
  }

  constructor(public sharedOrderService: SharedOrdersService,
              public inventoryService: InventoryService,
              public fb: FormBuilder,
              public cdr: ChangeDetectorRef,
              public dialog: MatDialog,
              private renderer: Renderer2,
              private elem: ElementRef) {
    this.getScreenSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.newBtnClicked && changes.newBtnClicked.currentValue) {
      this.newBtnClicked = changes.newBtnClicked.currentValue;
      this.addNewBtnClicked();
    }
    if (changes.rows && changes.rows.currentValue && changes.rows.currentValue.length > 0) {
      this.originalRows = this.rows;
      this.setColHeaderWidth();
      this.dataTableBodyCellWidth();
    }
  }

  /** Datatable body column width */
  dataTableBodyCellWidth() {
    setTimeout(() => {
      console.log('DATA TABLE BODY CELL');
      const bodyCellRow = this.elem.nativeElement.querySelectorAll('.datatable-body-row');
      this.setBodyCellWidth(bodyCellRow);
    }, 300);
  }
  /** SET COLS HEADER WIDTH */
  setColHeaderWidth() {
    const colWidth = (this.windowWidth / (this.cols.length + 1));
    setTimeout(() => {
      const twoElem = this.elem.nativeElement.querySelectorAll('.datatable-header-cell');
      this.setColWidth(twoElem, colWidth);
    }, 500);
  }
  /** Datatable Header column width */
  setBodyCellWidth(bodyCellRow) {
    const colWidth = (this.windowWidth / (this.cols.length + 1));
    _.each(bodyCellRow, (bodyCell, i) => {
      bodyCell.classList.add('w-active');
      const tblbodyCell = bodyCell.querySelectorAll('.datatable-body-cell');
      this.setColWidth(tblbodyCell, colWidth);
    });
  }
  /*** Adjust New Cols width */
  setNewColsWidth() {
    setTimeout(() => {
      const colWidth = (this.windowWidth / (this.cols.length + 1));
      const childRow = this.elem.nativeElement.querySelectorAll('.add-row-section');
      _.each(childRow, (childCell, i) => {
        const tblbodyCell = childCell.querySelectorAll('.new-item');
        this.setColWidth(tblbodyCell, colWidth);
      });
    }, 500);
  }
  /*** SET Column width */
  setColWidth(tblbodyCell, colWidth) {
    _.each(tblbodyCell, (tblCell, j) => {
      if (j === 0) {
        tblCell.style.width = (colWidth + 100) + 'px';
      } else if (j === 1) {
        tblCell.style.width = (colWidth + 200) + 'px';
      } else {
        tblCell.style.width = colWidth - (370 / (this.cols.length + 1)) + 'px';
      }
    });
  }

  /** TOGGLE EXPAND ROW  */
  toggleExpandRow(row) {
    this.newRowHeight = 0;
    const childRows = [];
    _.each(row.children, (chrow) => {
      childRows.push(new Inventory(chrow));
    });
    row.children = childRows;
    this.table.rowDetail.toggleExpandRow(row);
    this.newRowHeight += row.children ? row.children.length * 60 : this.newRowHeight;
    setTimeout(() => {
      const colWidth = (this.windowWidth / (this.cols.length + 1));
      const childRow = this.elem.nativeElement.querySelectorAll('.newRow');
      _.each(childRow, (childCell, i) => {
        childCell.classList.add('w-row-active');
        const tblbodyCell = childCell.querySelectorAll('.child-item');
        this.setColWidth(tblbodyCell, colWidth);
      });
    }, 500);
  }

  /** Pagination Callback */
  paginationCallback(event) {
    this.dataTableBodyCellWidth();
  }

  addNewBtnClicked() {
    // const control = this.myForm.controls.addRows as FormArray;
    this.rows.unshift(new Inventory());
    this.rows = [...this.rows];
    this.isNewRowEnabled = true;
    this.newRowHeight = 100;
    setTimeout(() => {
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
      this.setNewColsWidth();
    }, 100);
  }

  ngOnInit() {
  }


  updateFilter(filterVal) {
    console.log(this.originalRows);
    if (filterVal === '') { this.rows = this.originalRows; }
    const val = filterVal.toLowerCase();
    // filter our data
    const temp = this.rows.filter((d) => {
      return d.itemPartner.item.itemNo.toLowerCase().indexOf(val) !== -1 || !val;
    });
    console.log('FILTERED >>>> ', filterVal);
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  onSaveRowsUpdate(newRecords) {
    const merged = _.merge(_.keyBy(this.rows, 'itemPartner.item.itemNo'), _.keyBy(newRecords, 'itemPartner.item.itemNo'));
    this.rows = _.values(merged);
    this.dataTableBodyCellWidth();
  }

  trashInventoryItem(row) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        row,
        title: 'Delete Inventory Item',
        description: 'Are you sure you want to delete this item?',
        noLabel: 'Cancel',
        yesLabel: 'Delete'
      },
      panelClass: 'confirm-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const record = {
          ItemPartner: {
            ItemPartnerId: result.row.itemPartner.item.itemId
          }
        };
        this.inventoryService.deleteInventory(record).subscribe(newRecords => {
          this.rows = _.filter(this.rows, (n) => n.itemPartner.item.itemNo !== row.itemPartner.item.itemNo);
        });
      }
    });
  }


  updateRowValue(event, rowIndex) {
    // console.log('inline editing rowIndex', rowIndex, event);
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
  }

  updateEditedValue(rowIndex, waste) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
  }
  editValUpdate(event, row) {
    row.waste = event.target.value;
  }

  public getRowIndex(row: any): number {
    // console.log(row);
    return this.table.bodyComponent.getRowIndex(row);   // row being data object passed into the template
  }

  updateChildRowValue(event, rowIndex, childIndex) {
    // console.log('inline editing rowIndex', rowIndex, event);
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
  }
  updateEditedChildRowValue(rowIndex, childIndex, waste) {
    // console.log(rowIndex, childIndex, waste, this.rows[rowIndex].children[childIndex]);
    this.rows[rowIndex].children[childIndex].waste = waste;
    this.editChildRowIndex = null;

    // this.rows[rowIndex].children[childrenIndex].waste
  }
  editChildrenRowClick(rowIndex, childrenIndex) {
    this.editChildRowIndex = childrenIndex;
    // console.log(this.editChildRowIndex);
  }
  cancelChildRowClick(rowIndex, childrenIndex) {
    this.editChildRowIndex = null;
  }
  cleaFilterInput() {
    console.log('clearInput');
    this.filterVal = '';
    this.rows = [...this.originalRows];
    this.cdr.detectChanges();
  }



  /***** OUTPUT CALLBACKS */
  rowsUpdate(rows) {

  }

  adjustCols(type) {
    console.log('TYPPPPPE', type);
    if (type === 'new') {
      this.newRowHeight += 60;
      setTimeout(() => {
        const colWidth = (this.windowWidth / (this.cols.length + 1));
        const childRow = this.elem.nativeElement.querySelectorAll('.add-row-section');
        _.each(childRow, (childCell, i) => {
          const tblbodyCell = childCell.querySelectorAll('.new-item');
          this.setColWidth(tblbodyCell, colWidth);
        });
      }, 500);
    } else if (type === 'cancel') {
      this.rows.splice(0, 1);
      this.rows = [...this.rows];
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
      this.isAddBtnClicked.emit(false);
      this.isNewRowEnabled = false;
      this.newRowHeight = 100;
      this.dataTableBodyCellWidth();
    }
  }
}
