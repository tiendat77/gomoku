import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HammerModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports: [
    CommonModule,
    RouterModule,
    HammerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
})
export class CommonsModule { }
