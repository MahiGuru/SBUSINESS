import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintOrdersRoutingModule } from './print-orders-routing.module';
import { PrintOrdersComponent } from './print-orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/ng-material.module';
import { SharedModule } from 'src/app/shutter-fly/shared/shared.module';
import { PrintDataGridComponent } from './print-data-grid/print-data-grid.component';
import { PrintNewOrderComponent } from './print-new-order/print-new-order.component';
import { PrintSubOrdersComponent } from './print-sub-orders/print-sub-orders.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [PrintOrdersComponent, PrintDataGridComponent, PrintNewOrderComponent, PrintSubOrdersComponent],
  imports: [
    CommonModule,
    PrintOrdersRoutingModule,
    MaterialModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    FlexLayoutModule,
    SharedModule
  ],
  exports: [PrintOrdersComponent, PrintDataGridComponent, PrintNewOrderComponent, PrintSubOrdersComponent]
})
export class PrintOrdersModule { }
