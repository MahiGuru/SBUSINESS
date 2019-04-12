import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'inventory',
        loadChildren: '../inventory/inventory.module#InventoryModule'
      },
      {
        path: 'print',
        loadChildren: '../print-orders/print-orders.module#PrintOrdersModule'
      },
      {
        path: 'releases',
        loadChildren: '../releases/releases.modules#ReleasesModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
