import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShutterFlyComponent } from './shutter-fly.component';

const routes: Routes = [
  {
    path: '',
    component: ShutterFlyComponent,
    // children: [
    //   {
    //     path: 'inventory',
    //     loadChildren: '../inventory/inventory.module#InventoryModule'
    //   },
    //   {
    //     path: 'print',
    //     loadChildren: '../print-orders/print-orders.module#PrintOrdersModule'
    //   },
    //   {
    //     path: 'releases',
    //     loadChildren: '../releases/releases.module#ReleasesModule'
    //   }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShutterFlyRoutingModule { }
