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
  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 200px;">
    <input
      class="mdl-textfield__input"
      [(ngModel)]="accountId"
      type="text"
      id="accountId">
    <label class="mdl-textfield__label" for="accountId">AccountId...</label>
  </div>

  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 125px;">
    <input
      class="mdl-textfield__input"
      [(ngModel)]="amount"
      type="number"
      pattern="[0-9]*"
      id="amount">
    <label class="mdl-textfield__label" for="amount">Amount...</label>
    <span class="mdl-textfield__error">Amount must be a whole number.</span>
  </div>

  <br />

  <button style="width: 150px;"
    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
    (click)="openAccount()"
    [disabled]="openAccountProhibited">
      Open Account
  </button>

  <button style="width: 150px;"
    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
    (click)="closeAccount()"
    [disabled]="closeAccountProhibited">
      Close Account
  </button>

  <br />
  <br />

  <button style="width: 150px;"
    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
    (click)="deposit()"
    [disabled]="depositProhibited">
      Deposit
  </button>

  <button style="width: 150px;"
    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
    (click)="withdraw()"
    [disabled]="withdrawProhibited">
      Withdraw
  </button>

  <hr />

  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <input
      class="mdl-textfield__input"
      [(ngModel)]="transferToAccountId"
      type="text"
      id="transferToAccountId"
    />
    <label class="mdl-textfield__label" for="transferToAccountId">Account Id...</label>
  </div>

  <button
    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
    (click)="transfer()"
    [disabled]="transferProhibited">
      Transfer
  </button>
  `
})
// TODO: Surface any errors to the user
export class AccountOperationsComponent {
  public accountId: string;
  public amount: number;
  public transferToAccountId: string;

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

  public get transferProhibited() {
    if (!this.accountId) {
      return true;
    }

    if (this.amount < 0) {
      return true;
    }

    if (!this.transferToAccountId) {
      return true;
    }

    if (this.accountId === this.transferToAccountId) {
      return true;
    }

    let existingAccounts = this._bank
      .getAllAccounts()
      .filter(x => x.id === this.accountId);

    if (existingAccounts.length === 0) {
      return true;
    }

    let existingAccount = existingAccounts[0];

    if (existingAccount.balance < this.amount) {
      return true;
    }

    let anyExistingTransferToAccount = this._bank
      .getAllAccounts()
      .some(x => x.id === this.transferToAccountId);

    return !anyExistingTransferToAccount;
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

  public transfer() : void {
    if (!this.accountId) {
      throw new Error('accountId must be provided.');
    }

    if (!this.amount) {
      throw new Error('amount must be provided.');
    }

    if (!this.transferToAccountId) {
      throw new Error('transferToAccountId must be provided.');
    }

    this._bank.transfer(this.accountId, this.transferToAccountId, this.amount);

    this.resetAmount();
    this.transferToAccountId = null;
  }

  private resetAmount() : void {
    this.amount = undefined;
  }
}
