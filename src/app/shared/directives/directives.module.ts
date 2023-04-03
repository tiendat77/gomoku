import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Directives */
import { AvatarDirective } from './avatar.directive';
import { GreetDirective } from './greet.directive';
import { HeaderDirective } from './header.directive';
import { NumberOnlyDirective } from './number-only.directive';

const DIRECTIVES: any[] = [
  AvatarDirective,
  GreetDirective,
  HeaderDirective,
  NumberOnlyDirective,
];

@NgModule({
  imports: [CommonModule],
  exports: DIRECTIVES,
  declarations: DIRECTIVES
})
export class DirectivesModule { }
