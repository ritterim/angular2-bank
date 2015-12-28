import {
  beforeEachProviders,
  describe,
  expect,
  injectAsync,
  it,
  TestComponentBuilder
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

function getButton(compiled: any, innerText: string) : HTMLButtonElement {
  // http://stackoverflow.com/a/222847
  var buttons = [].slice.call(compiled.querySelectorAll('button'))
    .filter(x => x.innerText === innerText);

  if (buttons.length === 0) {
    throw new Error(`No buttons were found with innerText: '${innerText}'.`);
  }

  if (buttons.length > 1) {
    throw new Error(
      `More than one button (${buttons.length}) was found with innerText: '${innerText}'.`);
  }

  return buttons[0];
};

describe('Open Account button', () => {
  it('should be disabled when accountId is not provided', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;

      let openAccountButton = getButton(compiled, 'Open Account');

      expect(openAccountButton.hasAttribute('disabled')).toEqual(true);
    });
  }));

  it('should be disabled if accountId already exists', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let component = fixture.debugElement.componentInstance;
      component._bank.openAccount(accountId);
      component.accountId = accountId;

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let openAccountButton = getButton(compiled, 'Open Account');

      expect(openAccountButton.hasAttribute('disabled')).toEqual(true);
    });
  }));

  it('should be enabled when conditions satisfied', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let component = fixture.debugElement.componentInstance;
      component._bank.openAccount(accountId);
      component.accountId = 'account-2';

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let openAccountButton = getButton(compiled, 'Open Account');

      expect(openAccountButton.hasAttribute('disabled')).toEqual(false);
    });
  }));
});

describe('Close Account button', () => {
  it('should be disabled when accountId is not provided', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;

      let closeAccountButton = getButton(compiled, 'Close Account');

      expect(closeAccountButton.hasAttribute('disabled')).toEqual(true);
    });
  }));

  it('should be disabled if accountId does not exist', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let component = fixture.debugElement.componentInstance;
      component.accountId = accountId;

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let closeAccountButton = getButton(compiled, 'Close Account');

      expect(closeAccountButton.hasAttribute('disabled')).toEqual(true);
    });
  }));

  it('should be disabled if accountId does not have a zero balance', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let component = fixture.debugElement.componentInstance;
      component._bank.openAccount(accountId, 123);
      component.accountId = accountId;

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let closeAccountButton = getButton(compiled, 'Close Account');

      expect(closeAccountButton.hasAttribute('disabled')).toEqual(true);
    });
  }));

  it('should be enabled when conditions satisfied', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let component = fixture.debugElement.componentInstance;
      component._bank.openAccount(accountId);
      component.accountId = accountId;

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let closeAccountButton = getButton(compiled, 'Close Account');

      expect(closeAccountButton.hasAttribute('disabled')).toEqual(false);
    });
  }));
});

describe('Deposit button', () => {
  it('should be disabled when accountId is not provided', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;

      let depositButton = getButton(compiled, 'Deposit');

      expect(depositButton.hasAttribute('disabled')).toEqual(true);
    });
  }));

  it('should be disabled if amount is negative', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let component = fixture.debugElement.componentInstance;
      component._bank.openAccount(accountId);
      component.accountId = accountId;
      component.amount = -1;

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let depositButton = getButton(compiled, 'Deposit');

      expect(depositButton.hasAttribute('disabled')).toEqual(true);
    });
  }));

  it('should be disabled if accountId does not exist', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let component = fixture.debugElement.componentInstance;
      component.accountId = accountId;
      component.amount = 1;

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let depositButton = getButton(compiled, 'Deposit');

      expect(depositButton.hasAttribute('disabled')).toEqual(true);
    });
  }));

  it('should be enabled when conditions satisfied', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let component = fixture.debugElement.componentInstance;
      component._bank.openAccount(accountId);
      component.accountId = accountId;
      component.amount = 1;

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let depositButton = getButton(compiled, 'Deposit');

      expect(depositButton.hasAttribute('disabled')).toEqual(false);
    });
  }));
});

describe('Withdraw button', () => {
  it('should be disabled when accountId is not provided', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;

      let withdrawButton = getButton(compiled, 'Withdraw');

      expect(withdrawButton.hasAttribute('disabled')).toEqual(true);
    });
  }));

  it('should be disabled if accountId does not exist', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let component = fixture.debugElement.componentInstance;
      component.accountId = accountId;
      component.amount = 1;

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let withdrawButton = getButton(compiled, 'Withdraw');

      expect(withdrawButton.hasAttribute('disabled')).toEqual(true);
    });
  }));

  it('should be disabled if amount is negative', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let component = fixture.debugElement.componentInstance;
      component._bank.openAccount(accountId, 1);
      component.accountId = accountId;
      component.amount = -1;

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let withdrawButton = getButton(compiled, 'Withdraw');

      expect(withdrawButton.hasAttribute('disabled')).toEqual(true);
    });
  }));

  it('should be disabled if account does not have enough funds to complete withdraw', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let component = fixture.debugElement.componentInstance;
      component._bank.openAccount(accountId);
      component.accountId = accountId;
      component.amount = 1;

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let withdrawButton = getButton(compiled, 'Withdraw');

      expect(withdrawButton.hasAttribute('disabled')).toEqual(true);
    });
  }));

  it('should be enabled when conditions satisfied', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(AccountOperationsComponent).then((fixture) => {
      fixture.detectChanges();

      let component = fixture.debugElement.componentInstance;
      component._bank.openAccount(accountId, 1);
      component.accountId = accountId;
      component.amount = 1;

      fixture.detectChanges();

      let compiled = fixture.debugElement.nativeElement;
      let withdrawButton = getButton(compiled, 'Withdraw');

      expect(withdrawButton.hasAttribute('disabled')).toEqual(false);
    });
  }));
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
