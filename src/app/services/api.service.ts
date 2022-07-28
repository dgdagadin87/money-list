import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//@ts-ignore
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Response } from '../types';
import { HTTP_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  public getMoneyList() {
    return this.http.get<Response>(HTTP_URL);
  }
}
