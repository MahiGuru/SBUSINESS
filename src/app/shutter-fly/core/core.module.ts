import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from 'src/app/ng-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [FooterComponent, ToolbarComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [ToolbarComponent, FooterComponent]
})
export class CoreModule { }
