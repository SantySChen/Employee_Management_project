import express, { Request, Response } from "express"
import asyncHandler from 'express-async-handler'
import { UserModel } from "./models"
import { hrUser } from "./hrdata"

export const seedRouter = express.Router()

seedRouter.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        await UserModel.deleteMany({})
        const createUser = await UserModel.insertOne(hrUser);

        res.json({ createUser })
    })
)