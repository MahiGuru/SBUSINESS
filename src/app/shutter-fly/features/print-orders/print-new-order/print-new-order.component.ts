import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { InventoryService } from 'src/app/shutter-fly/shared/services/inventory.service';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { PrintOrderService } from 'src/app/shutter-fly/shared/services/print-order.service';
import { PrintOrder } from 'src/app/shutter-fly/core/models/printOrder';


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
      itemNo: [''],
      itemDesc: [''],
      itemType: [''],
      partner: [''],
      quantity: [''],
      poNum: ['']
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
  addRowsToPrinter() {
    const control = this.myForm.controls.addRows as FormArray;
    // console.log(control.value);
    const newRecord = [];
    _.each(control.value, (val) => {
      // console.log('SAVE ', val);
      newRecord.push({
        ItemPartner: {
          ItemPartnerId: val.partner
        },
        Quantity: val.quantity,
        PoNum: val.poNum,
        Status: 'New'
      });
    });

    this.printerService.saveNewPrintItem(newRecord).subscribe(newRecords => {
      // console.log('SAVEDDDDD >>>> ', newRecords);
      const tempArr = [];
      _.each(newRecords, (record, index) => {
        const tempChildArr = [];
        _.each(record.children, (child) => {
          tempChildArr.push(new PrintOrder(child));
        });
        record.children = tempChildArr;
        tempArr.push(new PrintOrder(record));
      });
      // console.log('TEMP ARRRRRRRR', tempArr);
      const merged = _.merge(_.keyBy(this.rows, 'printOrderId'), _.keyBy(newRecords, 'printOrderId'));
      this.rows = _.values(merged);
      this.rowsUpdate.emit(this.rows);
      // console.log(values);
      console.log(this.rows);

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
