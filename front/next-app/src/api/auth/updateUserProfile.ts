import axios from 'axios';

export type UpdateUserProfileRequest = {
  username?: string;
  email?: string;
  address?: string;
};

export type UpdateUserProfileResponse =
  | {
    success: true;
    user: {
      id: number;
      username: string;
      email: string;
      address?: string;
    };
  }
  | {
    success: false;
    messages: Array<string>;
  };

export async function updateUserProfile(
  token: string, 
  updateData: UpdateUserProfileRequest
): Promise<UpdateUserProfileResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8006';
  const apiUrl = `${backendUrl}/auth/me`;

  try {
    const response = await axios.put(apiUrl, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log("User profile updated successfully:", response.data);
    return {
      success: true,
      user: response.data as {
        id: number;
        username: string;
        email: string;
        address?: string;
      },
    };
  } catch (error: any) {
    console.error("Update user profile error:", error);
    console.error("Error response:", error.response?.data);
    return {
      success: false,
      messages: error.response?.data?.detail ? [error.response.data.detail] : ['プロフィール更新に失敗しました'],
    };
  }
}
