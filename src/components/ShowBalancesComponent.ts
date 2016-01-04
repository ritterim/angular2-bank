import { Component, OnDestroy, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import {Account} from '../account';
import {Bank} from '../bank';

@Component({
  directives: [ CORE_DIRECTIVES ],
  providers: [ Bank ],
  selector: 'show-balances',
  styles: [`
    .zero-balance {
      color: red;
      font-weight: bold;
    }
  `],
  template: require('./ShowBalancesComponent.html')
})
export class ShowBalancesComponent implements OnInit, OnDestroy {
  public accounts: Account[];

  private _accountUpdatesSubscription: any;
  private _bank: Bank;

  constructor(bank: Bank) {
    this._bank = bank;
  }

  public ngOnInit() {
    this._accountUpdatesSubscription = Bank.accountUpdates
      .subscribe(() => this.refreshAccounts());
  }

  public ngOnDestroy() {
    this._accountUpdatesSubscription.unsubscribe();
  }

  public isZeroBalance(account: Account) : boolean {
    return account.balance === 0;
  }

  public refreshAccounts() : void {
    this.accounts = this._bank.getAllAccounts();
  }
}
