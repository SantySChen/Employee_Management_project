export interface IRegistrationToken {
  _id?: string
  email: string
  token: string
  expiresAt: Date
  isUsed?: boolean
  createdAt?: Date
  updatedAt?: Date
}
