import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from '../ng-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InventoryModule } from '../inventory/inventory.module';
import { PrintOrdersModule } from './../print-orders/print-orders.module';
import { ReleasesModule } from '../releases/releases.module';

@NgModule({
  declarations: [LayoutComponent, ToolbarComponent, FooterComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    InventoryModule,
    PrintOrdersModule,
    ReleasesModule
  ],
  exports: [LayoutComponent, ToolbarComponent, FooterComponent]
})
export class LayoutModule { }
