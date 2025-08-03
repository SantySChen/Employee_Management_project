import axios from "../../app/axios";
import type { LoginPayload, AuthResponse, RegisterRequest } from "./types";

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axios.post('/auth/login', payload)
    return response.data
}

export const verifyRegistrationToken = async (token: string): Promise<{ valid: boolean }> => {
  const res = await axios.get<{ valid: boolean }>(`/auth/verify/${token}`);
  return res.data;
};

export const completeRegistration = async (data: RegisterRequest): Promise<AuthResponse> => {
  const res = await axios.post<AuthResponse>(`/auth/complete`, data);
  return res.data; 
};
