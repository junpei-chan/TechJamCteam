import axios from "axios";

export type ShopDetailRequest = {
  id: number;
  area_id: number;
  name: string;
  shop_detail: string; // バックエンドのフィールド名に合わせて修正
  image_path: string | null;
  homepage_url: string | null;
  address: string;
  phone: string;
}

export type ShopDetailResponse =
  | {
    success: true;
    shop: ShopDetailRequest;
    messages?: string;
  }
  | {
    success: false;
    messages: Array<string>;
  };

export async function ShopDetail(shopId: string): Promise<ShopDetailResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/shops/${shopId}`;

  return axios
    .get<ShopDetailRequest>(apiUrl)
    .then((response) => {
      return {
        success: true,
        shop: response.data,
        messages: "Shop details fetched successfully",
      } as ShopDetailResponse;
    })
    .catch((error) => {
      console.error("Shop detail fetch error:", error);
      return {
        success: false,
        messages: error.response?.data?.detail || ["Failed to fetch shop details"],
      } as ShopDetailResponse;
    });
  
}