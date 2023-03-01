import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SafeHtmlPipe } from './safe.pipe';
import { DateRangePipe } from './date-range.pipe';
import { MakePluralStringPipe } from './pluralize.pipe';

const PIPES: any[] = [
  SafeHtmlPipe,
  DateRangePipe,
  MakePluralStringPipe,
];

@NgModule({
  imports: [CommonModule],
  exports: PIPES,
  declarations: PIPES
})
export class PipesModule { }
