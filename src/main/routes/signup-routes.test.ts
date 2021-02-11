import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should return an account success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'John Doe',
        email: 'foo@example',
        password: 'password',
        passwordConfirmation: 'password'
      })
      .expect(200)
  })
})
