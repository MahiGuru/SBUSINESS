import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { MaterialModule } from 'src/app/ng-material.module';

import { AgGridModule } from 'ag-grid-angular';
import { DataTableComponent } from './components/data-table/data-table.component';


@NgModule({
  declarations: [DataGridComponent, DeleteDialogComponent, DataTableComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule, AgGridModule.withComponents([])
  ],
  exports: [DataGridComponent, DeleteDialogComponent, DataTableComponent]
})
export class SharedModule { }
