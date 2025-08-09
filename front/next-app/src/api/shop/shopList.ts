import axios from "axios";

export type ShopListItem = {
  id: number;
  area_id: number;
  name: string;
  shop_detail: string;
  image_path: string | null;
  homepage_url: string | null;
  address: string;
  phone: string;
}

export type ShopListResponse =
  | {
    success: true;
    shops: ShopListItem[];
    messages?: string;
  }
  | {
    success: false;
    messages: Array<string>;
  };

export async function ShopList(): Promise<ShopListResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/shops/`;

  return axios
    .get<ShopListItem[]>(apiUrl)
    .then((response) => {
      return {
        success: true,
        shops: response.data,
        messages: "Shops fetched successfully",
      } as ShopListResponse;
    })
    .catch((error) => {
      console.error("Shop list fetch error:", error);
      return {
        success: false,
        messages: error.response?.data?.detail || ["Failed to fetch shops"],
      } as ShopListResponse;
    });
}
