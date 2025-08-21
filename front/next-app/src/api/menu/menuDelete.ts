import axios from "axios";

export type MenuDeleteResponse = 
  | {
    success: true;
    message: string;
  }
  | {
    success: false;
    messages: Array<string>;
  };

export async function menuDelete(menuId: number): Promise<MenuDeleteResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/menus/${menuId}`;

  try {
    const response = await axios.delete<{
      message: string;
    }>(apiUrl);

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error("Menu delete error:", error);
    return {
      success: false,
      messages: error.response?.data?.detail 
        ? [error.response.data.detail] 
        : ["メニューの削除に失敗しました"],
    };
  }
}
