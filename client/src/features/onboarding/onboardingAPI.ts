import axios from "../../app/axios";
import type { Onboarding } from "./types";

export const create = async (formData: FormData): Promise<Onboarding> => {
  const response = await axios.post("/onboarding", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getOnboardingByUserId = async (
  userId: string
): Promise<Onboarding> => {
  const response = await axios.get(`/onboarding/${userId}`);
  return response.data;
};

export const updateOnboardingByUserId = async (
  userId: string,
  formData: FormData
): Promise<Onboarding> => {
  const response = await axios.put(`/onboarding/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


