import {
  describe,
  it,
  inject,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

import {Component, provide} from 'angular2/core';
import {BaseRequestOptions, Http} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';

import {Bank} from '../bank';

// Load the implementations that should be tested
import {App} from './app';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    App,
    Bank,
    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: function(backend, defaultOptions) {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]})
  ]);

  it('should log ngOnInit', inject([ App ], (app) => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    app.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  }));

  it('should create initial accounts', inject([ App ], (app) => {
    spyOn(app.bank, 'openAccount');
    expect(app.bank.openAccount).not.toHaveBeenCalled();

    app.ngAfterViewInit();

    expect(app.bank.openAccount).toHaveBeenCalledWith('account-1', 123);
    expect(app.bank.openAccount).toHaveBeenCalledWith('account-2', 234);
    expect(app.bank.openAccount.calls.count()).toEqual(2);
  }));
});
