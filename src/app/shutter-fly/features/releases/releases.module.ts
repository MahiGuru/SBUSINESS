import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReleasesRoutingModule } from './releases-routing.module';
import { ReleasesComponent } from './releases.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from 'src/app/ng-material.module';
import { SharedModule } from 'src/app/shutter-fly/shared/shared.module';


@NgModule({
  declarations: [ReleasesComponent],
  imports: [
    CommonModule,
    ReleasesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    SharedModule
  ],
  exports: [ReleasesComponent]
})
export class ReleasesModule { }
