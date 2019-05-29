import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import { Inventory } from 'src/app/shutter-fly/core/models/newInventory';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'sb-release-new-order',
  templateUrl: './release-new-order.component.html',
  styleUrls: ['./release-new-order.component.scss']
})
export class ReleaseNewOrderComponent implements OnInit, OnChanges {
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
  printItems: any;
  selectedItemType: any;
  partners: any;
  constructor(public inventoryService: InventoryService,
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
      itemNo: [''],
      itemDesc: [''],
      itemType: [''],
      partner: [''],
      quantity: [''],
      poNum: ['']
    });
    this.inventoryService.getAddItems().subscribe(res => {
      this.printItems = res;
      // console.log('INV ITEMS >>>> ', res, this.printItems);
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
      itemNo: [1],
      itemDesc: [1],
      partners: [[]],
      itemType: [''],
      partner: [1],
      quantity: [1],
      poNum: [1]
    }));
    control.controls[0].get('itemNo').setValue(this.selectedItem.itemId);
    control.controls[0].get('itemDesc').setValue(this.selectedItem.itemId);
    control.controls[0].get('itemType').setValue(this.selectedItem.itemType);
  }
  addAnotherRow() {
    const control = this.myForm.controls.addRows as FormArray;
    control.push(this.fb.group({
      itemNo: [1],
      itemDesc: [1],
      partners: [[]],
      itemType: [''],
      partner: [1],
      quantity: [1],
      poNum: [1]
    }));
    this.adjustCols.emit('new');
  }
  cancelNewInventory() {

    const control = this.myForm.controls.addRows as FormArray;
    control.controls = [];

    this.adjustCols.emit('cancel');
    // this.newRowHeight = 100;
    // this.table.rowDetail.toggleExpandRow(this.rows[0]);
    // this.isAddBtnClicked.emit(false);
    // this.isNewRowEnabled = false;
    // this.dataTableBodyCellWidth();
  }
  removeCurrentRow(i) {
    const control = this.myForm.controls.addRows as FormArray;
    control.removeAt(i);
    this.adjustCols.emit('remove');
  }
  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
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
    });

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

  onPartnerChange(item) {
    const filteredPartner = (_.filter(this.partners, (partner) => {
      return partner.partnerId === item.value;
    }));
    this.selectedPartner.next(filteredPartner);
    // console.log('Patner selected', this.selectedPartner);
  }


}
