import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import { Inventory } from 'src/app/shutter-fly/core/models/newInventory';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { ReleasesService } from 'src/app/shutter-fly/shared/services/releases.service';
import { CommonService } from 'src/app/shutter-fly/shared/services/common.service';


@Component({
  selector: 'sb-release-new-order',
  templateUrl: './release-new-order.component.html',
  styleUrls: ['./release-new-order.component.scss']
})
export class ReleaseNewOrderComponent implements OnInit, OnChanges {
  @Input() row: any;
  @Input() childRow: any;
  @Input() rows: any;
  @Input() orderReleaseItems: any;
  @Input() isAddBtnClicked: boolean;

  @Output() adjustCols: EventEmitter<any> = new EventEmitter();
  @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();
  @Output() quantityEmit: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  public selectedPartner: any = new BehaviorSubject('');
  public selectedItem: any = new BehaviorSubject('');
  myForm: FormGroup;
  addForm: FormGroup;
  releaseItems: any;
  selectedItemType: any;
  partners: any;
  totalQuantity = 0;
  constructor(public inventoryService: InventoryService,
              public releaseService: ReleasesService,
              public commonService: CommonService,
              public fb: FormBuilder) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.childRow && changes.childRow.currentValue) {
      console.log('ON CHANGES ', changes.childRow);
    }
    if (changes.orderReleaseItems && changes.orderReleaseItems.currentValue) {
      console.log(this.orderReleaseItems);
      this.getOrderItems(this.orderReleaseItems);
    }

    // console.log('ORIGINAL ROWS ', this.originalRows, this.rows);
  }

  ngOnInit() {
    _.each(this.rows, (row) => {
      row.originalQuantity = row.quantity;
      _.each(row.children, (child) => {
        child.originalQuantity = child.quantity;
      });
      console.log('CHILD INSIDE NEW ', row);
    });
    console.log('ngONINIT', this.row, this.childRow);
    this.myForm = this.fb.group({
      addRows: this.fb.array([])
    });
    this.addForm = this.fb.group({
      itemNo: [''],
      itemDesc: [''],
      itemType: [''],
      partner: ['', Validators.required],
      quantity: [null, Validators.required]
    });
    this.addInitialRows();
    this.setOrderFormControls();
    console.log('NEW ORDER ', this.row, this.childRow);
  }
  public getOrderItems(res) {
    this.releaseItems = res;
    // console.log('INV ITEMS >>>> ', res, this.printItems);
    this.selectedItemType = res[0].itemType;
    this.selectedItem = res[0];

    console.log(this.selectedItem);
  }
  public setOrderFormControls() {
    const control = this.myForm.controls.addRows as FormArray;
    const selectedItem = _.filter(this.releaseItems, (iitem) => {
      return iitem.item.itemNo === this.row.itemPartner.item.itemNo;
    });
    console.log('SELECTED ITEM :', selectedItem);
    if (selectedItem.length > 0) {
      control.controls[0].get('partners').setValue(selectedItem[0].itemPartner);
      console.log('on item change', selectedItem);
      control.controls[0].get('itemNo').setValue(selectedItem[0].item.itemNo);
      control.controls[0].get('itemDesc').setValue(selectedItem[0].item.itemNo);
      control.controls[0].get('itemType').setValue(selectedItem[0].item.itemTypeCode);
    }
  }
  addInitialRows() {
    const control = this.myForm.controls.addRows as FormArray;
    control.push(this.fb.group({
      itemNo: [null],
      itemDesc: [null],
      partners: [[]],
      itemType: [''],
      partner: [null, Validators.required],
      quantity: [null, Validators.required]
    }));
    control.controls[0].get('itemNo').setValue(this.selectedItem.itemId);
    control.controls[0].get('itemDesc').setValue(this.selectedItem.itemId);
    control.controls[0].get('itemType').setValue(this.selectedItem.itemType);
  }
  addAnotherRow() {
    const control = this.myForm.controls.addRows as FormArray;
    const selectedItem = _.filter(this.releaseItems, (iitem) => {
      return iitem.item.itemNo === this.row.itemPartner.item.itemNo;
    });
    console.log('SELECTED ITEM :', selectedItem, control, control.controls[control.value.length - 1]);

    control.push(this.fb.group({
      itemNo: [selectedItem[0] ? selectedItem[0].item.itemId : 1],
      itemDesc: [selectedItem[0] ? selectedItem[0].item.itemId : 1],
      partners: [[]],
      itemType: [selectedItem[0] ? selectedItem[0].item.itemType : 1],
      partner: [null, Validators.required],
      quantity: [null, Validators.required]
    }));

    setTimeout(() => {
      if (selectedItem[0]) {
        control.controls[control.value.length - 1].get('partners').setValue(selectedItem[0].itemPartner);
        control.controls[control.value.length - 1].get('itemNo').setValue(selectedItem[0].item.itemNo);
        control.controls[control.value.length - 1].get('itemDesc').setValue(selectedItem[0].item.itemNo);
        control.controls[control.value.length - 1].get('itemType').setValue(selectedItem[0].item.itemTypeCode);
      }
    }, 500);

    this.adjustCols.emit('new');
  }
  cancelNewInventory() {

    const control = this.myForm.controls.addRows as FormArray;
    control.controls = [];
    this.adjustCols.emit('cancel');
  }
  removeCurrentRow(i) {
    const control = this.myForm.controls.addRows as FormArray;
    control.removeAt(i);
    this.totalQuantity = 0;
    _.each(control.value, (addedRow) => {
      this.totalQuantity += +addedRow.quantity;
    });
    console.log('removed this.total ', this.totalQuantity);
    if (control.value.length === 0) {
      this.cancelNewInventory();
    } else {
      this.adjustCols.emit('remove');
    }
  }
  onQuantityChange(value, index) {
    const control = this.myForm.controls.addRows as FormArray;
    console.log(this.myForm.get('addRows'), this.childRow);
    this.totalQuantity = 0;
    _.each(this.myForm.get('addRows').value, (addedRow: any) => {
      this.totalQuantity += +addedRow.quantity;
    });
    console.log('TOTAL QUANTITYT ', this.totalQuantity);
    if (this.totalQuantity <= this.childRow.originalQuantity) {
      this.quantityEmit.emit(this.totalQuantity);
    } else {

      console.log('NOW TOTAL ', this.totalQuantity);
      control.controls[index].get('quantity').setValue(null);
      this.commonService.openSnackBar('Quantity should not be greater than the ORDER', 'Quantity Exceeds', 'error-snack');
    }
  }
  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }
  addRowsToRelease(row) {
    const control = this.myForm.controls.addRows as FormArray;
    console.log('SAVEEEEE ', this.childRow);
    const newRecord = [];
    _.each(control.value, (val) => {
      console.log(val);
      newRecord.push(
        {
          ReleaseOrderId: null, // this.childRow.releaseOrderId,
          ItemAssemblerId: val.partner, // this.childRow.ItemAssemblerId,
          PrintOrderId: this.childRow.printOrderId,
          ItemPartner: {
            ItemPartnerId: this.childRow.itemPartner.itemPartnerId
          },
          Quantity: val.quantity
        }
      );
    });
    this.commonService.validateAllFields(this.myForm);
    console.log(this.totalQuantity, this.childRow.originalQuantity, this.childRow);
    if (this.totalQuantity <= this.childRow.originalQuantity) {
      console.log(this.myForm);
      if (this.myForm.valid) { this.onSave.emit(newRecord); }
    } else {
      this.commonService.openSnackBar('Quantity should not be greater than the ORDER', 'Quantity Exceeds', 'error-snack');
    }
  }

  onItemChange(item, index) {
    console.log('ITEM INDEX', item, index);
    const control = this.myForm.controls.addRows as FormArray;
    const selectedItem = _.filter(this.releaseItems, (iitem) => {
      return iitem.item.itemNo === item;
    });
    this.selectedItem = selectedItem[0];

    control.controls[index].get('partners').setValue(selectedItem[0].itemPartner);
    console.log('on item change', selectedItem);
    control.controls[index].get('itemNo').setValue(selectedItem[0].item.itemNo);
    control.controls[index].get('itemDesc').setValue(selectedItem[0].item.itemNo);
    control.controls[index].get('itemType').setValue(selectedItem[0].item.itemTypeCode);
    // console.log('INDEX', index, item);
  }

  onPartnerChange(item, partners) {
    console.log(item, partners);
    const filteredPartner = (_.filter(partners, (partner) => {
      return partner.partnerId === item;
    }));

    this.selectedPartner.next(filteredPartner);
    // console.log('Patner selected', this.selectedPartner);
  }


}
