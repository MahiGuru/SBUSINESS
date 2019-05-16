import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(date: any, args?: any): any {
    const d = new Date(date);
    // console.log(d);
    return moment(d).format('DD/MM/YYYY');
  }

}
