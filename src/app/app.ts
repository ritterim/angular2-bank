import {AfterViewInit, Component, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';

import {Bank} from '../bank';
import {AccountOperationsComponent} from '../components/AccountOperationsComponent';
import {ShowBalancesComponent} from '../components/ShowBalancesComponent';

@Component({
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    AccountOperationsComponent,
    ShowBalancesComponent
  ],
  pipes: [],
  providers: [ Bank ],
  selector: 'app',
  styles: [ require('./app.css') ],
  template: require('./app.html')
})
export class App implements OnInit, AfterViewInit {
  constructor(private bank: Bank) {
  }

  ngOnInit() {
    console.log('hello App');
  }

  ngAfterViewInit() {
    this.bank.openAccount('account-1', 123);
    this.bank.openAccount('account-2', 234);
  }
}
