import axios from "axios";
import Cookies from "js-cookie";

export type MenuIndexRequest = {
  id: number;
  // shop_id: number;  // 一時的にコメントアウト
  // genre_id?: number;  // 一時的にコメントアウト
  name: string;
  description: string;
  image_url: string;
  price: number;
}

export type MenuIndexResponse = 
  | {
    success: true;
    menus: MenuIndexRequest[];
    messages?: string;
    access_token: string;
  }
  | {
    success: false;
    messages: Array<string>;
  };

export async function MenuIndex() {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/menus`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<MenuIndexRequest[]>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response) => {
      return {
        success: true,
        menus: response.data,
        access_token: authToken || "",
        messages: response.data.length > 0 ? "Menus fetched successfully" : "No menus found",
      } as MenuIndexResponse;
    })
    .catch((error) => {
      console.error("Menu fetch error:", error);
      return {
        success: false,
        messages: error.response?.data?.detail || ["Failed to fetch menus"],
      } as MenuIndexResponse;
    });
}