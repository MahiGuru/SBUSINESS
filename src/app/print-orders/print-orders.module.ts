import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintOrdersRoutingModule } from './print-orders-routing.module';
import { PrintOrdersComponent } from './print-orders.component';
import { MaterialModule } from '../ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [PrintOrdersComponent],
  imports: [
    CommonModule,
    PrintOrdersRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    FlexLayoutModule
  ],
  exports: [PrintOrdersComponent]
})
export class PrintOrdersModule { }
