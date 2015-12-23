import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';

import {Bank} from '../bank';
import {AccountOperationsComponent} from '../components/AccountOperationsComponent';
import {ShowBalancesComponent} from '../components/ShowBalancesComponent';

@Component({
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    AccountOperationsComponent,
    ShowBalancesComponent
  ],
  pipes: [],
  providers: [ Bank ],
  selector: 'app',
  styles: [ require('./app.css') ],
  template: require('./app.html')
})
export class App {
  ngOnInit() {
    console.log('hello App');
  }
}
