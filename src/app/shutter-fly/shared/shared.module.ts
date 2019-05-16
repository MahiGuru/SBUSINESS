import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { MaterialModule } from 'src/app/ng-material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { PrintDataGridComponent } from 'src/app/shutter-fly/shared/components/print-data-grid/print-data-grid.component';

@NgModule({
  declarations: [DataGridComponent, DeleteDialogComponent, DateFormatPipe, PrintDataGridComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    NgxDatatableModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  exports: [DataGridComponent, DeleteDialogComponent, DateFormatPipe, PrintDataGridComponent]
})
export class SharedModule { }
