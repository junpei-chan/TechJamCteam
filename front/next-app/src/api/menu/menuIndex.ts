import axios from "axios";
import Cookies from "js-cookie";

export type MenuIndexRequest = {
  id: number;
  shop_id: number;
  genre_id?: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  category?: string;
  is_available: boolean;
  created_at: string;
  updated_at?: string;
}

export type MenuIndexResponse = 
  | {
    success: true;
    items: MenuIndexRequest[];
    total: number;
    page: number;
    per_page: number;
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
    .get<{
      items: MenuIndexRequest[];
      total: number;
      page: number;
      per_page: number;
    }>(apiUrl)
    .then((response) => {
      return {
        success: true,
        items: response.data.items,
        total: response.data.total,
        page: response.data.page,
        per_page: response.data.per_page,
        access_token: authToken || "",
        messages: response.data.items.length > 0 ? "Menus fetched successfully" : "No menus found",
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