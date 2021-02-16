export class EmailInUseError extends Error {
  constructor () {
    super('The received emil is already in use')
    this.name = 'EmailInUseError'
  }
}
