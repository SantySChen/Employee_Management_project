export interface Address {
  building: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Contact {
  cellPhone: string;
  workPhone?: string;
}

export type Gender = "male" | "female" | "prefer_not_to_say";

export type VisaType = "H1-B" | "L2" | "F1(CPT/OPT)" | "H4" | "Other";

export interface USResidentStatus {
  isCitizenOrResident: boolean;
  title?: "Green Card" | "Citizen";
  visaType?: VisaType;
  otherTitle?: string;
  startDate?: string;
  endDate?: string;
  optReceipt?: string;
}

export interface Reference {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface EmergencyContact {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface Documents {
  driverLicense?: string;
  workAuth?: string;
}

export type OnboardingStatus = "Pending" | "Approved" | "Rejected";

export interface Onboarding {
  _id?: string;
  userId: string | { _id: string };
  firstName?: string;
  lastName?: string;
  middleName?: string;
  preferredName?: string;
  profilePic?: string;
  address?: Address;
  contact?: Contact;
  email: string;
  ssn?: string;
  dob?: string;
  gender?: Gender;
  usResidentStatus?: USResidentStatus;
  reference?: Reference;
  emergencyContacts?: EmergencyContact[];
  documents?: Documents;
  status: OnboardingStatus;
  feedback?: string;
  createdAt?: string;
  updatedAt?: string;
}
