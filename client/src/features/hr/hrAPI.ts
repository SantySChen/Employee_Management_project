import axios from "../../app/axios"

export const generateTokenAndSendEmail = async (
  email: string
): Promise<{ success: boolean }> => {
  const res = await axios.post<{ success: boolean }>("/registration/generate", { email });
  return res.data;
};