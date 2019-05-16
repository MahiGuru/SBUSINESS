import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintOrdersRoutingModule } from './print-orders-routing.module';
import { PrintOrdersComponent } from './print-orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/ng-material.module';
import { SharedModule } from 'src/app/shutter-fly/shared/shared.module';

@NgModule({
  declarations: [PrintOrdersComponent],
  imports: [
    CommonModule,
    PrintOrdersRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    FlexLayoutModule,
    SharedModule
  ],
  exports: [PrintOrdersComponent]
})
export class PrintOrdersModule { }
