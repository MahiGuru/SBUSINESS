import {
  Component, OnInit, ViewChild, Output, EventEmitter,
  Input, SimpleChanges, OnChanges, HostListener, ElementRef
} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';

import {
  faCaretRight, faCaretDown, faWindowClose, faCheckSquare,
  faPencilAlt, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { Inventory } from '../../../core/models/newInventory';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/shutter-fly/shared/components/confirm-dialog/confirm-dialog.component';
import { CommonService } from 'src/app/shutter-fly/shared/services/common.service';


@Component({
  selector: 'sb-inventory-data-grid',
  templateUrl: './inventory-data-grid.component.html',
  styleUrls: ['./inventory-data-grid.component.scss']
})
export class InventoryDataGridComponent implements OnInit, OnChanges {
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

  windowHeight: any;
  windowWidth: any;
  colWidth: any;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  colCount: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth - 200;
  }

  constructor(public inventoryService: InventoryService,
              public dialog: MatDialog,
              public commonService: CommonService,
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


  /** TOGGLE EXPAND ROW  */
  toggleExpandRow(row) {
    // this.newRowHeight = 0;
    row.childrenHeight = 0;
    const childRows = [];
    _.each(this.rows, (r) => {
      r.expanded = false;
    });
    _.each(row.children, (chrow) => {
      childRows.push(new Inventory(chrow));
    });
    row.children = childRows;
    row.childrenHeight = (row.children && row.children.length > 0) ? row.children.length * 60 : 100;
    console.log(row);
    this.table.rowDetail.toggleExpandRow(row);
    this.setColsFromMultiLevelElements('newRow', 'child-item');
    this.setRowDetailHeight(row);

  }


  /** Pagination Callback */
  paginationCallback(event) {
    this.dataTableBodyCellWidth();
  }

  addNewBtnClicked() {
    this.rows.unshift(new Inventory());
    this.rows = [...this.rows];
    this.isNewRowEnabled = true;
    this.newRowHeight = 50;
    setTimeout(() => {
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
      this.setColsFromMultiLevelElements('add-row-section', 'new-item');
      this.dataTableBodyCellWidth();
      this.rows[0].childrenHeight = 50;
      this.setRowDetailHeight(this.rows[0]);
    }, 100);
  }

  ngOnInit() {
  }

  /*** filter input change output callback */
  filterCallback(rows) {
    this.rows = [...rows];
    console.log(rows, this.rows);
    this.dataTableBodyCellWidth();
  }

  /*** ON SAVE new rows output callback */
  onSaveRowsUpdate(newRecords) {
    this.isNewRowEnabled = false;
    this.commonService.openSnackBar('Successfully Created', 'SAVE');
    const merged = _.merge(_.keyBy(this.rows, 'itemPartner.item.itemNo'), _.keyBy(newRecords, 'itemPartner.item.itemNo'));
    this.rows = _.values(merged);
    this.dataTableBodyCellWidth();
  }

  /*** Delete rows functionality here */
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
        const record = { ItemPartner: { ItemPartnerId: result.row.itemPartner.item.itemId } };
        this.inventoryService.deleteInventory(record).subscribe(newRecords => {
          this.commonService.openSnackBar('Successfully Deleted', 'DELETE', 'delete-snack');
          this.rows = _.filter(this.rows, (n) => n.itemPartner.item.itemNo !== row.itemPartner.item.itemNo);
          this.dataTableBodyCellWidth();
        }, err => {
          console.log(err);
          const error: any = this.commonService.strToObj(err.error);
          this.commonService.openSnackBar(error.Error, 'DELETE', 'error-snack');

        });
      }
    });
  }

  /** save edited value using waste API */
  updateEditedValue(row) {
    console.log(row);
    const data = [{
      ReleaseOrderId: row.itemPartner.item.itemId,
      Waste: row.waste,
    }
    ];
    this.inventoryService.updateInventoryOrder(data).subscribe(res => {
      console.log(res);
      row.editable = false;
      this.commonService.openSnackBar('Successfully Updated', 'UPDATE', 'warning-snack');
    }, err => {
      row.editable = false;
      const error: any = this.commonService.strToObj(err.error);
      this.commonService.openSnackBar(error.Error, 'UPDATE FAILED', 'error-snack');
    });
  }

  /***** OUTPUT CALLBACKS  - NEW ROWS */
  rowsUpdate(rows) { }

  adjustCols(type) {
    if (type === 'new') {
      this.rows[0].childrenHeight += 60;
      this.setColsFromMultiLevelElements('add-row-section', 'new-item');
    } else if (type === 'remove') {
      this.rows[0].childrenHeight -= 60;
    } else if (type === 'cancel') {
      this.rows.splice(0, 1);
      this.rows = [...this.rows];
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
      this.isAddBtnClicked.emit(false);
      this.isNewRowEnabled = false;
      this.newRowHeight = 100;
      this.rows[0].childrenHeight = 50;
      this.dataTableBodyCellWidth();
    }
    this.setRowDetailHeight(this.rows[0]);
  }

  /**********************************************************
   * * ALIGNMENT METHODS
   * ********************************************************
   * /
   *
  /***ROW DETAIL HEIGHT ADJUST HERE  */
  setRowDetailHeight(row) {
    console.log(row.childrenHeight);
    setTimeout(() => {
      const rowDetailDivs = this.elem.nativeElement.querySelectorAll('.datatable-row-detail');
      _.each(rowDetailDivs, (elem) => {
        elem.style.height = 'auto';
      });
    }, 100);
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

  /** Loop Parent elements and inside children element loop and apply the width */
  setColsFromMultiLevelElements(parent, child) {
    setTimeout(() => {
      const colWidth = (this.windowWidth / (this.cols.length + 1));
      const childRow = this.elem.nativeElement.querySelectorAll('.' + parent);
      _.each(childRow, (childCell, i) => {
        const tblbodyCell = childCell.querySelectorAll('.' + child);
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


}
