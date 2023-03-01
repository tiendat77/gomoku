export class StorageHelper {

  public static set(key: string, data: any): void {
    if (data === null || data === undefined) {
      localStorage.setItem(key, '');
      return;
    }

    try {
      if (typeof data === 'object') {
        localStorage.setItem(key, JSON.stringify(data));

      } else {
        localStorage.setItem(key, '' + data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  public static get<T>(key: string): T | null {
    const data = localStorage.getItem(key) || null;

    if (data === null) {
      return null;
    }

    try {
      return JSON.parse(data) as T;

    } catch(e) {
      return data as T;
    }
  }

  public static getInt(key: string): number | null {
    const data = localStorage.getItem(key) || null;

    if (data === null) {
      return null;
    }

    try {
      return parseInt(data, 10);

    } catch(e) {
      return null;
    }
  }

  public static remove(key: string): void {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  }

}
