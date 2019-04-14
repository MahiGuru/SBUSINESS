import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../ng-material.module';
import { InventoryDataGridComponent } from './inventory-data-grid/inventory-data-grid.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InventoryComponent, InventoryDataGridComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [InventoryComponent, InventoryDataGridComponent]
})
export class InventoryModule { }
