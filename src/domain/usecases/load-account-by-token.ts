import { AccountModel } from '@/domain/models/account'

export interface LoadAccountByToken {
  load: (account: string, role?: string) => Promise<AccountModel | null>
}
