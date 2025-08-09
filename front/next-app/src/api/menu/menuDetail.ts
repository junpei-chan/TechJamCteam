import axios from "axios";

export type MenuDetailRequest = {
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
}

export type MenuDetailResponse = 
  | {
    success: true;
    menu: MenuDetailRequest;
    messages?: string;
  }
  | {
    success: false;
    messages: Array<string>;
  };

export async function MenuDetail(menuId: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/menus/${menuId}`;
  console.log("Requesting menu detail from:", apiUrl);
  console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

  return axios
    .get<MenuDetailRequest>(apiUrl)
    .then((response) => {
      console.log("Menu detail response:", response.data);
      return {
        success: true,
        menu: response.data,
        messages: "Menu fetched successfully",
      } as MenuDetailResponse;
    })
    .catch((error) => {
      console.error("Menu detail fetch error:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      return {
        success: false,
        messages: error.response?.data?.detail || ["Failed to fetch menu"],
      } as MenuDetailResponse;
    });
}
