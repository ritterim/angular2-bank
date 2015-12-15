export class Account {
  public id: string;
  public balance: number;

  constructor(id: string, initialBalance = 0) {
    if (!id) {
      throw new Error('id must be provided.');
    }

    if (initialBalance < 0) {
      throw new Error('initialBalance must not be negative.');
    }

    if (!this.isInteger(initialBalance)) {
      throw new Error(
        `The amount specified '${initialBalance}' must be an integer ` +
        '(decimals are not supported)');
    }

    this.id = id;
    this.balance = initialBalance;
  }

/* tslint:disable:quotemark max-line-length */
  private isInteger(value: number) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  }
/* tslint: enable */
}
