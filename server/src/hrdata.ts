import bcrypt from 'bcryptjs';
import { User } from './models/userModel'

export const hrUser: User = {
    username: 'hr',
    email: 'santiagoczy23@gmail.com',
    password: bcrypt.hashSync('123456'),
    role: 'HR',
    isActive: true,
}