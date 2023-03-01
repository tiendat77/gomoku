import { toLower, trim } from 'lodash';
import { StringHelper } from './string.helper';

export class GeneralHelper {

  static guid(): string {
    let d = new Date().getTime();

    // Use high-precision timer if available
    if (
      typeof performance !== 'undefined' &&
      typeof performance.now === 'function'
    ) {
      d += performance.now();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  static search(array: any[], keys: string[], pattern: string,) {
    if (!array) {
      return [];
    }

    pattern = StringHelper.normalize(pattern);
    pattern = trim(pattern);
    pattern = toLower(pattern);

    // search pattern is empty, return origin array
    if (!pattern) {
      return array?.slice();
    }

    // do filter
    return array.filter((a) =>
      keys
        .map(key => toLower(a[key]).includes(pattern))
        .reduce((prev, curr) => prev || curr, false)
    );
  }

}
