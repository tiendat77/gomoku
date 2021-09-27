import { Component, Output, EventEmitter } from '@angular/core';
import { ElementRef, QueryList, ViewChildren } from '@angular/core';

import { GoComponent } from '../go/go.component';
import { Color, Place, PlaceMap } from '../../interface';

@Component({
  selector: 'gomoku-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
  host: {
    'class': 'gomoku-places'
  }
})
export class PlacesComponent {

  @Output() onGo: EventEmitter<Place> = new EventEmitter();
  @ViewChildren(GoComponent) protected places: QueryList<GoComponent>;

  readonly size = new Array(15).fill(0).map((value, index) => index);

  protected setPlaces = 0;
  protected placeable = false;

  protected colour: Color[] = [
    'black',
    'white'
  ];

  protected map: PlaceMap = {
    black: [],
    white: []
  };

  protected moves = [
    [1,0],
    [0,1],
    [1,1],
    [1,-1]
  ];

  protected warnings = {
    black: false,
    white: false
  };

  constructor(private elementRef: ElementRef) {
    this.init();
  }

  init() {
    const generate = () => {
      const map = [];
      for (let d = 0; d < 4; d++) {
        const dir = [];
        for (let r = 0; r < 15; r++) {
          const tmp = [];
          for (let c = 0; c < 15; c++) {
            tmp.push(1);
          }
          dir.push(tmp);
        }
        map.push(dir);
      }

      return map;
    };

    this.map.black = generate();
    this.map.white = generate();
  }

  clear() {
    this.setPlaces = 0;

    this.unhighlight();
    this.places.forEach(place => place.clear());

    for (const color of this.colour) {
      this.map[color].forEach(direction => {
        direction.forEach(row => {
          row.forEach((column, index) => {
            row[index] = 1;
          });
        });
      });
    }
  }

  update(r: number, c: number, color?: Color) {
    if (!color) {
      return this._remove(r, c);
    }

    return this._update(r, c, color);
  }

  result(r: number, c: number, color: Color) {
    if (this.map[color].some(e => e[r][c] > 4)) {
      this.blur(r, c, color);
      return 'win';
    }

    if (this.setPlaces === 225) {
      return 'draw';
    }

    return false;
  }

  set(place: Place, color: Color) {
    this.setPlaces++;
    this.unhighlight();

    this.getPlace(place.r, place.c).go(color);
    this.getPlace(place.r, place.c).highlight();
  }

  unset(place: Place) {
    this.setPlaces--;
    this.getPlace(place.r, place.c).unGo();
    this.update(place.r, place.c);
  }

  unhighlight() {
    const childs = this.getElement().getElementsByClassName('last-move');
    for (let i = 0; i < childs.length; i++) {
      childs[i].classList.remove('last-move');
    }
  }

  getPlace(r: number, c: number) {
    return this.places.get(r * 15 + c);
  }

  setColor(color: Color) {
    if (color) {
      this.getElement().classList.remove('black', 'white');
      this.getElement().classList.add(color);
    }
  }

  setPlaceable(placeable: boolean) {
    if (placeable) {
      this.placeable = true;
      this.getElement().classList.add('placeable');

    } else {
      this.placeable = false;
      this.getElement().classList.remove('placeable');
    }
  }

  setWarning(color: Color, shouldWarn: boolean) {
    this.warnings[color] = !!shouldWarn;
  }

  warning(r: number, c: number, dir: number, color: Color) {
    if (!this.warnings[color]) {
      return;
    }

    if (this.map[color][dir][r][c] > 4) {
      this.getPlace(r, c).warn();

    } else {
      this.getPlace(r, c).unWarn();
    }
  }

  blur(r: number, c: number, color: Color) {
    // blur the lose color stones
    const num = this.colour.indexOf(color);

    const warns = this.getElement().getElementsByClassName('warning');
    for (let i = 0; i < warns.length; i++) {
      warns[i].classList.remove('warning');
    }

    let dir;
    for (let i = 0; i < 4; i++) {
      if(this.map[color][i][r][c] >= 5){
        dir = i;
        break;
      }
    }

    this.places.forEach(place => {
      place.blur();
    });

    for (let i = -1; i < 2; i += 2) {
      let rr = r;
      let cc = c;

      do {
        this.getPlace(rr, cc).unBlur();
        rr += this.moves[dir][0] * i;
        cc += this.moves[dir][1] * i;
      } while(rr >= 0 && rr < 15 && cc >= 0 && cc < 15 && this.map[color][dir][rr][cc] == -num);
    }
  }

  onSet(place: Place) {
    if (!this.getPlace(place.r, place.c).canGo()) {
      return;
    }

    this.onGo.emit(place);
  }

  /** Helper */
  private getElement() {
    return this.elementRef.nativeElement as HTMLElement;
  }

  private _update(r: number, c: number, color: Color) {
    const num = this.colour.indexOf(color);
    const other = this.colour[1 - num];

    for(let i = 0; i < 4; i++) {
      for(let coe = -1; coe < 2; coe += 2) {

        //update for the current color
        let x = r;
        let y = c;

        do {
          x += this.moves[i][0] * coe;
          y += this.moves[i][1] * coe;
        } while(x >= 0 && y >= 0 && x < 15 && y < 15 && this.map[color][i][x][y] === -num);

        if (x >= 0 && y >= 0 && x < 15 && y < 15 && this.map[color][i][x][y] > 0) {
          this.map[color][i][x][y] = this.map[color][i][r][c] + 1;

          let cont = 0;
          let mx = x + this.moves[i][0] * coe;
          let my = y + this.moves[i][1] * coe;

          while (mx >= 0 && my >= 0 && mx < 15 && my < 15 && this.map[color][i][mx][my] === -num) {
            cont++;
            mx += this.moves[i][0] * coe;
            my += this.moves[i][1] * coe;
          }

          this.map[color][i][x][y] += cont;
          this.warning(x, y, i, color);
        }

        //update for the other color
        x = r;
        y = c;

        do {
          x += this.moves[i][0] * coe;
          y += this.moves[i][1] * coe;
        } while(x >= 0 && y >= 0 && x < 15 && y < 15 && this.map[other][i][x][y] === num - 1);
      }
    }

    for(let i = 0; i < 2; i++) {
      for(let dir = 0; dir < 4; dir++) {
        const cl = this.colour[i];
        this.map[cl][dir][r][c] = -num;
        this.warning(r, c, 0, cl);
      }
    }
  }

  private _remove(r: number, c: number) {
    for(let i = 0; i < 2; i++) {
      const color = this.colour[i];

      for (let dir = 0; dir < 4; dir++) {
        this.map[color][dir][r][c] = 1;
        this.warning(r, c, dir, color);

        // coefficient
        for(let coe= -1; coe < 2; coe += 2) {
          let x = r;
          let y = c;
          let len = 0;

          do {
            x += this.moves[dir][0] * coe;
            y += this.moves[dir][1] * coe;
            len++;
          } while(x >= 0 && y >= 0 && x < 15 && y < 15 && this.map[color][dir][x][y] === -i);

          if(x >= 0 && y >= 0 && x < 15 && y < 15 && this.map[color][dir][x][y] > 0) {
            this.map[color][dir][x][y] = len;
            this.warning(x, y, dir, color);

            this.map[color][dir][r][c] += len - 1;
            this.warning(r, c, dir, color);

            let cont = 0;
            let mx = x + this.moves[dir][0] * coe;
            let my = y + this.moves[dir][1] * coe;
            while(mx >= 0 && my >= 0 && mx < 15 && my < 15 && this.map[color][dir][mx][my] === -i){
              cont++;
              mx += this.moves[dir][0] * coe;
              my += this.moves[dir][1] * coe;
            }

            this.map[color][dir][x][y] += cont;
            this.warning(x, y, dir, color);

          } else{
            this.map[color][dir][r][c] += len - 1;
            this.warning(r, c, dir, color);
          }
        }
      }
    }
  }
}
