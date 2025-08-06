import axios from "axios";

export type GeneralSignupRequest = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  address: string;
}

export function GeneralSignup({ request }: { request: GeneralSignupRequest}) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

  return axios
    .post
}