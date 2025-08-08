import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export type UsernameCheckResponse = {
  available: boolean;
  username: string;
};

export type EmailCheckResponse = {
  available: boolean;
  email: string;
};

export async function checkUsernameAvailability(username: string): Promise<UsernameCheckResponse> {
  try {
    const response = await axios.get(`${apiUrl}/auth/check-username/${encodeURIComponent(username)}`);
    return response.data as UsernameCheckResponse;
  } catch (error) {
    console.error("Username availability check error:", error);
    return { available: false, username };
  }
}

export async function checkEmailAvailability(email: string): Promise<EmailCheckResponse> {
  try {
    const response = await axios.get(`${apiUrl}/auth/check-email/${encodeURIComponent(email)}`);
    return response.data as EmailCheckResponse;
  } catch (error) {
    console.error("Email availability check error:", error);
    return { available: false, email };
  }
}
