import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/ng-material.module';
import { SharedModule } from '../../shared/shared.module';
import { InventoryDataGridComponent } from './inventory-data-grid/inventory-data-grid.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InventoryNewOrderComponent } from './inventory-new-order/inventory-new-order.component';
import { InventorySubOrdersComponent } from './inventory-sub-orders/inventory-sub-orders.component';

@NgModule({
  declarations: [InventoryComponent, InventoryDataGridComponent, InventoryNewOrderComponent, InventorySubOrdersComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FontAwesomeModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [InventoryComponent, InventoryDataGridComponent, InventoryNewOrderComponent, InventorySubOrdersComponent]
})
export class InventoryModule { }
