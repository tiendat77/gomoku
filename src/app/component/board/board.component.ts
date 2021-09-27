import { Component } from '@angular/core';

@Component({
  selector: 'gomoku-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  host: {
    'class': 'gomoku-board'
  }
})
export class BoardComponent {

  readonly size = new Array(14).fill(1).map((value, index) => value + index);

  constructor() { }

}
