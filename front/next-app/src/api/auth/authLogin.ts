import axios from 'axios';

export type AuthLoginRequest = {
  email: string;
  password: string;
}

export type BackendAuthResponse = {
  access_token: string;
  token_type: string;
  user_type: string;
};

export type AuthLoginResponse =
  | {
    success: true;
    access_token: string;
    token_type: string;
    user_type: string;
    messages?: string;
  }
  | {
    success: false;
    messages: Array<string>;
  };

export function authLogin({ request }: { request: AuthLoginRequest }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8006';
  const apiUrl = `${backendUrl}/auth/login`;

  return axios
    .post<BackendAuthResponse>(apiUrl, request)
    .then(response => ({
      success: true,
      access_token: response.data.access_token,
      token_type: response.data.token_type,
      user_type: response.data.user_type,
    } as AuthLoginResponse))
    .catch(error => {
      console.warn(error);
      return {
        success: false,
        messages: error.response?.data.messages || ['ログインに失敗しました'],
      } as AuthLoginResponse;
    })
}