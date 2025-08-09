import axios from "axios";
import Cookies from "js-cookie";

export type MenuStoreRequest = {
  shop_id: number;
  genre_id?: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  category?: string;
  tags?: string[];
}

export type MenuStoreResponse = 
  | {
    success: true;
    menu: {
      id: number;
      shop_id: number;
      genre_id?: number;
      name: string;
      description: string;
      image_url: string;
      price: number;
      category?: string;
      tags?: string[];
      is_available: boolean;
      created_at: string;
      updated_at?: string;
    };
    messages?: string;
    access_token: string;
  }
  | {
    success: false;
    messages: Array<string>;
  };

export async function menuStore(request: MenuStoreRequest) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/menus/test`; // 一時的にテスト用エンドポイント
  const authToken = Cookies.get("authToken");

  return axios
    .post<{
      id: number;
      shop_id: number;
      genre_id?: number;
      name: string;
      description: string;
      image_url: string;
      price: number;
      category?: string;
      tags?: string[];
      is_available: boolean;
      created_at: string;
      updated_at?: string;
    }>(apiUrl, request)
    .then((response) => {
      return {
        success: true,
        menu: response.data,
        access_token: authToken || "",
        messages: "Menu created successfully",
      } as MenuStoreResponse;
    })
    .catch((error) => {
      console.error("Menu create error:", error);
      return {
        success: false,
        messages: error.response?.data?.detail || ["Failed to create menu"],
      } as MenuStoreResponse;
    });
}