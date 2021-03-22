import jwt from 'jsonwebtoken'

import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { Encrypter } from '@/data/protocols/criptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  private readonly secretKey: string
  private readonly expirationTime: string

  constructor (secretKey: string, expirationTime: string) {
    this.secretKey = secretKey
    this.expirationTime = expirationTime
  }

  async encrypt (value: string): Promise<string> {
    const token = await jwt.sign({ id: value }, this.secretKey, { expiresIn: this.expirationTime })
    return token
  }

  async decrypt (token: string): Promise<string> {
    const value: any = await jwt.verify(token, this.secretKey)
    return value.id
  }
}
