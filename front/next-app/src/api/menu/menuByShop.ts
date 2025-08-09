import axios from "axios";
import { MenuIndexRequest } from "./menuIndex";

export type MenuByShopResponse = 
  | {
    success: true;
    items: MenuIndexRequest[];
    total: number;
    page: number;
    per_page: number;
    messages?: string;
  }
  | {
    success: false;
    messages: Array<string>;
  };

export async function MenuByShop(shopId: number, perPage: number = 5, excludeMenuId?: number) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/menus/?shop_id=${shopId}&per_page=${perPage}`;
  
  console.log('MenuByShop API URL:', apiUrl);
  console.log('Shop ID:', shopId, 'Per Page:', perPage, 'Exclude Menu ID:', excludeMenuId);

  return axios
    .get<{
      items: MenuIndexRequest[];
      total: number;
      page: number;
      per_page: number;
    }>(apiUrl)
    .then((response) => {
      console.log('MenuByShop raw response:', response.data);
      
      // 現在表示中のメニューを除外
      let items = response.data.items;
      if (excludeMenuId) {
        items = items.filter(menu => menu.id !== excludeMenuId);
      }
      
      console.log('MenuByShop filtered items:', items);
      
      return {
        success: true,
        items: items,
        total: response.data.total,
        page: response.data.page,
        per_page: response.data.per_page,
        messages: items.length > 0 ? "Shop menus fetched successfully" : "No menus found for this shop",
      } as MenuByShopResponse;
    })
    .catch((error) => {
      console.error("Shop menu fetch error:", error);
      return {
        success: false,
        messages: error.response?.data?.detail || ["Failed to fetch shop menus"],
      } as MenuByShopResponse;
    });
}
