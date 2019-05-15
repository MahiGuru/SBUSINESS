import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { MaterialModule } from 'src/app/ng-material.module';

import { AgGridModule } from 'ag-grid-angular';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { InvenoryDataGridComponent } from './components/data-grids/invenory-data-grid/invenory-data-grid.component';
import { NewRecordComponent } from './components/data-grids/new-record/new-record.component';

@NgModule({
  declarations: [InvenoryDataGridComponent, DeleteDialogComponent, DataTableComponent, DateFormatPipe, NewRecordComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    NgxDatatableModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule, AgGridModule.withComponents([])
  ],
  exports: [InvenoryDataGridComponent, DeleteDialogComponent, DataTableComponent, DateFormatPipe, NewRecordComponent]
})
export class SharedModule { }
