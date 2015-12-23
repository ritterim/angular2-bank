import {
  beforeEachProviders,
  describe,
  expect,
  it
} from 'angular2/testing';

import {AccountOperationsComponent} from './AccountOperationsComponent';
import {Bank} from '../bank';

let accountId = 'account-1';
let amount = 123;

let bank: Bank;
let component: AccountOperationsComponent;

beforeEachProviders(() => {
  Bank.clear();
  bank = new Bank();
  component = new AccountOperationsComponent(bank);
});

describe('openAccount', () => {
  it('should throw for missing accountId', () => {
    component.amount = amount;

    expect(() => component.openAccount())
      .toThrowError('accountId must be provided.');
  });

  it('should throw for missing amount', () => {
    component.accountId = accountId;

    expect(() => component.openAccount())
      .toThrowError('amount must be provided.');
  });

  it('should open account', () => {
    component.accountId = accountId;
    component.amount = amount;
    spyOn(bank, 'openAccount');

    component.openAccount();

    expect(bank.openAccount).toHaveBeenCalledWith(accountId, amount);
  });

  it('should reset amount', () => {
    component.accountId = accountId;
    component.amount = amount;

    component.openAccount();

    expect(component.amount).toEqual(0);
  });
});

describe('closeAccount', () => {
  beforeEachProviders(() => {
    bank.openAccount(accountId);
  });

  it('should throw for missing accountId', () => {
    expect(() => component.closeAccount())
      .toThrowError('accountId must be provided.');
  });

  it('should close account', () => {
    component.accountId = accountId;
    spyOn(bank, 'closeAccount');

    component.closeAccount();

    expect(bank.closeAccount).toHaveBeenCalledWith(accountId);
  });

  it('should reset amount', () => {
    component.accountId = accountId;
    component.amount = amount;

    component.closeAccount();

    expect(component.amount).toEqual(0);
  });
});

describe('deposit', () => {
  beforeEachProviders(() => {
    bank.openAccount(accountId);
  });

  it('should throw for missing accountId', () => {
    component.amount = amount;

    expect(() => component.deposit())
      .toThrowError('accountId must be provided.');
  });

  it('should throw for missing amount', () => {
    component.accountId = accountId;

    expect(() => component.deposit())
      .toThrowError('amount must be provided.');
  });

  it('should perform deposit', () => {
    component.accountId = accountId;
    component.amount = amount;
    spyOn(bank, 'deposit');

    component.deposit();

    expect(bank.deposit).toHaveBeenCalledWith(accountId, amount);
  });

  it('should reset amount', () => {
    component.accountId = accountId;
    component.amount = amount;

    component.deposit();

    expect(component.amount).toEqual(0);
  });
});

describe('withdraw', () => {
  beforeEachProviders(() => {
    bank.openAccount(accountId, amount);
  });

  it('should throw for missing accountId', () => {
    component.amount = amount;

    expect(() => component.withdraw())
      .toThrowError('accountId must be provided.');
  });

  it('should throw for missing amount', () => {
    component.accountId = accountId;

    expect(() => component.withdraw())
      .toThrowError('amount must be provided.');
  });

  it('should perform withdraw', () => {
    component.accountId = accountId;
    component.amount = amount;
    spyOn(bank, 'withdraw');

    component.withdraw();

    expect(bank.withdraw).toHaveBeenCalledWith(accountId, amount);
  });

  it('should reset amount', () => {
    component.accountId = accountId;
    component.amount = amount;

    component.withdraw();

    expect(component.amount).toEqual(0);
  });
});
