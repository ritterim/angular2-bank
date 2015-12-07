import Account from './account'

export default class Bank {
  private accounts: Account[]

  constructor(accounts: Account[] = []) {
    this.accounts = accounts
  }

  openAccount(accountId: string, initialBalance: number = 0) : Bank {
    let account = this.getAccount(accountId, /* errorIfDoesNotExist */ false)

    if (account) {
      throw new Error(`An account with id of '${accountId}' already exists.`)
    }

    if (initialBalance < 0) {
      throw new Error(`The initialBalance of '${initialBalance}' must not be negative.`)
    }

    if (!this.isInteger(initialBalance)) {
      throw new Error(`The amount specified '${initialBalance}' must be an integer (decimals are not supported)`)
    }

    this.accounts.push(new Account(accountId, initialBalance))

    return this
  }

  closeAccount(accountId: string) : Bank {
    let account = this.getAccount(accountId)

    if (account.balance !== 0) {
      throw new Error(`The account balance must be zero (it is currently '${account.balance}').`)
    }

    this.accounts = this.accounts.filter(x => x.id !== accountId)

    return this
  }

  deposit(accountId: string, amount: number) : Bank {
    let account = this.getAccount(accountId)

    if (!amount && amount !== 0) {
      throw new Error('amount must be specified.')
    }

    if (amount < 0) {
      throw new Error(`The amount specified '${amount}' must not be negative.`)
    }

    if (!this.isInteger(amount)) {
      throw new Error(`The amount specified '${amount}' must be an integer (decimals are not supported)`)
    }

    account.balance += amount

    return this
  }

  withdrawal(accountId: string, amount: number) : Bank {
    let account = this.getAccount(accountId)

    if (!amount && amount !== 0) {
      throw new Error('amount must be specified.')
    }

    if (amount < 0) {
      throw new Error(`The amount specified '${amount}' must not be negative.`)
    }

    if (!this.isInteger(amount)) {
      throw new Error(`The amount specified '${amount}' must be an integer (decimals are not supported)`)
    }

    if (account.balance < amount) {
      throw new Error(`The requested withdrawal of '${amount}' cannot be completed, there is only '${account.balance}' available in this account.`)
    }

    account.balance -= amount

    return this
  }

  transfer(fromAccountId: string, toAccountId: string, amount: number) : Bank {
    let fromAccount = this.getAccount(fromAccountId)
    let toAccount = this.getAccount(toAccountId)

    if (!amount && amount !== 0) {
      throw new Error('amount must be specified.')
    }

    if (amount < 0) {
      throw new Error(`The amount specified '${amount}' must not be negative.`)
    }

    if (!this.isInteger(amount)) {
      throw new Error(`The amount specified '${amount}' must be an integer (decimals are not supported)`)
    }

    if (fromAccount.balance < amount) {
      throw new Error(`The requested withdrawal of '${amount}' cannot be completed, there is only '${fromAccount.balance}' available in account '${fromAccountId}'.`)
    }

    fromAccount.balance -= amount
    toAccount.balance += amount

    return this
  }

  getBalance(accountId: string) : number {
    let account = this.getAccount(accountId)

    return account.balance
  }

  getAllAccounts() : Account[] {
    return this.accounts
  }

  getTotalBankCurrency() : number {
    return this.accounts.map(x => x.balance).reduce((x, y) => x + y)
  }

  private getAccount(accountId: string, errorIfDoesNotExist: boolean = true) : Account {
    let matchedAccounts = this.accounts.filter(x => x.id === accountId)

    if (matchedAccounts.length === 0) {
      if (errorIfDoesNotExist) {
        throw new Error(`There was no account with id of '${accountId}'.`)
      }
      else {
        return null
      }
    }

    if (matchedAccounts.length > 1) {
      throw new Error(`There is more than one account with an id of '${accountId}'.`)
    }

    return matchedAccounts[0]
  }

  private isInteger(value: number) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value
  }
}