import {EventEmitter} from 'angular2/core';
import {Account} from './account';

export class Bank {
  public static accountUpdates: EventEmitter<any> = new EventEmitter();

  private static accounts: Account[] = new Array<Account>();

  public static clear() : void {
    Bank.accounts.length = 0;
  }

  public openAccount(accountId: string, initialBalance = 0) : Bank {
    let account = this.getAccount(accountId, /* errorIfDoesNotExist */ false);

    if (account) {
      throw new Error(`An account with id of '${accountId}' already exists.`);
    }

    if (initialBalance < 0) {
      throw new Error(`The initialBalance of '${initialBalance}' must not be negative.`);
    }

    if (!this.isInteger(initialBalance)) {
      throw new Error(
        `The amount specified '${initialBalance}' must be an integer ` +
        '(decimals are not supported).');
    }

    Bank.accounts.push(new Account(accountId, initialBalance));

    Bank.accountUpdates.emit({
      operation: 'openAccount',
      accountId: accountId,
      initialBalance: initialBalance
    });

    return this;
  }

  public closeAccount(accountId: string) : Bank {
    let account = this.getAccount(accountId);

    if (account.balance !== 0) {
      throw new Error(`The account balance must be zero (it is currently '${account.balance}').`);
    }

    Bank.accounts = Bank.accounts.filter(x => x.id !== accountId);

    Bank.accountUpdates.emit({
      operation: 'closeAccount',
      accountId: accountId
    });

    return this;
  }

  public deposit(accountId: string, amount: number) : Bank {
    let account = this.getAccount(accountId);

    if (!amount && amount !== 0) {
      throw new Error('amount must be specified.');
    }

    if (amount < 0) {
      throw new Error(`The amount specified '${amount}' must not be negative.`);
    }

    if (!this.isInteger(amount)) {
      throw new Error(
        `The amount specified '${amount}' must be an integer ` +
        '(decimals are not supported)');
    }

    account.balance += amount;

    Bank.accountUpdates.emit({
      operation: 'deposit',
      accountId: accountId,
      amount: amount
    });

    return this;
  }

  public withdraw(accountId: string, amount: number) : Bank {
    let account = this.getAccount(accountId);

    if (!amount && amount !== 0) {
      throw new Error('amount must be specified.');
    }

    if (amount < 0) {
      throw new Error(`The amount specified '${amount}' must not be negative.`);
    }

    if (!this.isInteger(amount)) {
      throw new Error(
        `The amount specified '${amount}' must be an integer ` +
        '(decimals are not supported)');
    }

    if (account.balance < amount) {
      throw new Error(
        `The requested withdraw of '${amount}' cannot be completed, ` +
        `there is only '${account.balance}' available in this account.`);
    }

    account.balance -= amount;

    Bank.accountUpdates.emit({
      operation: 'withdraw',
      accountId: accountId,
      amount: amount
    });

    return this;
  }

  public transfer(fromAccountId: string, toAccountId: string, amount: number) : Bank {
    let fromAccount = this.getAccount(fromAccountId);
    let toAccount = this.getAccount(toAccountId);

    if (fromAccountId === toAccountId) {
      throw new Error('fromAccountId and toAccountId must not be the same account.');
    }

    if (!amount && amount !== 0) {
      throw new Error('amount must be specified.');
    }

    if (amount < 0) {
      throw new Error(`The amount specified '${amount}' must not be negative.`);
    }

    if (!this.isInteger(amount)) {
      throw new Error(
        `The amount specified '${amount}' must be an integer ` +
        '(decimals are not supported)');
    }

    if (fromAccount.balance < amount) {
      throw new Error(
        `The requested withdraw of '${amount}' cannot be completed, ` +
        `there is only '${fromAccount.balance}' available in account '${fromAccountId}'.`);
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    Bank.accountUpdates.emit({
      operation: 'transfer',
      fromAccountId: fromAccountId,
      toAccountId: toAccountId,
      amount: amount
    });

    return this;
  }

  public getBalance(accountId: string) : number {
    let account = this.getAccount(accountId);

    return account.balance;
  }

  public getAllAccounts() : Account[] {
    return Bank.accounts;
  }

  public getTotalBankCurrency() : number {
    return Bank.accounts.map(x => x.balance).reduce((x, y) => x + y);
  }

  private getAccount(accountId: string, errorIfDoesNotExist = true) : Account {
    let matchedAccounts = Bank.accounts.filter(x => x.id === accountId);

    if (matchedAccounts.length === 0) {
      if (errorIfDoesNotExist) {
        throw new Error(`There was no account with id of '${accountId}'.`);
      }

      return null;
    }

    if (matchedAccounts.length > 1) {
      throw new Error(`There is more than one account with an id of '${accountId}'.`);
    }

    return matchedAccounts[0];
  }

/* tslint:disable:quotemark max-line-length */
  private isInteger(value: number) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  }
/* tslint:enable */
}
