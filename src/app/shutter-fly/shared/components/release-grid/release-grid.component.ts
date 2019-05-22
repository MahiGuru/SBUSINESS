import {
  Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter,
  Input, SimpleChanges, OnChanges, ChangeDetectorRef
} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SharedOrdersService } from '../../services/shared-orders.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

import {
  faCaretRight, faCaretDown, faWindowClose, faCheckSquare,
  faPencilAlt, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { Inventory } from '../../../core/models/newInventory';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { ReleaseOrder } from 'src/app/shutter-fly/core/models/releaseOrder';

@Component({
  selector: 'sb-release-grid',
  templateUrl: './release-grid.component.html',
  styleUrls: ['./release-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleaseGridComponent implements OnInit, OnChanges {
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

  constructor(public sharedOrderService: SharedOrdersService,
              public http: HttpClient,
              public inventoryService: InventoryService,
              public fb: FormBuilder,
              public cdr: ChangeDetectorRef, public dialog: MatDialog) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.newBtnClicked && changes.newBtnClicked.currentValue) {
      this.newBtnClicked = changes.newBtnClicked.currentValue;
      this.addNewBtnClicked();
    }
    if (changes.rows && changes.rows.currentValue && changes.rows.currentValue.length > 0) {
      this.originalRows = this.rows;
    }
    // console.log('ORIGINAL ROWS ', this.originalRows, this.rows);
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
  }
  removeCurrentRow(i) {
    const control = this.myForm.controls.addRows as FormArray;
    control.removeAt(i);
    this.newRowHeight -= 30;
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
    // console.log('Toggled Expand Row!', row);
    const childRows = [];
    _.each(row.children, (chrow) => {
      childRows.push(new ReleaseOrder(chrow));
    });
    row.children = childRows;
    // console.log(row);
    this.table.rowDetail.toggleExpandRow(row);
    this.newRowHeight += row.children ? row.children.length * 60 : this.newRowHeight;
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
}
