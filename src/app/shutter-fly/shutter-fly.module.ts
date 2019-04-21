import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShutterFlyRoutingModule } from './shutter-fly-routing.module';
import { ShutterFlyComponent } from './shutter-fly.component';
import { MaterialModule } from '../ng-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InventoryModule } from './features/inventory/inventory.module';
import { PrintOrdersModule } from './features/print-orders/print-orders.module';
import { ReleasesModule } from './features/releases/releases.module';
import { CoreModule } from './core/core.module';
import { FeaturesModule } from './features/features.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [ShutterFlyComponent],
  imports: [
    CommonModule,
    ShutterFlyRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    InventoryModule,
    PrintOrdersModule,
    ReleasesModule,
    CoreModule,
    FeaturesModule,
    SharedModule
  ],
  exports: [ShutterFlyComponent]
})
export class ShutterFlyModule { }
