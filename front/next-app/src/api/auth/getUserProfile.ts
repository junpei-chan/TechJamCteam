import axios from 'axios';

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  address?: string;
};

export type GetUserProfileResponse =
  | {
    success: true;
    user: UserProfile;
  }
  | {
    success: false;
    messages: Array<string>;
  };

export async function getUserProfile(token: string): Promise<GetUserProfileResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8006';
  const apiUrl = `${backendUrl}/auth/me`;

  try {
    const response = await axios.get<UserProfile>(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("User profile fetched successfully:", response.data);
    return {
      success: true,
      user: response.data,
    };
  } catch (error: any) {
    console.error("Get user profile error:", error);
    console.error("Error response:", error.response?.data);
    return {
      success: false,
      messages: error.response?.data?.detail ? [error.response.data.detail] : ['プロフィール取得に失敗しました'],
    };
  }
}
