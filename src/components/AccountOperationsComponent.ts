import { Component } from 'angular2/core';
import { FORM_DIRECTIVES } from 'angular2/common';

import {Account} from '../account';
import {Bank} from '../bank';

@Component({
  directives: [ FORM_DIRECTIVES ],
  providers: [ Bank ],
  selector: 'account-operations',
  styles: [`
  `],
  template: `
  <input [(ngModel)]="accountId" type="text" placeholder="accountId" />
  <input [(ngModel)]="amount" type="number" placeholder="amount" />
  <button (click)="openAccount()">Open Account</button>
  <button (click)="closeAccount()">Close Account</button>
  <button (click)="deposit()">Deposit</button>
  <button (click)="withdraw()">Withdraw</button>
  `
})
// TODO: Surface errors to user, gray out buttons as they should be / should not be usable
export class AccountOperationsComponent {
  public accountId: string;
  public amount: number;

  private _bank: Bank;

  constructor(bank: Bank) {
    this._bank = bank;
  }

  public openAccount() : void {
    if (!this.accountId) {
      throw new Error('accountId must be provided.');
    }
    if (!this.amount) {
      throw new Error('amount must be provided.');
    }

    this._bank.openAccount(this.accountId, this.amount);

    this.resetAmount();
  }

  public closeAccount() : void {
    if (!this.accountId) {
      throw new Error('accountId must be provided.');
    }

    this._bank.closeAccount(this.accountId);

    this.resetAmount();
  }

  public deposit() : void {
    if (!this.accountId) {
      throw new Error('accountId must be provided.');
    }

    if (!this.amount) {
      throw new Error('amount must be provided.');
    }

    this._bank.deposit(this.accountId, this.amount);

    this.resetAmount();
  }

  public withdraw() : void {
    if (!this.accountId) {
      throw new Error('accountId must be provided.');
    }

    if (!this.amount) {
      throw new Error('amount must be provided.');
    }

    this._bank.withdraw(this.accountId, this.amount);

    this.resetAmount();
  }

  private resetAmount() : void {
    this.amount = 0;
  }
}
