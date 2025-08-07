import type { User } from "../auth/types";

export type VisaStepKey = "optReceipt" | "optEAD" | "i983" | "i20";

export type VisaStatus = "Pending" | "Approved" | "Rejected";

export interface VisaStep {
  file: string;
  status: VisaStatus;
  feedback?: string;
}

export interface Visa {
  _id: string;
  userId: string | User;
  optReceipt?: VisaStep;
  optEAD?: VisaStep;
  i983?: VisaStep;
  i20?: VisaStep;
  createdAt: string;
  updatedAt: string;
}

export interface VisaState {
  data: Visa | null;
  loading: boolean;
  error: string | null;
}
