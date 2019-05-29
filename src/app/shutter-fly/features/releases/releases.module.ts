import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReleasesRoutingModule } from './releases-routing.module';
import { ReleasesComponent } from './releases.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from 'src/app/ng-material.module';
import { SharedModule } from 'src/app/shutter-fly/shared/shared.module';
import { ReleaseSubOrdersComponent } from './release-sub-orders/release-sub-orders.component';
import { ReleaseDataGridComponent } from './release-data-grid/release-data-grid.component';
import { ReleaseNewOrderComponent } from './release-new-order/release-new-order.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [ReleasesComponent, ReleaseDataGridComponent , ReleaseSubOrdersComponent, ReleaseNewOrderComponent],
  imports: [
    CommonModule,
    ReleasesRoutingModule,
    MaterialModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    SharedModule
  ],
  exports: [ReleasesComponent, ReleaseDataGridComponent , ReleaseSubOrdersComponent, ReleaseNewOrderComponent]
})
export class ReleasesModule { }
