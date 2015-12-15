import {
  it,
  inject,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

import {Component, provide} from 'angular2/core';
import {BaseRequestOptions, Http} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';

// Load the implementations that should be tested
import {App} from './app';

describe('Home', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    App,
    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: function(backend, defaultOptions) {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]})
  ]);

  /*it('should have a title', inject([ Home ], (app) => {
    expect(app.title.value).toEqual('Angular 2');
  }));*/

});
