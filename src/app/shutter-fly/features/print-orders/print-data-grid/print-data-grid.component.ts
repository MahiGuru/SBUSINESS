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
    this.windowWidth = window.innerWidth - 200;
    console.log(this.windowHeight, this.windowWidth);
  }

  constructor(public sharedOrderService: SharedOrdersService,
              public inventoryService: InventoryService,
              public fb: FormBuilder,
              public printerService: PrintOrderService,
              public cdr: ChangeDetectorRef,
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
  /** Datatable body column width */
  dataTableBodyCellWidth() {
    setTimeout(() => {
      const colWidth = (this.windowWidth / (this.cols.length + 1));
      const wActiveClass = this.elem.nativeElement.querySelectorAll('.w-active');
      const bodyCellRow = this.elem.nativeElement.querySelectorAll('.datatable-body-row');
      if (bodyCellRow.length > wActiveClass.length) {
        this.setBodyCellWidth(bodyCellRow);
      }
    }, 500);
  }

  /** Data table header column width set */
  setColHeaderWidth() {
    const colWidth = (this.windowWidth / (this.cols.length + 1));
    setTimeout(() => {
      const twoElem = this.elem.nativeElement.querySelectorAll('.datatable-header-cell');
      this.setColWidth(twoElem, colWidth);
    }, 500);
  }

  /** Datatable Body column width */
  setBodyCellWidth(bodyCellRow) {
    const colWidth = (this.windowWidth / (this.cols.length + 1));
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
        tblCell.style.width = (colWidth + 100) + 'px';
      } else if (j === 1) {
        tblCell.style.width = (colWidth + 200) + 'px';
      } else {
        tblCell.style.width = colWidth - (370 / (this.cols.length + 1)) + 'px';
      }
    });
  }

  toggleExpandRow(row) {
    this.newRowHeight = 0;
    row.childrenHeight = 0;
    // console.log('Toggled Expand Row!', row);
    const childRows = [];
    _.each(row.children, (chrow) => {
      childRows.push(new PrintOrder(chrow));
    });
    row.children = childRows;
    // console.log(row);
    this.table.rowDetail.toggleExpandRow(row);
    row.childrenHeight = (row.children && row.children.length > 0) ? row.children.length * 65 : 100;
    setTimeout(() => {
      const colWidth = (this.windowWidth / (this.cols.length + 1));
      const childRow = this.elem.nativeElement.querySelectorAll('.newRow');
      _.each(childRow, (childCell, i) => {
        childCell.classList.add('w-row-active');
        const tblbodyCell = childCell.querySelectorAll('.child-item');
        this.setColWidth(tblbodyCell, colWidth);
        this.setRowDetailHeight(row);

      });
    }, 500);
  }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.myForm = this.fb.group({
      addRows: this.fb.array([])
    });
    this.addForm = this.fb.group({
      itemNo: [''],
      itemDesc: [''],
      itemType: [''],
      partner: [null],
      quantity: [''],
      poNum: ['']
    });
    this.originalRows = this.rows;
    this.printerService.getPrintItems().subscribe(res => {
      this.printItems = res;
      // console.log('printItems ITEMS >>>> ', res, this.printItems);
      this.selectedItemType = res[0].itemType;
      this.selectedItem = res[0];
    });
    this.inventoryService.getPartners().subscribe(partners => {
      this.partners = partners;
      // console.log('partners >>>> ', partners, this.partners);
    });


  }

  addNewBtnClicked() {
    const control = this.myForm.controls.addRows as FormArray;
    this.rows.unshift(new PrintOrder());
    this.rows = [...this.rows];
    control.push(this.fb.group({
      itemNo: [null],
      itemDesc: [null],
      partners: [[]],
      itemType: [''],
      partner: [null],
      quantity: [null],
      poNum: [null]
    }));

    control.controls[0].get('itemNo').setValue(this.selectedItem.itemId);
    control.controls[0].get('itemDesc').setValue(this.selectedItem.itemId);
    control.controls[0].get('itemType').setValue(this.selectedItem.itemType);
    this.isNewRowEnabled = true;
    this.newRowHeight = 100;
    // console.log('addedRows >>> ', this.addedRows);
    setTimeout(() => {
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
      setTimeout(() => {
        const colWidth = (this.windowWidth / (this.cols.length + 1));
        const childRow = this.elem.nativeElement.querySelectorAll('.add-row-section');
        console.log('ADD ANOTHER CHILDDDD >>> ', childRow);
        _.each(childRow, (childCell, i) => {
          const tblbodyCell = childCell.querySelectorAll('.new-item');
          console.log(tblbodyCell);
          this.setColWidth(tblbodyCell, colWidth);
        });
      }, 500);

      this.rows[0].childrenHeight = 100;
      this.setRowDetailHeight(this.rows[0]);
    }, 100);
  }

  updateFilter(filterVal) {
    if (filterVal === '') { this.rows = this.originalRows; }
    const val = filterVal.toLowerCase();
    // filter our data
    const temp = this.rows.filter((d) => {
      return d.itemPartner.item.itemNo.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  addAnotherRow() {
    const control = this.myForm.controls.addRows as FormArray;
    control.push(this.fb.group({
      itemNo: [null],
      itemDesc: [null],
      itemType: [''],
      partners: [[]],
      partner: [null],
      quantity: [null],
      poNum: [null]
    }));
    // this.addedRows.push(addRow);
    this.newRowHeight += 80;
    this.rows[0].childrenHeight += 80;
    setTimeout(() => {
      const colWidth = (this.windowWidth / (this.cols.length + 1));
      const childRow = this.elem.nativeElement.querySelectorAll('.add-row-section');
      console.log('ADD ANOTHER CHILDDDD >>> ', childRow);
      _.each(childRow, (childCell, i) => {
        const tblbodyCell = childCell.querySelectorAll('.new-item');
        console.log(tblbodyCell);

        this.setColWidth(tblbodyCell, colWidth);
      });
    }, 500);
  }
  removeCurrentRow(i) {
    const control = this.myForm.controls.addRows as FormArray;
    control.removeAt(i);
    this.newRowHeight -= 80;
    this.rows[0].childrenHeight -= 80;
  }
  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }
  addRowsToInventory() {
    const control = this.myForm.controls.addRows as FormArray;
    const newRecord = [];
    _.each(control.value, (val) => {
      newRecord.push({
        ItemPartner: {
          ItemPartnerId: val.partner
        },
        Quantity: val.quantity,
        PoNum: val.poNum,
        Status: 'New'
      });
    });

    this.printerService.saveNewPrintItem(newRecord).subscribe(newRecords => {
      this.isNewRowEnabled = false;
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
      this.isAddBtnClicked.emit(false);
      this.getPrintOrders();
    });
    // console.log(newRecord);

  }
  cancelNewInventory() {

    const control = this.myForm.controls.addRows as FormArray;
    control.controls = [];
    this.newRowHeight = 100;
    this.rows.splice(0, 1);
    this.rows = [...this.rows];
    this.table.rowDetail.toggleExpandRow(this.rows[0]);
    this.isAddBtnClicked.emit(false);
    this.isNewRowEnabled = false;
  }
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
      console.log('CANCEL DIALOG BOX CCALLED', result);
      this.updateOrderStatus(result, 'Cancel');
    });
  }
  updateOrderStatus(row, status) {
    console.log(row);
    const orderRecord = [{
      PrintOrderId: row.printOrderId,
      Quantity: row.quantity,
      ItemPartnerId: row.itemPartner.item.itemId,
      Status: status
    }];
    this.printerService.updatePrintOrderStatus(orderRecord).subscribe(newRecords => {
      console.log('SAVEDDDD', newRecords);
      this.getPrintOrders();
    });
  }
  updateOrderToPrintStatus(id) {
    const orderRecord = [{
      PrintOrderId: id,
      Status: 'Push2Print'
    }];
    this.printerService.updatePrintOrderStatus(orderRecord).subscribe(newRecords => {
      console.log(newRecords);
      _.each(this.rows, (row, i) => {
        _.each(row.children, (child, j) => {
          if (child.printOrderId === newRecords[0].children[0].printOrderId) {
            child.status = newRecords[0].children[0].status;
          }
        });
      });
      this.rows = [...this.rows];
      console.log(this.rows);
      this.cdr.detectChanges();

    });
  }

  updateRowValue(event, rowIndex) {
    // console.log('inline editing rowIndex', rowIndex, event);
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
  }

  cleaFilterInput() {
    console.log('clearInput');
    this.filterVal = '';
    this.rows = [...this.originalRows];
    this.cdr.detectChanges();
  }
  onPartnerChange(item) {
    const filteredPartner = (_.filter(this.partners, (partner) => {
      return partner.partnerId === item.value;
    }));
    this.selectedPartner.next(filteredPartner);
    // console.log('Patner selected', this.selectedPartner);
  }
  onItemChange(item, index) {
    const control = this.myForm.controls.addRows as FormArray;
    const selectedItem = _.filter(this.printItems, (iitem) => {
      return iitem.item.itemNo === item.value;
    });
    this.selectedItem = selectedItem[0];

    control.controls[index].get('partners').setValue(selectedItem[0].itemPartner);
    console.log('on item change', selectedItem);
    control.controls[index].get('itemNo').setValue(selectedItem[0].item.itemNo);
    control.controls[index].get('itemDesc').setValue(selectedItem[0].item.itemNo);
    control.controls[index].get('itemType').setValue(selectedItem[0].item.itemTypeCode);
    // console.log('INDEX', index, item);

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
  /** Pagination Callback */
  paginationCallback(event) {
    this.dataTableBodyCellWidth();
  }
  /*** filter input change output callback */
  filterCallback(rows) {
    this.rows = [...rows];
    console.log(rows, this.rows);
    this.dataTableBodyCellWidth();
  }

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
  /***** OUTPUT CALLBACKS  - NEW ROWS */
  rowsUpdate(rows) {
    console.log('ROWS UPDATE');
    this.getPrintOrders();
  }
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
      this.rows[0].childrenHeight = 100;
      this.dataTableBodyCellWidth();
    }
    this.setRowDetailHeight(this.rows[0]);
  }
}
