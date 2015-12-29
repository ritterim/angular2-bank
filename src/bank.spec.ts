// Import necessary wrappers for Jasmine
import {
  beforeEachProviders,
  describe,
  expect,
  it
} from 'angular2/testing';

import {Bank} from './bank';

let bank: Bank;
let accountId = 'account-1';

describe('clear', () => {
  beforeEachProviders(() => {
    Bank.clear();
    bank = new Bank().openAccount(accountId);
  });

  it('should clear all accounts', () => {
     Bank.clear();

     expect(bank.getAllAccounts().length).toEqual(0);
  });
});

describe('openAccount', () => {
  beforeEachProviders(() => {
    Bank.clear();
    bank = new Bank().openAccount(accountId);
  });

  it('should error if account already exists', () => {
    expect(() => bank.openAccount(accountId, 0))
      .toThrowError(`An account with id of \'${accountId}\' already exists.`);
  });

  it('should error if initialBalance is negative', () => {
    expect(() => bank.openAccount('new-account', -1))
      .toThrowError('The initialBalance of \'-1\' must not be negative.');
  });

  it('should error if initialBalance is a decimal number', () => {
    let initialBalance = 123.45;

    expect(() => bank.openAccount('new-account', initialBalance))
      .toThrowError(
        `The amount specified '${initialBalance}' must be an integer ` +
        '(decimals are not supported).');
  });

  it('should open account with correct balance', () => {
    let initialBalance = 123;
    bank.openAccount('account-2', initialBalance);

    let account2 = bank.getAllAccounts()[1];

    expect(account2.id).toEqual('account-2');
    expect(account2.balance).toEqual(initialBalance);
  });

  it('should emit to accountUpdates', () => {
     spyOn(Bank.accountUpdates, 'emit');

     bank.openAccount('account-2');

     expect(Bank.accountUpdates.emit).toHaveBeenCalledWith({
       operation: 'openAccount',
       accountId: 'account-2',
       initialBalance: 0
    });
  });
});

describe('closeAccount', () => {
  beforeEachProviders(() => {
    Bank.clear();
    bank = new Bank().openAccount(accountId);
  });

  it('should error if account does not exist', () => {
    let accountIdDoesNotExist = 'does-not-exist';

    expect(() => bank.closeAccount(accountIdDoesNotExist))
      .toThrowError(`There was no account with id of '${accountIdDoesNotExist}'.`);
  });

  it('should error if account balance is not zero', () => {
    let deposit = 123;
    bank.deposit(accountId, deposit);

    expect(() => bank.closeAccount(accountId))
      .toThrowError(`The account balance must be zero (it is currently \'${deposit}\').`);
  });

  it('should remove the account from the list of accounts', () => {
    bank.closeAccount(accountId);

    expect(bank.getAllAccounts().length).toEqual(0);
  });

  it('should emit to accountUpdates', () => {
     spyOn(Bank.accountUpdates, 'emit');

     bank.closeAccount(accountId);

     expect(Bank.accountUpdates.emit).toHaveBeenCalledWith({
       operation: 'closeAccount',
       accountId: accountId
    });
  });
});

describe('deposit', () => {
  beforeEachProviders(() => {
    Bank.clear();
    bank = new Bank().openAccount(accountId);
  });

  it('should error if account does not exist', () => {
    let accountIdDoesNotExist = 'does-not-exist';

    expect(() => bank.deposit(accountIdDoesNotExist, 0))
      .toThrowError(`There was no account with id of '${accountIdDoesNotExist}'.`);
  });

  it('should error for missing amount', () => {
    expect(() => bank.deposit(accountId, undefined))
      .toThrowError('amount must be specified.');
  });

  it('should error for negative amount', () => {
    let amount = -1;

    expect(() => bank.deposit(accountId, amount))
      .toThrowError(`The amount specified '${amount}' must not be negative.`);
  });

  it('should error for decimal amount', () => {
    let amount = 123.45;

    expect(() => bank.deposit(accountId, amount))
      .toThrowError(
        `The amount specified '${amount}' must be an integer ` +
        '(decimals are not supported)');
  });

  it('should keep same balance for zero amount', () => {
    let startingBalance = bank.getBalance(accountId);

    bank.deposit(accountId, 0);

    expect(bank.getBalance(accountId)).toEqual(startingBalance);
  });

  it('should add amount to account balance', () => {
    let amount = 123;
    let startingBalance = bank.getBalance(accountId);

    bank.deposit(accountId, amount);

    expect(bank.getBalance(accountId)).toEqual(startingBalance + amount);
  });

  it('should emit to accountUpdates', () => {
     let amount = 123;
     spyOn(Bank.accountUpdates, 'emit');

     bank.deposit(accountId, amount);

     expect(Bank.accountUpdates.emit).toHaveBeenCalledWith({
       operation: 'deposit',
       accountId: accountId,
       amount: amount
    });
  });
});

describe('withdraw', () => {
  beforeEachProviders(() => {
    Bank.clear();
    bank = new Bank().openAccount(accountId);
  });

  it('should error if account does not exist', () => {
    let accountIdDoesNotExist = 'does-not-exist';

    expect(() => bank.withdraw(accountIdDoesNotExist, 0))
      .toThrowError(`There was no account with id of '${accountIdDoesNotExist}'.`);
  });

  it('should error for missing amount', () => {
    expect(() => bank.withdraw(accountId, undefined))
      .toThrowError('amount must be specified.');
  });

  it('should error for negative amount', () => {
    let amount = -1;

    expect(() => bank.withdraw(accountId, amount))
      .toThrowError(`The amount specified '${amount}' must not be negative.`);
  });

  it('should error for decimal amount', () => {
    let amount = 123.45;

    expect(() => bank.withdraw(accountId, amount))
      .toThrowError(
        `The amount specified '${amount}' must be an integer ` +
        '(decimals are not supported)');
  });

  it('should error if insufficient funds', () => {
    let amount = 1;
    let startingBalance = bank.getBalance(accountId);

    expect(() => bank.withdraw(accountId, startingBalance + amount))
      .toThrowError(
        `The requested withdraw of '${amount}' cannot be completed, ` +
        `there is only '${startingBalance}' available in this account.`);
  });

  it('should keep same balance for zero amount', () => {
    let startingBalance = bank.getBalance(accountId);

    bank.withdraw(accountId, 0);

    expect(bank.getBalance(accountId)).toEqual(startingBalance);
  });

  it('should deduct amount from account balance', () => {
    let amount = 123;
    let startingBalance = bank.getBalance(accountId);
    bank.deposit(accountId, amount);

    bank.withdraw(accountId, amount);

    expect(bank.getBalance(accountId)).toEqual(startingBalance);
  });

  it('should emit to accountUpdates', () => {
     let amount = 123;
     bank.deposit(accountId, amount);
     spyOn(Bank.accountUpdates, 'emit');

     bank.withdraw(accountId, amount);

     expect(Bank.accountUpdates.emit).toHaveBeenCalledWith({
       operation: 'withdraw',
       accountId: accountId,
       amount: amount
    });
  });
});

describe('transfer', () => {
  let account2Id = 'account-2';

  beforeEachProviders(() => {
    Bank.clear();
    bank = new Bank().openAccount(accountId);

    bank.openAccount(account2Id, 0);
  });

  it('should error if \'from\' account does not exist', () => {
    let accountIdDoesNotExist = 'does-not-exist';

    expect(() => bank.transfer(accountIdDoesNotExist, account2Id, 0))
      .toThrowError(`There was no account with id of '${accountIdDoesNotExist}'.`);
  });

  it('should error if \'to\' account does not exist', () => {
    let accountIdDoesNotExist = 'does-not-exist';

    expect(() => bank.transfer(accountId, accountIdDoesNotExist, 0))
      .toThrowError(`There was no account with id of '${accountIdDoesNotExist}'.`);
  });

  it('should error if \'from\' account and \'to\' account are the same account', () => {
    expect(() => bank.transfer(accountId, accountId, 123))
      .toThrowError('fromAccountId and toAccountId must not be the same account.');
  });

  it('should error for missing amount', () => {
    expect(() => bank.transfer(accountId, account2Id, undefined))
      .toThrowError('amount must be specified.');
  });

  it('should error for negative amount', () => {
    let amount = -1;

    expect(() => bank.transfer(accountId, account2Id, amount))
      .toThrowError(`The amount specified '${amount}' must not be negative.`);
  });

  it('should error for decimal amount', () => {
    let amount = 123.45;

    expect(() => bank.transfer(accountId, account2Id, amount))
      .toThrowError(
        `The amount specified '${amount}' must be an integer ` +
        '(decimals are not supported)');
  });

  it('should error if insufficient funds', () => {
    let amount = 123;

    let fromBalance = bank.getBalance(accountId);

    expect(() => bank.transfer(accountId, account2Id, amount))
      .toThrowError(
        `The requested withdraw of '${amount}' cannot be completed, ` +
        `there is only '${fromBalance}' available in account '${accountId}'.`);
  });

  it('should keep same \'from\' balance for zero amount', () => {
    let fromStartingBalance = bank.getBalance(accountId);

    bank.transfer(accountId, account2Id, 0);

    expect(bank.getBalance(accountId)).toEqual(fromStartingBalance);
  });

  it('should keep same \'to\' balance for zero amount', () => {
    let toStartingBalance = bank.getBalance(account2Id);

    bank.transfer(accountId, account2Id, 0);

    expect(bank.getBalance(account2Id)).toEqual(toStartingBalance);
  });

  it('should deduct amount from \'from\' account', () => {
    let amount = 123;
    bank.deposit(accountId, amount);

    bank.transfer(accountId, account2Id, amount);

    expect(bank.getBalance(accountId)).toEqual(0);
  });

  it('should add amount to \'to\' account', () => {
    let amount = 123;
    bank.deposit(accountId, amount);

    bank.transfer(accountId, account2Id, amount);

    expect(bank.getBalance(account2Id)).toEqual(amount);
  });

  it('should emit to accountUpdates', () => {
     let amount = 123;
     bank.deposit(accountId, amount);
     spyOn(Bank.accountUpdates, 'emit');

     bank.transfer(accountId, account2Id, amount);

     expect(Bank.accountUpdates.emit).toHaveBeenCalledWith({
       operation: 'transfer',
       fromAccountId: accountId,
       toAccountId: account2Id,
       amount: amount
    });
  });
});

describe('getBalance', () => {
  beforeEachProviders(() => {
    Bank.clear();
    bank = new Bank().openAccount(accountId);
  });

  it('should error if account does not exist', () => {
    let accountIdDoesNotExist = 'does-not-exist';

    expect(() => bank.getBalance(accountIdDoesNotExist))
      .toThrowError(`There was no account with id of '${accountIdDoesNotExist}'.`);
  });

  it('should return expected balance', () => {
    let amount = 123;
    bank.deposit(accountId, amount);

    expect(bank.getBalance(accountId)).toEqual(amount);
  });
});

describe('getAllAccounts', () => {
  beforeEachProviders(() => {
    Bank.clear();
    bank = new Bank().openAccount(accountId);
  });

  it('should return the complete collection of accounts', () => {
    bank.openAccount('account-2', 0);

    expect(bank.getAllAccounts().length).toEqual(2);
  });
});

describe('getTotalBankCurrency', () => {
  beforeEachProviders(() => {
    Bank.clear();
    bank = new Bank().openAccount(accountId);
  });

  it('should return a total of all bank held currency', () => {
    let amount1 = 123;
    let amount2 = 234;

    bank.deposit(accountId, amount1);
    bank.openAccount('account-2', amount2);

    expect(bank.getTotalBankCurrency()).toEqual(amount1 + amount2);
  });
});
