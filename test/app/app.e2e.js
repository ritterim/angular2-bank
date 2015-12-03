/// <reference path="../../typings/_custom.d.ts" />

 /*
  * TODO: ES5 for now until I make a webpack plugin for protractor
  */
describe('App', function() {

  beforeEach(function() {
    browser.get('/');
  });


  it('should have a title', function() {
    var subject = browser.getTitle();
    var result  = 'Angular2 Bank';
    expect(subject).toEqual(result);
  });

  it('should have <header>', function() {
    var subject = element(by.deepCss('app /deep/ header')).isPresent();
    var result  = true;
    expect(subject).toEqual(result);
  });

  it('should have <main>', function() {
    var subject = element(by.deepCss('app /deep/ main')).isPresent();
    var result  = true;
    expect(subject).toEqual(result);
  });

  it('should have <footer>', function() {
    var subject = element(by.deepCss('app /deep/ footer')).getText();
    var result  = 'An example Angular2 application built by Ritter Insurance Marketing.';
    expect(subject).toEqual(result);
  });

});
