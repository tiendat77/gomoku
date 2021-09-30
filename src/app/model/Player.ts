import { Color } from "../interface";

export abstract class Player {

  color: Color;
  worker?: Worker;

  constructor(color: Color) {
    this.color = color;
  }

  abstract turn();

  abstract watch(row, c, color);

  abstract terminate();

}
