/* tslint:disable:no-unused-variable */
/*
 * Angular 2 decorators and services
 */
import {Directive, Component, View, ElementRef} from 'angular2/angular2';
import {RouteConfig, Router} from 'angular2/router';
import {Http, Headers} from 'angular2/http';
/* tslint:enable */

/*
 * Angular Directives
 */
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

/*
 * App Component
 * Top Level Component
 */
@Component({
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES ],
  selector: 'app',
  styles: [`
    .title {
      font-family: Arial, Helvetica, sans-serif;
    }
    main {
      padding: 1em;
    }
  `],
  template: `
  <header>
    <h1 class="title">Angular2 Bank</h1>
  </header>

  <main>
  </main>

  <footer>
    An example Angular2 application built by <a href="https://www.ritterim.com">Ritter Insurance Marketing</a>.
  </footer>
  `
})
export class App {
}
