import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import { Inventory } from 'src/app/shutter-fly/core/models/newInventory';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { ReleasesService } from 'src/app/shutter-fly/shared/services/releases.service';


@Component({
  selector: 'sb-release-new-order',
  templateUrl: './release-new-order.component.html',
  styleUrls: ['./release-new-order.component.scss']
})
export class ReleaseNewOrderComponent implements OnInit, OnChanges {
  @Input() row: any;
  @Input() childRow: any;
  @Input() rows: any;
  @Input() isAddBtnClicked: boolean;

  @Output() adjustCols: EventEmitter<any> = new EventEmitter();
  @Output() rowsUpdate: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  public selectedPartner: any = new BehaviorSubject('');
  public selectedItem: any = new BehaviorSubject('');
  myForm: FormGroup;
  addForm: FormGroup;
  releaseItems: any;
  selectedItemType: any;
  partners: any;
  constructor(public inventoryService: InventoryService,
              public releaseService: ReleasesService,
              public fb: FormBuilder) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.childRow && changes.childRow.currentValue) {
      console.log('ON CHANGES ', changes.childRow);
    }

    // console.log('ORIGINAL ROWS ', this.originalRows, this.rows);
  }

  ngOnInit() {
    console.log('ngONINIT', this.childRow);
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
    this.releaseService.getReleaseItems().subscribe(res => {
      this.releaseItems = res;
      // console.log('INV ITEMS >>>> ', res, this.printItems);
      this.selectedItemType = res[0].itemType;
      this.selectedItem = res[0];
      const control = this.myForm.controls.addRows as FormArray;
      console.log('ROW >>>> ', this.row, res);
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
      console.log(this.selectedItem);
    });
    this.inventoryService.getPartners().subscribe(partners => {
      this.partners = partners;
      // console.log('partners >>>> ', partners, this.partners);
    });
    this.addInitialRows();
    console.log(this.row);
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
    const selectedItem = _.filter(this.releaseItems, (iitem) => {
      return iitem.item.itemNo === this.row.itemPartner.item.itemNo;
    });
    console.log('SELECTED ITEM :', selectedItem, control, control.controls[control.value.length - 1]);

    control.push(this.fb.group({
      itemNo: [selectedItem[0] ? selectedItem[0].item.itemId : 1],
      itemDesc: [selectedItem[0] ? selectedItem[0].item.itemId : 1],
      partners: [[]],
      itemType: [selectedItem[0] ? selectedItem[0].item.itemType : 1],
      partner: [1],
      quantity: [0],
      poNum: [0]
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
    if (control.value.length === 0) {
      this.cancelNewInventory();
    } else {
      this.adjustCols.emit('remove');
    }
  }
  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }
  addRowsToRelease(row) {
    const control = this.myForm.controls.addRows as FormArray;
    console.log('SAVEEEEE ', row, this.childRow);
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
    console.log(newRecord);
    this.releaseService.saveNewReleaseItem(newRecord).subscribe(newRecords => {
      const tempArr = [];
      this.adjustCols.emit('new');
    });

  }

  onItemChange(item, index) {
    console.log('ITEM INDEX', item, index);
    const control = this.myForm.controls.addRows as FormArray;
    const selectedItem = _.filter(this.releaseItems, (iitem) => {
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
