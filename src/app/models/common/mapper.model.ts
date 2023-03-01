export interface MapperModel<T> {
  [key: string]: T;
}

export class Mapper<T> {
  private _mapper: MapperModel<T>;

  constructor() {
    this._mapper = {};
  }

  get(key: string): T | null {
    return this._mapper[key] ?? null;
  }

  set(key: string, value: T | null) {
    this._mapper[key] = value!;
  }

  remove(key: string) {
    this._mapper[key] = null!;
  }

  clear() {
    this._mapper = {};
  }

  merge(mapper: {[key: string]: T}) {
    this._mapper = {
      ...this._mapper,
      ...mapper
    };
  }

}
