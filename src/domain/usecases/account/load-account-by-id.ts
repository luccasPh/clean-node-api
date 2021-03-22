import { AccountModel } from '@/domain/models/account'

export interface LoadAccountById {
  load: (accessToken: string, role?: string) => Promise<AccountModel | null>
}
