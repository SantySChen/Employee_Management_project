import { Request, Response } from "express"
import { UserModel } from "../models"
import { generateToken } from "../utils"

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        const user = await UserModel.findOne({ username })

        if(!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if(user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' })
        }

        const token = generateToken({ userId: user._id, role: user.role })

        return res.status(200).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        console.log('[Auth Login Error]', error)
        return res.status(404).json({ message: 'Server error during login' })
    }
}