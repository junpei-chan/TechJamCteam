import axios from "axios";
import Cookies from "js-cookie";

export type MenuStoreRequest = {
  id: number;
  shop_id: number;
  genre_id?: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
}

export type MenuStoreResponse = 
  | {
    success: true;
    menu: MenuStoreRequest;
    messages?: string;
    access_token: string;
  }
  | {
    success: false;
    messages: Array<string>;
  };

export async function menuStore(request: MenuStoreRequest) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/menus`;
  const authToken = Cookies.get("authToken");

  return axios
    .post<MenuStoreRequest>(apiUrl, request, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
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