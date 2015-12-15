// Import necessary wrappers for Jasmine
import {
  describe,
  expect,
  it
} from 'angular2/testing';

import {Account} from './account';

describe('constructor', () => {
  it('should throw for missing id', () => {
    expect(() => new Account(undefined))
      .toThrowError('id must be provided.');
  });

  it('should allow an id of \'0\'', () => {
    let accountId = '0';

    let account = new Account(accountId);

    expect(account.id).toEqual(accountId);
  });

  it('should throw for negative initialBalance', () => {
    expect(() => new Account('account-1', -1))
      .toThrowError('initialBalance must not be negative.');
  });

  it('should throw for decimal initialBalance', () => {
    let initialBalance = 123.45;

    expect(() => new Account('account-1', initialBalance))
      .toThrowError(
        `The amount specified '${initialBalance}' must be an integer ` +
        '(decimals are not supported)');
  });

  it('should default balance to zero if initialBalance is not specified', () => {
    let account = new Account('account-1');

    expect(account.balance).toEqual(0);
  });

  it('should set balance if initialBalance is specified', () => {
    let initialBalance = 123;

    let account = new Account('account-1', initialBalance);

    expect(account.balance).toEqual(initialBalance);
  });
});
