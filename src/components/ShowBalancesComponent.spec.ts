import {
  beforeEachProviders,
  describe,
  expect,
  injectAsync,
  it,
  TestComponentBuilder
} from 'angular2/testing';

import {Account} from '../account';
import {Bank} from '../bank';
import {ShowBalancesComponent} from './ShowBalancesComponent';

beforeEachProviders(() => {
   Bank.clear();
});

describe('ShowBalancesComponent', () => {
  it('should be empty to start', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(ShowBalancesComponent).then((fixture) => {
      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let tbody = compiled.getElementsByTagName('tbody')[0];
      let rows = tbody.getElementsByTagName('tr');

      expect(rows.length).toEqual(0);
    });
  }));

  it('should show Id column', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(ShowBalancesComponent).then((fixture) => {
      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let thead = compiled.getElementsByTagName('thead')[0];
      let th = thead.getElementsByTagName('th')[0];

      expect(th.innerHTML).toEqual('Id');
    });
  }));

  it('should show Balance column', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(ShowBalancesComponent).then((fixture) => {
      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let thead = compiled.getElementsByTagName('thead')[0];
      let th = thead.getElementsByTagName('th')[1];

      expect(th.innerHTML).toEqual('Balance');
    });
  }));

  it('should show expected number of accounts', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(ShowBalancesComponent).then((fixture) => {
      fixture.detectChanges();

      fixture.debugElement.componentInstance._bank.openAccount('account-1', 0);
      fixture.debugElement.componentInstance._bank.openAccount('account-2', 0);

      fixture.debugElement.componentInstance.refreshAccounts();

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let tbody = compiled.getElementsByTagName('tbody')[0];
      let trTags = tbody.getElementsByTagName('tr');

      expect(trTags.length).toEqual(2);
    });
  }));

  it('should show accountId', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(ShowBalancesComponent).then((fixture) => {
      fixture.detectChanges();

      fixture.debugElement.componentInstance._bank.openAccount('account-1', 0);

      fixture.debugElement.componentInstance.refreshAccounts();

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let tbody = compiled.getElementsByTagName('tbody')[0];
      let trTags = tbody.getElementsByTagName('tr');
      let tdTags = trTags[0].getElementsByTagName('td');

      expect(tdTags[0].innerHTML).toEqual('account-1');
    });
  }));

  it('should show balance', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(ShowBalancesComponent).then((fixture) => {
      fixture.detectChanges();

      fixture.debugElement.componentInstance._bank.openAccount('account-1', 123);

      fixture.debugElement.componentInstance.refreshAccounts();

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let tbody = compiled.getElementsByTagName('tbody')[0];
      let trTags = tbody.getElementsByTagName('tr');
      let tdTags = trTags[0].getElementsByTagName('td');

      expect(tdTags[1].innerHTML).toEqual('123');
    });
  }));

  describe('isZeroBalance', () => {
    it('should return true for zero value', () => {
      let bank = new Bank();
      let component = new ShowBalancesComponent(bank);

      let result = component.isZeroBalance(new Account('account-1', 0))

      expect(result).toEqual(true);
    });

    it('should return false for positive value', () => {
      let bank = new Bank();
      let component = new ShowBalancesComponent(bank);

      let result = component.isZeroBalance(new Account('account-1', 123))

      expect(result).toEqual(false);
    });
  });

  describe('refreshAccounts', () => {
    it('should refresh accounts', () => {
      let bank = new Bank();
      let component = new ShowBalancesComponent(bank);

      bank.openAccount('account-1');

      component.refreshAccounts();

      expect(component.accounts.length).toEqual(1);
    });
  });
});
