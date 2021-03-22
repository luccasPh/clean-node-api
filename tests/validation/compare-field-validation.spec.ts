import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldValidation } from '@/validation/validators'

describe('CompareField Validation', () => {
  test('Should return a InvalidParamError if validation fails', async () => {
    const sut = new CompareFieldValidation('field', 'fieldToCompare')
    const error = await sut.validate({
      field: 'field',
      fieldToCompareName: 'fieldToCompare'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', async () => {
    const sut = new CompareFieldValidation('field', 'field')
    const error = await sut.validate({ field: 'field', fieldToCompareName: 'field' })
    expect(error).toBeFalsy()
  })
})
