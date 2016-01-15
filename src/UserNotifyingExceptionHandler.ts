import { ExceptionHandler } from 'angular2/core';
import { print } from 'angular2/src/facade/lang';
let alert = require('alerts');

export class UserNotifyingExceptionHandler extends ExceptionHandler {
  private alertTimeout = 5000;
  private transitionTime = 200; // Matches the css transition time

  constructor() {
    super(new PrintLogger(), /* _rethrowException: */ true);
  }

  call(error, stackTrace = null, reason = null) {
    let splitErrorMessage = error.message.split('\n');
    let errorMessageToDisplay = `${splitErrorMessage[0]}<br />${splitErrorMessage[1]}`;

    alert(errorMessageToDisplay, {
      timeout: this.alertTimeout,
      transitionTime: this.transitionTime
    });

    // Call the parent behavior (remove in production?)
    super.call(error, stackTrace, reason);
  }
}

/* tslint:disable:max-line-length no-empty */
// https://github.com/angular/angular/blob/7ae23adaff2990cf6022af9792c449730d451d1d/modules/angular2/src/platform/worker_app_common.ts#L28-L33
class PrintLogger {
  log = print;
  logError = print;
  logGroup = print;
  logGroupEnd() {}
}
/* tslint:enable */
