import { Component } from 'angular2/core';
import { FORM_DIRECTIVES } from 'angular2/common';

import {Account} from '../account';
import {Bank} from '../bank';

@Component({
  directives: [ FORM_DIRECTIVES ],
  providers: [ Bank ],
  selector: 'account-operations',
  styles: [`
  .bank-textfield--account-id-label {
    width: 200px;
  }
  .bank-textfield--amount-label {
    width: 125px;
  }
  .bank-button {
    width: 150px;
  }
  `],
  template: require('./AccountOperationsComponent.html')
})
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

    if (!this.amount || this.amount < 0) {
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

    if (!this.amount || this.amount < 0) {
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

    if (!this.amount || this.amount < 0) {
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
