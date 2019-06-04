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
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  role: string;

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
  public releaseItems: any;

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
    if (changes.rows && changes.rows.currentValue && changes.rows.currentValue.length > 0) {
      this.originalRows = this.rows;
      this.setColHeaderWidth();
      this.dataTableBodyCellWidth();
    }
    // console.log('ORIGINAL ROWS ', this.originalRows, this.rows);
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
      partner: ['']
    });
    // this.inventoryService.getAddItems().subscribe(res => {
    //   this.inventoryItems = res;
    //   // console.log('INV ITEMS >>>> ', res, this.inventoryItems);
    //   this.selectedItemType = res[0].itemType;
    //   this.selectedItem = res[0];
    // });
    // this.inventoryService.getPartners().subscribe(partners => {
    //   this.partners = partners;
    //   // console.log('partners >>>> ', partners, this.partners);
    // });
    this.getReleaseOrders();

  }
  onItemChange(event) {
    console.log(event);
  }
  getReleaseOrders() {
    this.releaseService.getAllReleaseRecords().subscribe((rows: any) => {
      console.log('ROWS, ', rows);
      const tempRows = [];
      this.releaseService.getReleaseItems().subscribe(res => {
        this.releaseItems = res;
        _.each(rows, (row) => {
          const releaseItem = _.filter(this.releaseItems, (val) => {
            return val.item.itemId === row.itemPartner.item.itemId;
            // console.log(val, row);
          });
          const releaseOrders = new ReleaseOrder(row);
          console.log('BEFORE >> ', releaseOrders, releaseItem[0]);

          releaseOrders.assemblers = (releaseItem[0]) ? releaseItem[0].itemPartner : [];
          console.log(releaseOrders);
          tempRows.push(releaseOrders);
        });
        this.rows = [...tempRows];

        console.log(res);
      });
    });
  }

  addNewBtnClicked(row) {

    this.isNewRowEnabled = true;
    if (!(row.childrenHeight && row.childrenHeight.length === 0)) { row.childrenHeight = 60; }
    console.log('ADJUST COLSSS', row.childrenHeight);
    row.childrenHeight = row.childrenHeight + 30;
    console.log(row);
    setTimeout(() => {
      this.table.rowDetail.toggleExpandRow(row);
      row.childrenHeight = 100;
      this.setRowDetailHeight(row);
      this.setColsFromMultiLevelElements('add-row-section', 'new-item');
    }, 100);
  }

  /*** UPDATE ORDER STATUS FROM PRINTED TO PRERELEASE(ADMIN) OR RELEASED */
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
  /**
   * TOGGLE EXPAND ROW DETAIL SECTION >>>>>
   */
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
        childCell.style.width = this.windowWidth - 20 + 'px';
        const tblbodyCell = childCell.querySelectorAll('.child-item');
        this.setColWidth(tblbodyCell, colWidth);
        this.setRowDetailHeight(row);
      });
    }, 500);
  }

  /*** filter input change output callback */
  filterCallback(rows) {
    this.rows = [...rows];
    console.log(rows, this.rows);
    this.dataTableBodyCellWidth();
  }


  /***** OUTPUT CALLBACKS  - NEW ROWS */
  rowsUpdate(rows) {
    this.getReleaseOrders();
  }
  adjustCols(type, row = null) {
    if (type === 'new') {
      row.childrenHeight += 60;
      this.setColsFromMultiLevelElements('add-row-section', 'new-item');
    } else if (type === 'remove') {
      row.childrenHeight -= 60;
    } else if (type === 'cancel') {
      this.table.rowDetail.toggleExpandRow(row);
      this.isAddBtnClicked.emit(false);
      this.isNewRowEnabled = false;
      this.newRowHeight = 100;
      row.childrenHeight = 100;
      this.dataTableBodyCellWidth();
    }
    this.setRowDetailHeight(row);
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
  setBodyColWidth(bodyCellRow) {
    const colWidth = (this.windowWidth / (this.cols.length + 1));
    _.each(bodyCellRow, (bodyCell, i) => {
      const tblbodyCell = bodyCell.querySelectorAll('.datatable-body-cell');
      this.setColWidth(tblbodyCell, colWidth);
    });
  }

}
