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
  template: `
  <table>
    <thead>
      <tr>
        <th>Id</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="#account of accounts">
        <td>{{ account.id }}</td>
        <td [class.zero-balance]="account.balance === 0">{{ account.balance }}</td>
      </tr>
    </tbody>
  </table>
  `
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

  public refreshAccounts() : void {
    this.accounts = this._bank.getAllAccounts();
  }
}
