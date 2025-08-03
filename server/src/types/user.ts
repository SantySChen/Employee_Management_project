export type UserRole = 'EMPLOYEE' | 'HR'

export interface IUser {
  _id?: string
  username: string
  email: string
  password: string
  role: UserRole
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserJWT {
  userId: string
  role: 'EMPLOYEE' | 'HR'
  iat?: number
  exp?: number
}
