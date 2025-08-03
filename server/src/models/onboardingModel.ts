import { prop, getModelForClass, modelOptions, Ref } from "@typegoose/typegoose";
import { User } from "./userModel";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Onboarding {
  public _id?: string;

  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;

  @prop()
  public firstName?: string;

  @prop()
  public lastName?: string;

  @prop()
  public middleName?: string;

  @prop()
  public preferredName?: string;

  @prop()
  public profilePic?: string;

  @prop()
  public address?: {
    building: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  @prop()
  public contact?: {
    cellPhone: string;
    workPhone?: string;
  };

  @prop({ required: true })
  public email!: string;

  @prop()
  public ssn?: string;

  @prop()
  public dob?: string;

  @prop()
  public gender?: "male" | "female" | "prefer_not_to_say";

  @prop()
  public usResidentStatus?: {
    isCitizenOrResident: boolean;
    title?: "Green Card" | "Citizen";
    visaType?: "H1-B" | "L2" | "F1(CPT/OPT)" | "H4" | "Other";
    otherTitle?: string;
    startDate?: string;
    endDate?: string;
    optReceipt?: string;
  };

  @prop()
  public reference?: {
    firstName: string;
    lastName: string;
    middleName?: string;
    phone: string;
    email: string;
    relationship: string;
  };

  @prop({ type: () => [Object] })
  public emergencyContacts?: {
    firstName: string;
    lastName: string;
    middleName?: string;
    phone: string;
    email: string;
    relationship: string;
  }[];

  @prop()
  public documents?: {
    driverLicense?: string;
    workAuth?: string;
  };

  @prop({ enum: ["Pending", "Approved", "Rejected"], default: "Pending" })
  public status!: "Pending" | "Approved" | "Rejected";

  @prop()
  public feedback?: string;
}

export const OnboardingModel = getModelForClass(Onboarding);

