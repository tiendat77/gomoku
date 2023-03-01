export type Scheme = 'auto' | 'dark' | 'light';

export class AppConfig {
  scheme?: Scheme;
  language?: string;

  constructor(data: Partial<AppConfig>) {
    Object.assign(this, data);
  }
}
