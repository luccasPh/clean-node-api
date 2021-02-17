import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'
import { Encrypter } from '../../../data/protocols/criptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  private readonly secretKey: string

  constructor (secretKey: string) {
    this.secretKey = secretKey
  }

  async encrypt (value: string): Promise<string> {
    const token = await jwt.sign({ id: value }, this.secretKey)
    return token
  }

  async decrypt (value: string): Promise<string> {
    await jwt.verify(value, this.secretKey)
    return 'any_value'
  }
}
