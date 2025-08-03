export interface IAddress {
  building: string
  street: string
  city: string
  state: string
  zip: string
}

export interface IContact {
  firstName: string
  lastName: string
  middleName?: string
  phone: string
  email: string
  relationship: string
}

export type OnboardingStatus = 'Pending' | 'Approved' | 'Rejected'

export interface IOnboarding {
  _id?: string
  userId: string
  firstName?: string
  lastName?: string
  middleName?: string
  preferredName?: string
  profilePic?: string
  address?: IAddress
  contact?: {
    cellPhone: string
    workPhone?: string
  }
  email: string
  ssn?: string
  dob?: string
  gender?: 'male' | 'female' | 'prefer_not_to_say'
  usResidentStatus?: {
    isCitizenOrResident: boolean
    title?: 'Green Card' | 'Citizen'
    visaType?: 'H1-B' | 'L2' | 'F1(CPT/OPT)' | 'H4' | 'Other'
    otherTitle?: string
    startDate?: string
    endDate?: string
    optReceipt?: string
  }
  reference?: IContact
  emergencyContacts?: IContact[]
  documents?: {
    driverLicense?: string
    workAuth?: string
  }
  status: OnboardingStatus
  feedback?: string
  createdAt?: Date
  updatedAt?: Date
}
