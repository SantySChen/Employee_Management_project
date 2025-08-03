export type UserRole = 'EMPLOYEE' | 'HR'

export interface User {
  _id: string
  username: string
  role: UserRole
}

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface AuthState {
  user: User | null
  token: string | null
  email?: string | null
  loading: boolean
  error: string | null
  tokenValid?: boolean
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}
