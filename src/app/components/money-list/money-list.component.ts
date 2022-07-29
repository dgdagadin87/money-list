import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//@ts-ignore
import { Subject, Observable, timer } from 'rxjs';
import { takeUntil, switchMap, retry, share, repeatWhen } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { ValuteItem } from '../../types';

@Component({
  selector: 'app-money-list',
  templateUrl: './money-list.component.html',
  styleUrls: ['./money-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyListComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject();
  private readonly start$ = new Subject();
  private readonly stop$ = new Subject();
  private isSubscribed: boolean = false;

  public numOfRub: number | null = null;
  public valutes: ValuteItem[] = [];
  public isRefreshing: boolean = false;
  public displayedColumns: string[] = ['Name', 'Value', 'NumOfMoney'];

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
  ) { this.prepareData = this.prepareData.bind(this); }

  ngOnInit(): void {
    this.setModeyData();
  }

  ngOnDestroy(): void {
    this.stop$.next(null);
    this.destroy$.next(null);
  }

  public refreshData(): void {
    this.setModeyData();
  }

  public setAutoRefresh(value: boolean): void {
    this.isRefreshing = value;

    if (value) {
      if (!this.isSubscribed) {
        this.isSubscribed = true;
        timer(200, 10000)
          .pipe(
            switchMap(() => this.api.getMoneyList()),
            retry(), share(), takeUntil(this.stop$),
            repeatWhen(() => this.start$)
          )
          .subscribe(this.prepareData)
      }
      this.start$.next(null);
    }
    else {
      this.stop$.next(null);
    }
  }

  private prepareData(data: ValuteItem[]): void {
    this.valutes = data;
    this.cdr.markForCheck();
  }

  private setModeyData(): void {
    this.api.getMoneyList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.prepareData);
  }

}
