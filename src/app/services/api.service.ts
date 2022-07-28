import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//@ts-ignore
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HTTP_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  public getMoneyList() {}
}
