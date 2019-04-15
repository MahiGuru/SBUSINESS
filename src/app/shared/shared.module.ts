import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../ng-material.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';

@NgModule({
  declarations: [DataGridComponent, DeleteDialogComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxDatatableModule,
  ],
  exports: [DataGridComponent, DeleteDialogComponent]
})
export class SharedModule { }
