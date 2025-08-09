import axios from "axios";

export type GeneralSignupRequest = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  address: string;
}

export async function GeneralSignup({ request }: { request: GeneralSignupRequest}) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

  // confirm_passwordを除外してバックエンドに送信
  const { confirm_password, ...requestData } = request;

  return axios
    .post(`${apiUrl}/auth/register`, requestData)
    .then((response) => {
      return {
        success: true,
        messages: "Registration successful",
        user: response.data
      };
    })
    .catch((error) => {
      console.error("Registration error:", error);
      return {
        success: false,
        messages: error.response?.data?.detail || ["Registration failed"],
      };
    })
}