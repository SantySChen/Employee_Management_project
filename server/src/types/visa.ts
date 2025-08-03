export type DocumentStatus = 'Pending' | 'Approved' | 'Rejected'

export interface IVisaStep {
  file: string
  status: DocumentStatus
  feedback?: string
}

export interface IVisa {
  _id?: string
  userId: string
  optReceipt?: IVisaStep
  optEAD?: IVisaStep
  i983?: IVisaStep
  i20?: IVisaStep
  createdAt?: Date
  updatedAt?: Date
}
