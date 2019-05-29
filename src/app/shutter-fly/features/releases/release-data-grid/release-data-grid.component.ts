import {
  Component, OnInit, ViewChild, Output, EventEmitter,
  Input, SimpleChanges, OnChanges, HostListener, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';

import {
  faCaretRight, faCaretDown, faWindowClose, faCheckSquare,
  faPencilAlt, faTrashAlt, faShare, faCheckCircle, faPrint
} from '@fortawesome/free-solid-svg-icons';
import { Inventory } from '../../../core/models/newInventory';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/shutter-fly/shared/components/confirm-dialog/confirm-dialog.component';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { ORDERS } from 'src/app/shutter-fly/core/models/order-state';
import { BehaviorSubject } from 'rxjs';
import { SharedOrdersService } from 'src/app/shutter-fly/shared/services/shared-orders.service';
import { ReleasesService } from 'src/app/shutter-fly/shared/services/releases.service';
import { ReleaseOrder } from 'src/app/shutter-fly/core/models/releaseOrder';


@Component({
  selector: 'sb-release-data-grid',
  templateUrl: './release-data-grid.component.html',
  styleUrls: ['./release-data-grid.component.scss']
})
export class ReleaseDataGridComponent implements OnInit, OnChanges {
  @Input() cols: any;
  @Input() rows: any;
  @Input() newBtnClicked: boolean;
  public originalRows: any;
  public newAddedRow: any = [];
  public OrdersState = ORDERS;

  faCaretRight = faCaretRight;
  faCaretDown = faCaretDown;
  faWindowClose = faWindowClose;
  faCheckSquare = faCheckSquare;
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faShare = faShare;
  faCheckCircle = faCheckCircle;
  faPrint = faPrint;

  isNewRowEnabled: boolean;
  public inventoryItems: any;
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
              public cdr: ChangeDetectorRef,
              public dialog: MatDialog,
              public releaseService: ReleasesService,
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
    // console.log('ORIGINAL ROWS ', this.originalRows, this.rows);
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
  setBodyColWidth(bodyCellRow) {
    const colWidth = (this.windowWidth / (this.cols.length + 1));
    _.each(bodyCellRow, (bodyCell, i) => {
      bodyCell.classList.add('w-active');
      const tblbodyCell = bodyCell.querySelectorAll('.datatable-body-cell');
      this.setColWidth(tblbodyCell, colWidth);
    });
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      addRows: this.fb.array([])
    });
    this.addForm = this.fb.group({
      itemNo: [''],
      itemDesc: [''],
      itemType: [''],
      partner: ['']
    });
    this.inventoryService.getAddItems().subscribe(res => {
      this.inventoryItems = res;
      // console.log('INV ITEMS >>>> ', res, this.inventoryItems);
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
    this.rows.unshift(new Inventory());
    this.rows = [...this.rows];
    control.push(this.fb.group({
      itemNo: [1],
      itemDesc: [1],
      itemType: [''],
      partner: [1]
    }));

    control.controls[0].get('itemNo').setValue(this.selectedItem.itemId);
    control.controls[0].get('itemDesc').setValue(this.selectedItem.itemId);
    control.controls[0].get('itemType').setValue(this.selectedItem.itemType);
    this.isNewRowEnabled = true;
    this.newRowHeight = 100;
    // console.log('addedRows >>> ', this.addedRows);
    setTimeout(() => {
      this.table.rowDetail.toggleExpandRow(this.rows[0]);

      this.rows[0].childrenHeight = 100;
      this.setRowDetailHeight(this.rows[0]);
    }, 100);
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

  addAnotherRow() {
    const control = this.myForm.controls.addRows as FormArray;
    const addRow = new Inventory();
    control.push(this.fb.group({
      itemNo: [1],
      itemDesc: [1],
      itemType: [''],
      partner: [1]
    }));
    // this.addedRows.push(addRow);
    this.newRowHeight += 30;
    this.rows[0].childrenHeight += 80;
  }
  removeCurrentRow(i) {
    const control = this.myForm.controls.addRows as FormArray;
    control.removeAt(i);
    this.newRowHeight -= 30;
    this.rows[0].childrenHeight -= 80;
  }
  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }
  addRowsToInventory() {
    const control = this.myForm.controls.addRows as FormArray;
    // console.log(control.value);
    const newRecord = [];
    _.each(control.value, (val) => {
      newRecord.push({
        Item: {
          ItemId: val.itemNo
        },
        Partner: {
          PartnerId: val.partner
        }
      });
    });

    this.inventoryService.saveNewInventory(newRecord).subscribe(newRecords => {
      // console.log('SAVEDDDDD >>>> ', newRecords);
      const tempArr = [];
      _.each(newRecords, (record, index) => {
        const tempChildArr = [];
        _.each(record.children, (child) => {
          tempChildArr.push(new Inventory(child));
        });
        record.children = tempChildArr;
        tempArr.push(new Inventory(record));
      });
      // console.log('TEMP ARRRRRRRR', tempArr);
      const merged = _.merge(_.keyBy(this.rows, 'itemPartner.item.itemNo'), _.keyBy(newRecords, 'itemPartner.item.itemNo'));
      this.rows = _.values(merged);
      // // console.log(values);
    });

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
      console.log('The dialog was closed', result);
      if (result) {
        const record = {
          ItemPartner: {
            ItemPartnerId: result.row.itemPartner.item.itemId
          }
        };
        this.inventoryService.deleteInventory(record).subscribe(newRecords => {
          console.log('DELETED >>>> ', newRecords);

          this.rows = _.filter(this.rows, (n) => {
            return n.itemPartner.item.itemNo !== row.itemPartner.item.itemNo;
          });
          console.log('arrr', this.rows);

        });
      }
      // this.animal = result;
    });
  }

  updateOrderStatus(row, status) {
    console.log(row);
    const orderRecord = [{
      ReleaseOrderId: row.releaseOrderId,
      Quantity: row.quantity,
      ItemPartnerId: row.itemPartner.item.itemId,
      Status: status
    }];
    this.releaseService.updateReleaseOrderStatus(orderRecord).subscribe(newRecords => {
      console.log(newRecords);
      this.getReleaseOrders();
    });
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

  addAnotherItemInRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
    row.childrenHeight = (row.children && row.children.length > 0) ? row.children.length * 60 : 100;
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

  toggleExpandRow(row) {
    this.newRowHeight = 0;
    // console.log('Toggled Expand Row!', row);
    const childRows = [];
    _.each(row.children, (chrow) => {
      childRows.push(new ReleaseOrder(chrow));
    });
    row.children = childRows;
    // console.log(row);
    this.table.rowDetail.toggleExpandRow(row);
    row.childrenHeight = (row.children && row.children.length > 0) ? row.children.length * 60 : 100;
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

  updateRowValue(event, rowIndex) {
    // console.log('inline editing rowIndex', rowIndex, event);
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
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
    const selectedItem = _.filter(this.inventoryItems, (iitem) => {
      return iitem.itemId === item.value;
    });
    control.controls[index].get('itemNo').setValue(selectedItem[0].itemId);
    control.controls[index].get('itemDesc').setValue(selectedItem[0].itemId);
    control.controls[index].get('itemType').setValue(selectedItem[0].itemType);
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
  cleaFilterInput() {
    console.log('clearInput');
    this.filterVal = '';
    this.rows = [...this.originalRows];
    this.cdr.detectChanges();
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
  getReleaseOrders() {
    this.releaseService.getAllReleaseRecords().subscribe((rows: any) => {
      console.log('ROWS, ', rows);
      const tempRows = [];
      _.each(rows, (row) => {
        const inventory = new ReleaseOrder(row);
        tempRows.push(inventory);
      });
      this.rows = [...tempRows];
    });
  }
  /***** OUTPUT CALLBACKS  - NEW ROWS */
  rowsUpdate(rows) {
    this.getReleaseOrders();
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
