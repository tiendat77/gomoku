import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

function isPrimitive(value: any) {
  if (value === null) {
    return true;
  }

  if (typeof value === 'function' || typeof value === 'object') {
    return false;
  }

  return true;
}

@Injectable()
export class PreferencesService {

  constructor() { }

  async get<T>(key: string): Promise<T | null> {
    let { value } = await Preferences.get({ key }) as any;

    if (value === null || value === undefined) {
      return null;
    }

    // Try to parse as JSON
    try {
      value = JSON.parse(value);
    } catch (error) {}

    return value as T;
  }

  set(key: string, value: any): Promise<void> {
    if (!isPrimitive(value)) {
      value = JSON.stringify(value);
    }

    return Preferences.set({key, value});
  }

  remove(key: string): Promise<void> {
    return Preferences.remove({key});
  }

  clear(): Promise<void> {
    return Preferences.clear();
  }

}
