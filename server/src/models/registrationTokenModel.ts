import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class RegistrationToken {
  public _id?: string

  @prop({ required: true })
  public email!: string

  @prop({ required: true })
  public token!: string

  @prop({ required: true })
  public expiresAt!: Date

  @prop()
  public isUsed?: boolean
}

export const RegistrationTokenModel = getModelForClass(RegistrationToken)
