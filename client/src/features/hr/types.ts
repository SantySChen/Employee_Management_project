import type { User } from "../auth/types";
import type { Visa } from "../visa/types";

export interface HrState {
  onboardings: Onboarding[];
  currentPage: number;
  totalPages: number;
  totalItems: number;

  searchResults: Onboarding[];
  searchPage: number;
  searchTotalPages: number;
  isSearching: boolean;
  searchQuery: string;
  
  onboardingsByStatus: {
    [status in "Pending" | "Approved" | "Rejected"]: {
      data: Onboarding[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  };

  visas: Visa[];
  visaPage: number;
  totalVisaPages: number;
  totalVisaItems: number;

  approvedOnboardings: Onboarding[];
  
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface Onboarding {
  _id?: string;
  userId: string | User;

  firstName?: string;
  lastName?: string;
  middleName?: string;
  preferredName?: string;
  profilePic?: string;

  address?: {
    building: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  contact?: {
    cellPhone: string;
    workPhone?: string;
  };

  email: string;
  ssn?: string;
  dob?: string;
  gender?: "male" | "female" | "prefer_not_to_say";

  usResidentStatus?: {
    isCitizenOrResident: boolean;
    title?: "Green Card" | "Citizen";
    visaType?: "H1-B" | "L2" | "F1(CPT/OPT)" | "H4" | "Other";
    otherTitle?: string;
    startDate?: string;
    endDate?: string;
    optReceipt?: string;
  };

  reference?: {
    firstName: string;
    lastName: string;
    middleName?: string;
    phone: string;
    email: string;
    relationship: string;
  };

  emergencyContacts?: {
    firstName: string;
    lastName: string;
    middleName?: string;
    phone: string;
    email: string;
    relationship: string;
  }[];

  documents?: {
    driverLicense?: string;
    workAuth?: string;
  };

  status: "Pending" | "Approved" | "Rejected";
  feedback?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedOnboardings {
  onboardings: Onboarding[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface SearchParams {
  query: string;
  page: number;
  field: "firstName" | "lastName" | "preferredName";
}

export interface SearchByStatusParams {
  status: string;
  page?: number
}

export interface UpdateStatusPayload {
  id: string;
  status: "Approved" | "Rejected" | "Pending";
  feedback?: string;
}

export interface PaginatedVisas {
  data: Visa[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}