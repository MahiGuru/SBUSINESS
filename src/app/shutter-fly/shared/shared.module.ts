import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from 'src/app/ng-material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { Print11DataGridComponent } from 'src/app/shutter-fly/shared/components/print-data-grid/print-data-grid.component';
import { ConfirmDialogComponent } from 'src/app/shutter-fly/shared/components/confirm-dialog/confirm-dialog.component';
import { ReleaseGridComponent } from 'src/app/shutter-fly/shared/components/release-grid/release-grid.component';
import { GridFilterComponent } from './components/grid-filter/grid-filter.component';

@NgModule({
  declarations: [DataGridComponent, ConfirmDialogComponent, DateFormatPipe,
    /*PrintDataGridComponent, ReleaseGridComponent, */ GridFilterComponent],
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
  entryComponents: [ConfirmDialogComponent],
  exports: [DataGridComponent, ConfirmDialogComponent, DateFormatPipe,  GridFilterComponent]
})
export class SharedModule { }
