import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Subject, timer, fromEvent } from 'rxjs';
import { takeUntil, switchMap, retry, share, repeatWhen, debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { ValuteItem } from '../../types';

@Component({
  selector: 'app-money-list',
  templateUrl: './money-list.component.html',
  styleUrls: ['./money-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyListComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly destroy$ = new Subject();
  private readonly start$ = new Subject();
  private readonly stop$ = new Subject();
  private isSubscribed: boolean = false;

  @ViewChild('numOfRubInput', { static: false }) numOfRubInput: ElementRef;

  public numOfRub: number = 0;
  public valutes: ValuteItem[] = [];
  public isRefreshing: boolean = false;
  public displayedColumns: string[] = ['Name', 'Value', 'NumOfMoney'];

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.setModeyData();
  }

  ngAfterViewInit(): void {
    this.subscribeToInput();
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

  private subscribeToInput(): void {
    const prepareValue = (res: string) => {
      const value: number = parseInt(res);
      if (isNaN(value)) {
        return 0;
      }
      return value;
    };

    fromEvent(this.numOfRubInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target?.value),
        map((res: string) => prepareValue(res)),
        distinctUntilChanged(),
        debounceTime(300),
        takeUntil(this.destroy$),
      )
      .subscribe(this.recountData);
  }

  private recountData = (numOfRub: number): void => {
    this.numOfRub = numOfRub;
    
    const valutes: ValuteItem[] = this.valutes || [];
    this.valutes = valutes.map((valute: ValuteItem) => {
      const value: number = valute.Value;
      const numOfMoney = numOfRub / value;
      return { ...valute, NumOfMoney: parseFloat(numOfMoney.toFixed(3)), };
    });
    this.cdr.markForCheck();
  }

  private prepareData = (data: ValuteItem[]): void => {
    this.valutes = data;
    this.cdr.markForCheck();
  }

  private setModeyData(): void {
    this.api.getMoneyList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.prepareData);
  }

}
