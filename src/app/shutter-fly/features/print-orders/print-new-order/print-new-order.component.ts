import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { PrintOrderService } from 'src/app/shutter-fly/shared/services/print-order.service';
import { CommonService } from 'src/app/shutter-fly/shared/services/common.service';


@Component({
  selector: 'sb-print-new-order',
  templateUrl: './print-new-order.component.html',
  styleUrls: ['./print-new-order.component.scss']
})
export class PrintNewOrderComponent implements OnInit, OnChanges {

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
  constructor(public printerService: PrintOrderService,
              public commonService: CommonService,
              public inventoryService: InventoryService,
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
      partner: ['', Validators.required],
      quantity: ['', Validators.required],
      poNum: ['', Validators.required]
    });
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
    this.addInitialRows();
  }

  addInitialRows() {
    const control = this.myForm.controls.addRows as FormArray;
    control.push(this.fb.group({
      itemNo: [null, Validators.required],
      itemDesc: [null, Validators.required],
      partners: [[]],
      itemType: [''],
      partner: [null, Validators.required],
      quantity: [null, Validators.required],
      poNum: [null, Validators.required]
    }));
    control.controls[0].get('itemNo').setValue(this.selectedItem.itemId);
    control.controls[0].get('itemDesc').setValue(this.selectedItem.itemId);
    control.controls[0].get('itemType').setValue(this.selectedItem.itemType);
  }
  addAnotherRow() {
    const control = this.myForm.controls.addRows as FormArray;
    control.push(this.fb.group({
      itemNo: [null, Validators.required],
      itemDesc: [null, Validators.required],
      partners: [[]],
      itemType: [''],
      partner: [null, Validators.required],
      quantity: [null, Validators.required],
      poNum: [null, Validators.required]
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
    // console.log('Detail Toggled', event);
  }
  addRowsToPrinter() {
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

    this.commonService.validateAllFields(this.myForm);
    if (this.myForm.valid) {
      this.printerService.saveNewPrintItem(newRecord).subscribe(newRecords => {
        this.rowsUpdate.emit(this.rows);
        this.commonService.openSnackBar('Successfully Created New Record', 'SAVE');
        console.log(this.rows);
      }, err => {
        const error: any = this.commonService.strToObj(err.error);
        this.commonService.openSnackBar(error.Error, 'Failed', 'error-snack');
      });
    }

  }

  onItemChange(item, index) {
    const control = this.myForm.controls.addRows as FormArray;
    const selectedItem = _.filter(this.printItems, (iitem) => {
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

  onPartnerChange(item) {
    const filteredPartner = (_.filter(this.partners, (partner) => {
      return partner.partnerId === item;
    }));
    this.selectedPartner.next(filteredPartner);
    // console.log('Patner selected', this.selectedPartner);
  }

}
