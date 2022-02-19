export class ErrorReport extends Error {
  public errorTitle: string
  public errorMessage: string

  constructor(messageTitleForUser: string, messageForUser: string) {
    super(messageForUser)
    this.name = 'ErrorReport'
    this.errorTitle = messageTitleForUser
    this.errorMessage = messageTitleForUser
  }
}
