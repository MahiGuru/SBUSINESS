import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { Inventory } from 'src/app/shutter-fly/core/models/inventory-old';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Component({
  selector: 'sb-new-record',
  templateUrl: './new-record.component.html',
  styleUrls: ['./new-record.component.sass']
})
export class NewRecordComponent implements OnInit, OnChanges {
  @Input() rows: any = [];
  @Input() table: any;
  @Input() isAddBtnClicked: any;
  @Output() updatedRows: EventEmitter<any> = new EventEmitter();

  myForm: FormGroup;

  public selectedPartner: any = new BehaviorSubject('');
  newRowHeight: number;

  // List of items
  items: any = [];
  // List of partners
  partners: any = [];

  constructor(public inventoryService: InventoryService, public fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.isAddBtnClicked && changes.isAddBtnClicked.currentValue) {
        this.addNewItem();
      }
  }
  ngOnInit() {
    this.myForm = this.fb.group({
      addRows: this.fb.array([])
    });
    this.getItems();
    this.getPartners();
  }
  /**
   * Add New Button clicked in Inventory Section
   */
  addNewItem(){
    const control = this.myForm.controls.addRows as FormArray;

    this.rows.unshift(new Inventory());
    this.rows = [...this.rows];
    this.updatedRows.emit(this.rows);

    control.push(this.fb.group({
      itemNo: [1],
      itemDesc: [1],
      itemType: [''],
      partner: [1]
    }));
    if (this.items){
      control.controls[0].get('itemNo').setValue(this.items[0].itemId);
      control.controls[0].get('itemDesc').setValue(this.items[0].itemId);
      control.controls[0].get('itemType').setValue(this.items[0].itemType);
    }
    // this.isNewRowEnabled = true;
    this.newRowHeight = 100;
    // console.log('addedRows >>> ', this.addedRows);
    setTimeout(() => {
      this.table.rowDetail.toggleExpandRow(this.rows[0]);
    }, 100);
  }
  /**
   * Get List of Items for adding new Item
   */
  getItems(){
      this.inventoryService.getAddItems().subscribe(res => {
        this.items = res;
        console.log('INV ITEMS >>>> ', res, this.items);
      });
  }

  /**
   * Get List of partners for adding new Item
   */
  getPartners(){
      this.inventoryService.getPartners().subscribe(partners => {
        this.partners = partners;
        console.log('partners >>>> ', partners, this.partners);
      });
  }

  /**
   * ON Item change respective ItemNo and ItemDesc updated..
   * @param item - itemObj
   * @param index  - item Index
   */
  onItemChange(item, index) {
    const control = this.myForm.controls.addRows as FormArray;
    const selectedItem = _.filter(this.items, (iitem) => {
      return iitem.itemId === item.value;
    });
    control.controls[index].get('itemNo').setValue(selectedItem[0].itemId);
    control.controls[index].get('itemDesc').setValue(selectedItem[0].itemId);
    control.controls[index].get('itemType').setValue(selectedItem[0].itemType);
    console.log('INDEX', index, item);

  }

  /**
   * On Partner dropdown change
   * @param item  - get selected partner item
   */
  onPartnerChange(item) {
    const filteredPartner = (_.filter(this.partners, (partner) => {
      return partner.partnerId === item.value;
    }));
    // this.selectedPartner.next(filteredPartner);
    // console.log('Patner selected', this.selectedPartner);
  }

  /**
   * Add Another Row by clickking on Plus button
   */
  addAnotherRow() {
    const control = this.myForm.controls.addRows as FormArray;
    control.push(this.fb.group({
      itemNo: [1],
      itemDesc: [1],
      itemType: [''],
      partner: [1]
    }));
    // this.newRowHeight += 30;
  }

  /**
   * remove selected Row
   * @param i - for item index
   */
  removeCurrentRow(i) {
    const control = this.myForm.controls.addRows as FormArray;
    control.removeAt(i);
    this.newRowHeight -= 30;
  }

  /**
   * SAVE Inventory
   * newly added records will push to array(newRecorsArr) as objects
   */
  saveInventory() {
    const control = this.myForm.controls.addRows as FormArray;
    // ****** PREPARING DATA And push to newRecord array ****
    const newRecorsArr = [];
    _.each(control.value, (val) => {
      newRecorsArr.push({ tem: { ItemId: val.itemNo }, Partner: { PartnerId: val.partner } });
    });
    /** SAVING new inventorys  */
    this.inventoryService.saveNewInventory(newRecorsArr).subscribe(newRecordResponse => {
      const tempArr = [];
      _.each(newRecordResponse, (record) => {
        const tempChildArr = [];
        _.each(record.children, (child) => tempChildArr.push(new Inventory(child)));
        record.children = tempChildArr;
        tempArr.push(new Inventory(record));
      });
      // bind the returned to data to existing grid.
      const merged = _.merge(_.keyBy(this.rows, 'itemPartner.item.itemNo'), _.keyBy(newRecordResponse, 'itemPartner.item.itemNo'));
      this.updatedRows.emit(_.values(merged));
    });
  }

  /**
   * Cancel New Inventory
   * hide newRecord row and remove from existing rows table
   */
  cancelNewInventory() {
    const control = this.myForm.controls.addRows as FormArray;
    control.controls = [];
    this.newRowHeight = 100;
    this.rows.splice(0, 1);
    this.rows = [...this.rows];
    this.updatedRows.emit(_.values(this.rows));
    this.table.rowDetail.toggleExpandRow(this.rows[0]);
    this.isAddBtnClicked.emit(false);
    // this.isNewRowEnabled = false;
  }

}
