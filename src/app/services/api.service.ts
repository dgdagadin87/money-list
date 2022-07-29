import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Response, ValuteItem } from '../types';
import { HTTP_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  public getMoneyList(): Observable<ValuteItem[]> {
    return this.http.get<Response>(HTTP_URL)
      .pipe(
        map((data: Response) => Object.values(data.Valute)),
        map((valutes: ValuteItem[]) => {
          return valutes.map((valute: ValuteItem) => ({ ...valute, NumOfMoney: 0 }) );
        }),
      );
  }
}
