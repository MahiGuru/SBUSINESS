import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './/shutter-fly/features/login/login.component';

const routes: Routes = [
  {
    path: 'shutterfly',
    loadChildren: './shutter-fly/shutter-fly.module#ShutterFlyModule'
  }, {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
