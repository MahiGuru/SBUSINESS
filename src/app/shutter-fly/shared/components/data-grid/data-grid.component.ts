import {
  Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter,
  Input, SimpleChanges, OnChanges
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
      return d.itemType.toLowerCase().indexOf(val) !== -1 || !val;
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

  updateRowValue(event, rowIndex) {
    console.log('inline editing rowIndex', rowIndex, event);
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
  }
  onPartnerChange(item) {
    const filteredPartner = (_.filter(this.partners, (partner) => {
      return partner.partnerId === item.value;
    }));
    this.selectedPartner.next(filteredPartner);
    console.log('Patner selected', this.selectedPartner);
  }
  onItemChange(item, index) {
    const control = this.myForm.controls.addRows as FormArray;
    const selectedItem = _.filter(this.inventoryItems, (iitem) => {
      return iitem.itemId === item.value;
    });
    control.controls[index].get('itemNo').setValue(selectedItem[0].itemId);
    control.controls[index].get('itemDesc').setValue(selectedItem[0].itemId);
    control.controls[index].get('itemType').setValue(selectedItem[0].itemType);
    console.log('INDEX', index, item);

  }
  updateEditedValue(rowIndex, waste) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
  }
  editValUpdate(event, row) {
    row.waste = event.target.value;
  }
}
