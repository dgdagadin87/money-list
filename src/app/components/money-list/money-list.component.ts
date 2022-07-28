import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-money-list',
  templateUrl: './money-list.component.html',
  styleUrls: ['./money-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
