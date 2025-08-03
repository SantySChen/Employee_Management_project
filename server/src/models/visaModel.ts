import { prop, getModelForClass, modelOptions, Ref } from "@typegoose/typegoose";
import { User } from "./userModel";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Visa {
  public _id?: string;

  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;

  @prop()
  public optReceipt?: {
    file: string;
    status: "Pending" | "Approved" | "Rejected";
    feedback?: string;
  };

  @prop()
  public optEAD?: {
    file: string;
    status: "Pending" | "Approved" | "Rejected";
    feedback?: string;
  };

  @prop()
  public i983?: {
    file: string;
    status: "Pending" | "Approved" | "Rejected";
    feedback?: string;
  };

  @prop()
  public i20?: {
    file: string;
    status: "Pending" | "Approved" | "Rejected";
    feedback?: string;
  };
}

export const VisaModel = getModelForClass(Visa);
