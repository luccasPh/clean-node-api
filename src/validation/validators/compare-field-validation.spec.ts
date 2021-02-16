import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldValidation } from './compare-field-validation'

describe('CompareField Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = new CompareFieldValidation('field', 'fieldToCompare')
    const error = sut.validate({
      field: 'field',
      fieldToCompareName: 'fieldToCompare'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = new CompareFieldValidation('field', 'field')
    const error = sut.validate({ field: 'field', fieldToCompareName: 'field' })
    expect(error).toBeFalsy()
  })
})
