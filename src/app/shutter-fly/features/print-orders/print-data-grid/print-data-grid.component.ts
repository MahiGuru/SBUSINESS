import {
  Component, OnInit, ViewChild, Output, EventEmitter,
  Input, SimpleChanges, OnChanges, HostListener, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';

import {
  faCaretRight, faCaretDown, faWindowClose, faCheckSquare,
  faPencilAlt, faTrashAlt, faShare, faBan, faPrint, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/shutter-fly/shared/components/confirm-dialog/confirm-dialog.component';
import { ORDERS } from 'src/app/shutter-fly/core/models/order-state';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SharedOrdersService } from 'src/app/shutter-fly/shared/services/shared-orders.service';
import { PrintOrderService } from 'src/app/shutter-fly/shared/services/print-order.service';
import { PrintOrder } from 'src/app/shutter-fly/core/models/printOrder';
import { CommonService } from 'src/app/shutter-fly/shared/services/common.service';


@Component({
  selector: 'sb-print-data-grid',
  templateUrl: './print-data-grid.component.html',
  styleUrls: ['./print-data-grid.component.scss']
})
export class PrintDataGridComponent implements OnInit, OnChanges {
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
  faShare = faShare;
  faBan = faBan;
  faPrint = faPrint;
  faCheckCircle = faCheckCircle;
  OrdersState = ORDERS;

  public role: string;


  isNewRowEnabled: boolean;
  public printItems: any;
  public partners: any;
  public defaultItemNo: any = 1;
  public defaultItemDescription: any = 1;
  public defaultItemType: any = 1;
  itemTypeCode: any = 1;
  defaultPartner: any = 1;
  public selectedPartner: any = new BehaviorSubject('');
  public selectedItem: any = new BehaviorSubject('');
  public selectedItemType: string;
  public defaultItemVal = 1;
  myForm: FormGroup;
  addForm: FormGroup;

  @Output() isAddBtnClicked: EventEmitter<any> = new EventEmitter();
  filterVal: any;
  public addedRows = [];
  public newRowHeight: any = 100;
  isEditable = {};
  isChildrenEditable = {};
  editChildRowIndex;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  windowWidth: number;
  windowHeight: number;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  constructor(public sharedOrderService: SharedOrdersService,
              public fb: FormBuilder,
              public printerService: PrintOrderService,
              public cdr: ChangeDetectorRef,
              public commonService: CommonService,
              public dialog: MatDialog,
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


  toggleExpandRow(row) {
    row.childrenHeight = 0;
    const childRows = [];
    _.each(row.children, (chrow) => {
      childRows.push(new PrintOrder(chrow));
    });
    row.children = childRows;
    row.childrenHeight = (row.children && row.children.length > 0) ? row.children.length * 50 : 100;
    this.table.rowDetail.toggleExpandRow(row);
    this.setColsFromMultiLevelElements('newRow', 'child-item');
    this.setRowDetailHeight(row);
  }

  /*** PRINTORDERS GET */
  getPrintOrders() {
    this.printerService.getAllPrintRecords().subscribe((rows: any) => {
      const tempRows = [];
      _.each(rows, (row) => {
        const inventory = new PrintOrder(row);
        tempRows.push(inventory);
      });
      this.rows = [...tempRows];
    });
  }
  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.originalRows = this.rows;
    this.printerService.getPrintItems().subscribe(res => {
      this.printItems = res;
      this.selectedItemType = res[0].itemType;
      this.selectedItem = res[0];
    });
  }

  addNewBtnClicked() {
    this.rows.unshift(new PrintOrder());
    this.rows = [...this.rows];
    this.isNewRowEnabled = true;
    this.newRowHeight = 100;
    setTimeout(() => {
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
      this.setColsFromMultiLevelElements('add-row-section', 'new-item');
      this.rows[0].childrenHeight = 100;
      this.setRowDetailHeight(this.rows[0]);
    }, 100);
  }
  /**
   * Cancel order service call here
   * it display the window in callback using updateorderstatus method...
   */
  updateOrderToCancelStatus(row) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        row,
        title: 'Cancel Print Order',
        description: 'Are you sure you want to cancel this print order?',
        noLabel: 'Keep Order',
        yesLabel: 'Cancel Order'
      },
      panelClass: 'confirm-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateOrderStatus(result, 'Cancel');
    });
  }
  updateOrderStatus(row, status) {
    const orderRecord = [{
      PrintOrderId: row.printOrderId,
      Quantity: row.quantity,
      ItemPartnerId: row.itemPartner.item.itemId,
      Status: status
    }];
    this.printerService.updatePrintOrderStatus(orderRecord).subscribe(newRecords => {
      this.commonService.openSnackBar('Successfully Updated Status', 'Status Update');
      this.getPrintOrders();
    }, err => {
      const error: any = this.commonService.strToObj(err.error);
      this.commonService.openSnackBar(error.Error, 'Update Failed', 'error-snack');
    });
  }
  /***** OUTPUT CALLBACKS  - NEW ROWS */
  rowsUpdate(rows) {
    this.adjustCols('cancel');
    this.getPrintOrders();
  }
  adjustCols(type) {
    if (type === 'new') {
      this.rows[0].childrenHeight += 60;
      this.setColsFromMultiLevelElements('add-row-section', 'new-item');
    } else if (type === 'remove') {
      this.rows[0].childrenHeight -= 60;
    } else if (type === 'cancel') {
      if (this.rows && this.rows.length >= 2) {
        this.rows.splice(0, 1);
        this.rows = [...this.rows];
        this.table.rowDetail.toggleExpandRow(this.rows[0]);
        this.isAddBtnClicked.emit(false);
        this.isNewRowEnabled = false;
        this.newRowHeight = 100;
        this.rows[0].childrenHeight = 100;
        this.dataTableBodyCellWidth();
      }
    }
    this.setRowDetailHeight(this.rows[0]);
  }
  /** Pagination Callback */
  paginationCallback(event) {
    if (this.isNewRowEnabled) {
      this.rows[0].childrenHeight = 50;
      this.adjustCols('new');
    }
    this.dataTableBodyCellWidth();
  }
  /*** filter input change output callback */
  filterCallback(rows) {
    this.rows = [...rows];
    this.adjustCols('cancel');
  }
  /** Datatable body column width */
  dataTableBodyCellWidth() {
    setTimeout(() => {
      const colWidth = (this.windowWidth / (this.cols.length));
      const wActiveClass = this.elem.nativeElement.querySelectorAll('.w-active');
      const bodyCellRow = this.elem.nativeElement.querySelectorAll('.datatable-body-row');
      if (bodyCellRow.length > wActiveClass.length) {
        this.setBodyCellWidth(bodyCellRow);
      }
    }, 500);
  }

  /** Data table header column width set */
  setColHeaderWidth() {
    const colWidth = (this.windowWidth / (this.cols.length));
    setTimeout(() => {
      const twoElem = this.elem.nativeElement.querySelectorAll('.datatable-header-cell');
      this.setColWidth(twoElem, colWidth);
    }, 500);
  }

  /** Datatable Body column width */
  setBodyCellWidth(bodyCellRow) {
    const colWidth = (this.windowWidth / (this.cols.length));
    _.each(bodyCellRow, (bodyCell, i) => {
      bodyCell.classList.add('w-active');
      const tblbodyCell = bodyCell.querySelectorAll('.datatable-body-cell');
      this.setColWidth(tblbodyCell, colWidth);
    });
  }

  /*** SET Column width */
  setColWidth(tblbodyCell, colWidth) {
    _.each(tblbodyCell, (tblCell, j) => {
      if (j === 0) {
        tblCell.style.width = (colWidth) + 'px';
      } else if (j === 1) {
        tblCell.style.width = (colWidth) + 'px';
      } else {
        tblCell.style.width = colWidth + 'px';
      }
    });
  }
  /***ROW DETAIL HEIGHT ADJUST HERE  */
  setRowDetailHeight(row) {
    setTimeout(() => {
      const rowDetailDivs = this.elem.nativeElement.querySelectorAll('.datatable-row-detail');
      _.each(rowDetailDivs, (elem) => {
        elem.style.height = 'auto';
      });
    }, 100);
  }
  /** Loop Parent elements and inside children element loop and apply the width */
  setColsFromMultiLevelElements(parent, child) {
    setTimeout(() => {
      const colWidth = (this.windowWidth / (this.cols.length));
      const childRow = this.elem.nativeElement.querySelectorAll('.' + parent);
      _.each(childRow, (childCell, i) => {
        const tblbodyCell = childCell.querySelectorAll('.' + child);
        this.setColWidth(tblbodyCell, colWidth);
      });
    }, 500);
  }

}
