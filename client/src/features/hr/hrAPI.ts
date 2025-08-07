import axios from "../../app/axios";
import type { Onboarding, PaginatedOnboardings, PaginatedVisas, SearchByStatusParams, UpdateStatusPayload } from "./types";

export const generateTokenAndSendEmail = async (
  email: string
): Promise<{ success: boolean }> => {
  const res = await axios.post<{ success: boolean }>("/registration/generate", {
    email,
  });
  return res.data;
};

export const getAllOnboardings = async (
  page: number = 1
): Promise<PaginatedOnboardings> => {
  const response = await axios.get(`/hr/getAll?page=${page}`);
  return response.data;
};

export const searchOnboardings = async (
  name: string,
  page: number = 1,
  field: "firstName" | "lastName" | "preferredName"
): Promise<PaginatedOnboardings> => {
  const response = await axios.get("/hr/search", {
    params: { name, page, field },
  });
  return response.data;
};

export const searchOnboardingByStatus = async ({
  status,
  page = 1,
}: SearchByStatusParams): Promise<{
  onboardings: Onboarding[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}> => {
  const response = await axios.get("/hr/searchByStatus", {
    params: { status, page },
  });

  return response.data;
};

export const updateOnboardingStatus = async ({
  id,
  status,
  feedback,
}: UpdateStatusPayload): Promise<Onboarding> => {
  const response = await axios.put(`/hr/onboardings/${id}/status`, {
    status,
    feedback,
  });

  return response.data.onboarding;
};

export const fetchAllVisas = async (page: number = 1): Promise<PaginatedVisas> => {
  const response = await axios.get(`/visa/all?page=${page}`);
  return response.data;
};

export const getAllApprovedOnboardings = async (): Promise<Onboarding[]> => {
  const response = await axios.get("/hr/onboardings/approved");
  return response.data;
};