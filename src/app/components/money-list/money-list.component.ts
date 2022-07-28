import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
//@ts-ignore
import { Subject, Observable, timer } from 'rxjs';
import { takeUntil, switchMap, retry, share } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { ValuteItem } from '../../types';

@Component({
  selector: 'app-money-list',
  templateUrl: './money-list.component.html',
  styleUrls: ['./money-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyListComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['Name', 'Value', 'NumOfMoney'];
  private readonly destroy$ = new Subject();
  private subscription: any = null;

  public numOfRub: number | null = null;
  public valutes: ValuteItem[] = [];
  public isRefreshing: boolean = false;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
  ) { this.prepareData = this.prepareData.bind(this); }

  ngOnInit(): void {
    this.setModeyData();
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  private getObservableForPolling(): Observable<ValuteItem[]> {
    return timer(200, 10000)
      .pipe(
        switchMap(() => this.api.getMoneyList()),
        retry(), share(), takeUntil(this.destroy$)
      );
  }

  public refreshData(): void {
    this.setModeyData();
  }

  public setAutoRefresh(value: boolean) {
    this.isRefreshing = value;
    
    if (value) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      const pollingObservable$: Observable<ValuteItem[]> = this.getObservableForPolling();
      this.subscription = pollingObservable$.subscribe(this.prepareData);
    }
    else {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }
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
