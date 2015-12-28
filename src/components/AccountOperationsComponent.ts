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
  <button (click)="openAccount()" [disabled]="openAccountProhibited">Open Account</button>
  <button (click)="closeAccount()" [disabled]="closeAccountProhibited">Close Account</button>
  <button (click)="deposit()" [disabled]="depositProhibited">Deposit</button>
  <button (click)="withdraw()" [disabled]="withdrawProhibited">Withdraw</button>
  `
})
// TODO: Surface any errors to the user
export class AccountOperationsComponent {
  public accountId: string;
  public amount: number = 0;

  public get openAccountProhibited() {
    if (!this.accountId) {
      return true;
    }

    let anyExistingAccount = this._bank
      .getAllAccounts()
      .some(x => x.id === this.accountId);

    return anyExistingAccount;
  };

  public get closeAccountProhibited() {
    if (!this.accountId) {
      return true;
    }

    let anyExistingZeroBalanceAccount = this._bank
      .getAllAccounts()
      .some(x => x.id === this.accountId && x.balance === 0);

    return !anyExistingZeroBalanceAccount;
  };

  public get depositProhibited() {
    if (!this.accountId) {
      return true;
    }

    if (this.amount < 0) {
      return true;
    }

    let anyExistingAccount = this._bank
      .getAllAccounts()
      .some(x => x.id === this.accountId);

    return !anyExistingAccount;
  };

  public get withdrawProhibited() {
    if (!this.accountId) {
      return true;
    }

    if (this.amount < 0) {
      return true;
    }

    let existingAccounts = this._bank
      .getAllAccounts()
      .filter(x => x.id === this.accountId);

    if (existingAccounts.length === 0) {
      return true;
    }

    let existingAccount = existingAccounts[0];

    return existingAccount.balance < this.amount;
  };

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
