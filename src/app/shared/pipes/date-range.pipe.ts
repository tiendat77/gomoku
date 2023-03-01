import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

/**
 * @description
 * format with moment
 */
@Pipe({ name: 'dateRange' })
export class DateRangePipe implements PipeTransform {

  constructor() { }

  transform(dates: [any, any], args?: any) {
    const start = moment(dates[0]);
    const end = moment(dates[1]);

    if (start.year() !== end.year()) {
      return start.format('D MMM, YYYY') + ' - ' + end.format('D MMM, YYYY');
    }

    if (start.month() !== end.month()) {
      return start.format('D MMM') + ' - ' + end.format('D MMM, YYYY');
    }

    if (start.date() !== end.date()) {
      return start.format('D') + ' - ' + end.format('D MMM, YYYY');
    }

    return start.format('dddd D MMM, YYYY');
  }
}
