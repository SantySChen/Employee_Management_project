import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import { sendEmail } from '../utils'
import { RegistrationTokenModel, UserModel } from '../models'

export const generateRegistrationToken = async (req: Request, res: Response) => {
  const { email, fullName } = req.body
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
  return res.status(400).json({ message: "Email already exists." });
}

  const token = uuidv4()
  const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000) 

  try {
    await RegistrationTokenModel.create({ email, token, expiresAt })

    const link = `http://localhost:5173/register/${token}`

    await sendEmail(
      email,
      'Complete your employee registration',
      `<p>Hi ${fullName},</p>
      <p>Please complete your registration:</p>
      <a href="${link}">${link}</a>
      <p>This link will expire in 3 hours.</p>`
    )

    res.status(200).json({ message: 'Registration email sent.' })
  } catch (error) {
    res.status(500).json({ message: 'Error generating registration link.' })
  }
}

export const verifyRegistrationToken = async (req: Request, res: Response) => {
  const { token } = req.params

  try {
    const record = await RegistrationTokenModel.findOne({ token })

    if (!record || record.expiresAt < new Date()) {
      return res.status(403).json({ message: 'Token is invalid or expired.' })
    }

    return res.status(200).json({ email: record.email })
  } catch (error) {
    return res.status(500).json({ message: 'Server error validating token.' })
  }
}

export const completeRegistration = async (req: Request, res: Response) => {
  const { token, username, password } = req.body

  try {
    const tokenRecord = await RegistrationTokenModel.findOne({ token })

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return res.status(403).json({ message: 'Token expired or invalid.' })
    }

    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email: tokenRecord.email }],
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new UserModel({
      username,
      email: tokenRecord.email,
      password: hashedPassword,
      role: 'EMPLOYEE', 
    })

    await newUser.save()
    await tokenRecord.deleteOne()

    return res.status(201).json({ message: 'User registered successfully.' })
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed.' })
  }
}
