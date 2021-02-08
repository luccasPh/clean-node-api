import { MissingParamError } from '../errors/missing-param-erros'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: MissingParamError): HttpResponse => ({
  statusCode: 400,
  body: error

})
