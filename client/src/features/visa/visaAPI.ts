import axios from "../../app/axios"; // adjust path based on your app
import type { Visa, VisaStepKey, VisaStatus } from "./types";

export const createVisa = async (
  userId: string,
  optReceiptFile: string
): Promise<Visa> => {
  const response = await axios.post("/visa/create", {
    userId,
    optReceiptFile,
  });
  return response.data;
};

export const getVisaByUserId = async (userId: string): Promise<Visa> => {
  const response = await axios.get(`/visa/${userId}`);
  return response.data;
};

export const uploadVisaFile = async (
  userId: string,
  step: VisaStepKey,
  file: File
): Promise<Visa> => {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("step", step);
  formData.append("file", file);

  const response = await axios.post("/visa/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const reviewVisaStep = async (
  userId: string,
  step: VisaStepKey,
  status: VisaStatus,
  feedback?: string
): Promise<Visa> => {
  const response = await axios.put(`/visa/review/${userId}`, {
    step,
    status,
    feedback,
  });

  return response.data;
};
