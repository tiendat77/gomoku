import { Injectable } from '@angular/core';

import { ExampleService } from './resources/example.service';

@Injectable()
export class ApiService {

  constructor(
    public readonly example: ExampleService
  ) { }

}
