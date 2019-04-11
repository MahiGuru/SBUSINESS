import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintOrdersRoutingModule } from './print-orders-routing.module';
import { PrintOrdersComponent } from './print-orders.component';

@NgModule({
  declarations: [PrintOrdersComponent],
  imports: [
    CommonModule,
    PrintOrdersRoutingModule
  ],
  exports: [PrintOrdersComponent]
})
export class PrintOrdersModule { }
