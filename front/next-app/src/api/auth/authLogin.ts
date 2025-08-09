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

  console.log("Login request data:", { 
    email: request.email, 
    password: request.password ? '***' + request.password.slice(-2) : 'empty',
    passwordLength: request.password ? request.password.length : 0
  });

  return axios
    .post<BackendAuthResponse>(apiUrl, request)
    .then(response => {
      console.log("Login successful:", response.data);
      return {
        success: true,
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        user_type: response.data.user_type,
      } as AuthLoginResponse;
    })
    .catch(error => {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      return {
        success: false,
        messages: error.response?.data?.detail ? [error.response.data.detail] : ['ログインに失敗しました'],
      } as AuthLoginResponse;
    });
}