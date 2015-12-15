import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import {Account} from '../account';
import {Bank} from '../bank';

@Component({
  directives: [ CORE_DIRECTIVES ],
  providers: [ Bank ],
  selector: 'show-balances',
  styles: [`
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
      <tr *ngFor="#account of getAllAccounts()">
        <td>{{ account.id }}</td>
        <td>{{ account.balance }}</td>
      </tr>
    </tbody>
  </table>
  `
})
export class ShowBalancesComponent {
  private bank: Bank;

  constructor(bank: Bank) {
    this.bank = bank;
  }

  public getAllAccounts() : Account[] {
    return this.bank.getAllAccounts();
  }
}
