import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  public _id?: string

  @prop({ required: true, unique: true })
  public username!: string

  @prop({ required: true, unique: true })
  public email!: string

  @prop({ required: true })
  public password!: string

  @prop({ enum: ["EMPLOYEE", "HR"], default: "EMPLOYEE" })
  public role!: "EMPLOYEE" | "HR"

  @prop({ default: true })
  public isActive!: boolean
}

export const UserModel = getModelForClass(User)
