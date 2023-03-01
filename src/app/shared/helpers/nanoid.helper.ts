const urlAlphabet = 'userandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

export class NanoIdHelper {
  static pool = Array();

  private static _fillPool(size: number = 21) {
    if (!NanoIdHelper.pool || !NanoIdHelper.pool.length) {
      NanoIdHelper.pool = Array(size * 128).fill(0);
      this._randomFill(NanoIdHelper.pool);
    }
  }

  private static _randomFill(array: number[]) {
    array.forEach((_, i) => {
      array[i] = Math.floor(Math.random() * array.length);
    });
  }

  static generate(size = 21) {
    this._fillPool();
    this._randomFill(NanoIdHelper.pool);

    let id = '';
    for (let i = 0; i < size; i++) {
      id += urlAlphabet[NanoIdHelper.pool[i] & 63];
    }

    return id;
  }
}
