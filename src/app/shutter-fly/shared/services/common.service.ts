import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string, className = 'snackbar') {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: className
    });
  }
  strToObj(str) {
    const obj = {};
    if (str || typeof str === 'string') {
      const objStr = str.match(/\{(.)+\}/g);
      eval('obj =' + objStr);
    }
    return obj;
  }
  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormArray) {
        for (const control1 of control.controls) {
          if (control1 instanceof FormControl) {
            control1.markAsTouched({
              onlySelf: true
            });
          }
          if (control1 instanceof FormGroup) {
            this.validateAllFields(control1);
          }
        }
        // control.markAsTouched();
      }
      if (control instanceof FormControl) {
        control.markAsTouched({
          onlySelf: true
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }
}
