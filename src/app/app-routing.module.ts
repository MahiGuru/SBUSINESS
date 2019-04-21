import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'shutterfly',
    loadChildren: './shutter-fly/shutter-fly.module#ShutterFlyModule'
  },
  {
    path: '',
    redirectTo: 'shutterfly',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
