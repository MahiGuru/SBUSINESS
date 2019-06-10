import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import { Inventory } from 'src/app/shutter-fly/core/models/newInventory';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/shutter-fly/shared/services/common.service';


@Component({
  selector: 'sb-inventory-new-order',
  templateUrl: './inventory-new-order.component.html',
  styleUrls: ['./inventory-new-order.component.scss']
})
export class InventoryNewOrderComponent implements OnInit, OnChanges {

  @Input() row: any;
  @Input() rows: any;
  @Input() isAddBtnClicked: boolean;

  @Output() adjustCols: EventEmitter<any> = new EventEmitter();
  @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  public selectedPartner: any = new BehaviorSubject('');
  public selectedItem: any = new BehaviorSubject('');
  myForm: FormGroup;
  addForm: FormGroup;
  inventoryItems: any;
  selectedItemType: any;
  partners: any;
  constructor(public inventoryService: InventoryService,
              public commonService: CommonService,
              public fb: FormBuilder) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isAddBtnClicked && changes.isAddBtnClicked.currentValue) {
      console.log('ON CHANGES ');
    }

    // console.log('ORIGINAL ROWS ', this.originalRows, this.rows);
  }

  ngOnInit() {
    console.log('ngONINIT');
    this.myForm = this.fb.group({
      addRows: this.fb.array([])
    });
    this.addForm = this.fb.group({
      itemNo: ['', Validators.required],
      itemDesc: ['', Validators.required],
      itemType: [''],
      partner: ['', Validators.required]
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
    this.addInitialRows();
  }

  addInitialRows() {
    const control = this.myForm.controls.addRows as FormArray;
    control.push(this.fb.group({
      itemNo: [null, Validators.required],
      itemDesc: [null, Validators.required],
      itemType: [''],
      partner: [null, Validators.required]
    }));
    control.controls[0].get('itemNo').setValue(this.selectedItem.itemId);
    control.controls[0].get('itemDesc').setValue(this.selectedItem.itemId);
    control.controls[0].get('itemType').setValue(this.selectedItem.itemTypeCode);
  }
  addAnotherRow() {
    const control = this.myForm.controls.addRows as FormArray;
    control.push(this.fb.group({
      itemNo: [null, Validators.required],
      itemDesc: [null, Validators.required],
      itemType: [''],
      partner: [null, Validators.required]
    }));
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
    this.adjustCols.emit('remove');
  }
  onDetailToggle(event) {
  }

  addRowsToInventory() {
    const control = this.myForm.controls.addRows as FormArray;
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
    this.commonService.validateAllFields(this.myForm);
    if (this.myForm.valid) {
      this.inventoryService.saveNewInventory(newRecord).subscribe(newRecords => {
        const tempArr = [];
        _.each(newRecords, (record, index) => {
          const tempChildArr = [];
          _.each(record.children, (child) => {
            tempChildArr.push(new Inventory(child));
          });
          record.children = tempChildArr;
          tempArr.push(new Inventory(record));
        });
        this.onSave.emit(tempArr);
      }, err => {
        console.log(err);
        const error: any = this.commonService.strToObj(err.error);
        console.log(error);
        this.commonService.openSnackBar(error.Error, 'FAILED', 'error-snack');
      });
    } else {

    }

  }

  onItemChange(item, index) {
    const control = this.myForm.controls.addRows as FormArray;
    const selectedItem = _.filter(this.inventoryItems, (iitem) => {
      return iitem.itemId === item;
    });
    if (selectedItem && selectedItem.length > 0) {
      control.controls[index].get('itemNo').setValue(selectedItem[0].itemId);
      control.controls[index].get('itemDesc').setValue(selectedItem[0].itemId);
      control.controls[index].get('itemType').setValue(selectedItem[0].itemTypeCode);
    }
    // console.log('INDEX', index, item);

  }

  onPartnerChange(item) {
    const filteredPartner = (_.filter(this.partners, (partner) => {
      return partner.partnerId === item;
    }));
    console.log(item, filteredPartner);
    this.selectedPartner.next(filteredPartner);
    // console.log('Patner selected', this.selectedPartner);
  }

}
