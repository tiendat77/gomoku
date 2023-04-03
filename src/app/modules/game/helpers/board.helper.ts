export class BoardHelper {
  /**
  * Create a 2D array of size x size
  * @example
  * board(3) => [
  *  [0, 0, 0],
  *  [0, 0, 0],
  *  [0, 0, 0]
  * ]
  */
  static board(size: number) {
    return new Array(size)
      .fill(0)
      .map(() =>
        new Array(size).fill(0)
      );
  }

}