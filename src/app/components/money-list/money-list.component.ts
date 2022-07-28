import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//@ts-ignore
import { Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { Response, ValuteItem } from '../../types';

@Component({
  selector: 'app-money-list',
  templateUrl: './money-list.component.html',
  styleUrls: ['./money-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyListComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['Name', 'Value', 'NumOfMoney'];

  private readonly destroy$ = new Subject();
  public numOfRub: number | null = null;
  public valutes: ValuteItem[] = [];

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.setModeyData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  public refreshData(): void {
    alert('jjj')
    this.setModeyData();
  }

  private setModeyData(): void {
    this.api.getMoneyList()
      .pipe(
        takeUntil(this.destroy$),
        map((data: Response) => Object.values(data.Valute)),
        map((valutes: ValuteItem[]) => {
          return valutes.map((valute: ValuteItem) => ({ ...valute, NumOfMoney: 0 }) );
        }),
      )
      .subscribe((data: ValuteItem[]) => {
        this.valutes = data;
        this.cdr.markForCheck();
      });
  }

}
