import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepositoryS: LogErrorRepository

  constructor (controller: Controller, logErrorRepositoryS: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepositoryS = logErrorRepositoryS
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    // eslint-disable-next-line no-empty
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepositoryS.log(httpResponse.body.stack)
    }
    return httpResponse
  }
}
