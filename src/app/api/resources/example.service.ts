import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ExampleService {

  private _apiUrl = `http://localhost/api/example`;

  constructor(
    private readonly _http: HttpClient
  ) { }

  list(): Observable<any> {
    return this._http.get(`${this._apiUrl}/list`).pipe();
  }

  read(id: string): Observable<any> {
    return this._http.get(`${this._apiUrl}/read?id=${id}`).pipe();
  }

  create(example: any): Observable<any> {
    return this._http.post(`${this._apiUrl}/create`, example).pipe();
  }

  update(example: any): Observable<any> {
    return this._http.put(`${this._apiUrl}/update`, example).pipe();
  }

  delete(id: string) {
    return this._http.delete(`${this._apiUrl}/delete?id=${id}`).pipe();
  }

}
