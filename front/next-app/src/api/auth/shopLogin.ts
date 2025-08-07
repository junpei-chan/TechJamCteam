import axios from 'axios';

export type ShopLoginRequest = {
  username: string;  // 店舗ユーザーはユーザー名でログイン
  password: string;
}

export type BackendShopAuthResponse = {
  access_token: string;
  token_type: string;
  user_type: string;
};

export type ShopLoginResponse =
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

export function shopLogin({ request }: { request: ShopLoginRequest }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8006';
  const apiUrl = `${backendUrl}/auth/shop/login`;

  console.log("Shop login request data:", { 
    username: request.username, 
    password: request.password ? '***' + request.password.slice(-2) : 'empty',
    passwordLength: request.password ? request.password.length : 0
  });

  return axios
    .post<BackendShopAuthResponse>(apiUrl, request)
    .then(response => {
      console.log("Shop login successful:", response.data);
      return {
        success: true,
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        user_type: response.data.user_type,
      } as ShopLoginResponse;
    })
    .catch(error => {
      console.error("Shop login error:", error);
      console.error("Error response:", error.response?.data);
      return {
        success: false,
        messages: error.response?.data?.detail ? [error.response.data.detail] : ['店舗ログインに失敗しました'],
      } as ShopLoginResponse;
    });
}
