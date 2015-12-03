/// <reference path="../../src/typings/_custom.d.ts" />

// Import necessary wrappers for Jasmine
import {
  beforeEachProviders,
  describe,
  expect,
  iit,
  inject,
  it,
  injectAsync,
  fakeAsync,
  TestComponentBuilder,
  tick
} from 'angular2/testing';
import { Component, provide} from 'angular2/angular2';
import {MockBackend, BaseRequestOptions, Http} from 'angular2/http';

// Load the implementations that should be tested
import { App } from '../../src/app/app';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    App,
    BaseRequestOptions,
    MockBackend,
    provide(Http, {useFactory:
      function(backend, defaultOptions) {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]})
  ]);
});
