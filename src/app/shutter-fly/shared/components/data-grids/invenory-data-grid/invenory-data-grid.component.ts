import {
  Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter,
  Input, SimpleChanges, OnChanges
} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SharedOrdersService } from '../../../services/shared-orders.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

import {
  faCaretRight, faCaretDown, faWindowClose, faCheckSquare,
  faPencilAlt, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { Inventory } from '../../../../core/models/newInventory';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'sb--inventory-data-grid',
  templateUrl: './invenory-data-grid.component.html',
  styleUrls: ['./invenory-data-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvenoryDataGridComponent implements OnInit, OnChanges {
  /** INPUT AND OUTPUTS */
  @Input() cols: any;
  @Input() rows: any;
  @Input() newBtnClicked: boolean;

  // All rows from server
  public originalRows: any;

  /** FONT AWESOME ICONS */
  faCaretRight = faCaretRight;
  faCaretDown = faCaretDown;
  faWindowClose = faWindowClose;
  faCheckSquare = faCheckSquare;
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;

  /** NEW ROW VARIABLES */
  isNewRowEnabled: boolean;
  public inventoryItems: any;
  public partners: any;

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

  constructor(public sharedOrderService: SharedOrdersService,
              public http: HttpClient,
              public inventoryService: InventoryService,
              public fb: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.newBtnClicked && changes.newBtnClicked.currentValue) {
      this.newBtnClicked = changes.newBtnClicked.currentValue;
      this.addNewBtnClicked();
    }
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
    this.originalRows = this.rows;
    this.inventoryService.getAddItems().subscribe(res => {
      this.inventoryItems = res;
      console.log('INV ITEMS >>>> ', res, this.inventoryItems);
      this.selectedItemType = res[0].itemType;
      this.selectedItem = res[0];
    });
    this.inventoryService.getPartners().subscribe(partners => {
      this.partners = partners;
      console.log('partners >>>> ', partners, this.partners);
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
      return d.itemPartner.item.itemNo.toLowerCase().indexOf(val) !== -1 || !val;
    });
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
  }
  removeCurrentRow(i) {
    const control = this.myForm.controls.addRows as FormArray;
    control.removeAt(i);
    this.newRowHeight -= 30;
  }
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  addRowsToInventory() {
    const control = this.myForm.controls.addRows as FormArray;
    console.log(control.value);
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
      console.log('SAVEDDDDD >>>> ', newRecords);
      const tempArr = [];
      _.each(newRecords, (record, index) => {
        const tempChildArr = [];
        _.each(record.children, (child) => {
          tempChildArr.push(new Inventory(child));
        });
        record.children = tempChildArr;
        tempArr.push(new Inventory(record));
      });
      console.log('TEMP ARRRRRRRR', tempArr);
      const merged = _.merge(_.keyBy(this.rows, 'itemPartner.item.itemNo'), _.keyBy(newRecords, 'itemPartner.item.itemNo'));
      this.rows = _.values(merged);
      // console.log(values);

    });
    console.log(newRecord);
    // if (this.addedRows.length > 0) {
    //   this.rows.splice(0, 1);
    //   this.addedRows.forEach(row => {
    //     this.rows.unshift(row);
    //   });
    //   this.rows = [...this.rows];
    //   this.sharedOrderService.updateOrders(this.rows);
    //   this.table.rowDetail.toggleExpandRow(this.rows[0]);
    // }
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

  toggleExpandRow(row) {
    this.newRowHeight = 0;
    console.log('Toggled Expand Row!', row);
    const childRows = [];
    _.each(row.children, (chrow) => {
      childRows.push(new Inventory(chrow));
    });
    row.children = childRows;
    console.log(row);
    this.table.rowDetail.toggleExpandRow(row);
    this.newRowHeight += row.children ? row.children.length * 60 : this.newRowHeight;
  }
  /**
   * Edit Parent Row
   * @param rowIndex - get row index from list of inventory items
   */
  editParentRow(rowIndex) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
  }
  /**
   * Update parent row
   * @param rowIndex - row index from inventory list
   * @param waste - row.waste updated value
   */
  updateParentRow(rowIndex, waste) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
  }

  // editValUpdate(event, row) {
  //   row.waste = event.target.value;
  // }

  /**
   * GET PARENT ROW INDEX
   * @param row - parent row
   */
  public getRowIndex(row: any): number {
    console.log(row);
    return this.table.bodyComponent.getRowIndex(row);   // row being data object passed into the template
  }

  // updateChildRowValue(event, rowIndex, childIndex) {
  //   console.log('inline editing rowIndex', rowIndex, event);
  //   this.isEditable[rowIndex] = !this.isEditable[rowIndex];
  // }

  /**
   * Update edit value
   * @param rowIndex - row index
   * @param childIndex - children row index
   * @param key - row key
   * @param value - row value
   */
  updateEditedChildRowValue(rowIndex, childIndex, key, value) {
    this.rows[rowIndex].children[childIndex][key] = value;
    this.editChildRowIndex = null;
  }
  /**
   * edit children row item
   * @param {*} childrenIndex - get children row index
   */
  editChildrenRow(childrenIndex) {
    this.editChildRowIndex = childrenIndex;
    console.log(this.editChildRowIndex);
  }
  /**
   * cancel edit mode of children row
   */
  cancelChildRow() {
    this.editChildRowIndex = null;
  }
}
