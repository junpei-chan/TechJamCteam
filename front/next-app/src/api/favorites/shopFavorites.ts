import axios from 'axios';

export type ShopFavoriteRequest = {
  user_id: number;
  shop_id: number;
};

export type ShopFavoriteResponse = {
  user_id: number;
  shop_id: number;
};

export type ShopDetails = {
  id: number;
  name: string;
  area_id: number;
  address?: string;
  phone?: string;
  description?: string;
  image_url?: string;
  created_at: string;
};

export type ShopFavoriteWithDetails = {
  user_id: number;
  shop_id: number;
  shop?: ShopDetails;
};

export type ShopFavoritesApiResponse = 
  | {
      success: true;
      shops: ShopDetails[];
    }
  | {
      success: false;
      messages: string[];
    };

export type AddShopFavoriteApiResponse = 
  | {
      success: true;
      favorite: ShopFavoriteResponse;
      message: string;
    }
  | {
      success: false;
      messages: string[];
    };

export type RemoveShopFavoriteApiResponse = 
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      messages: string[];
    };

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8006';

// ユーザーの店舗お気に入り一覧を取得
export async function getUserShopFavorites(userId: number): Promise<ShopFavoritesApiResponse> {
  try {
    const response = await axios.get<ShopDetails[]>(
      `${backendUrl}/favorites/users/${userId}/shops`
    );
    
    return {
      success: true,
      shops: response.data
    };
  } catch (error) {
    console.error("Failed to fetch shop favorites:", error);
    return {
      success: false,
      messages: error instanceof Error && 'response' in error && (error as any).response?.data?.detail
        ? [(error as any).response.data.detail] 
        : ["店舗お気に入り一覧の取得に失敗しました"]
    };
  }
}

// 店舗をお気に入りに追加
export async function addShopFavorite(userId: number, shopId: number): Promise<AddShopFavoriteApiResponse> {
  try {
    const response = await axios.post<ShopFavoriteResponse>(
      `${backendUrl}/favorites/users/${userId}/shops/${shopId}`
    );
    
    return {
      success: true,
      favorite: response.data,
      message: "店舗をお気に入りに追加しました"
    };
  } catch (error) {
    console.error("Failed to add shop favorite:", error);
    return {
      success: false,
      messages: error instanceof Error && 'response' in error && (error as any).response?.data?.detail
        ? [(error as any).response.data.detail] 
        : ["店舗のお気に入り追加に失敗しました"]
    };
  }
}

// 店舗をお気に入りから削除
export async function removeShopFavorite(userId: number, shopId: number): Promise<RemoveShopFavoriteApiResponse> {
  try {
    await axios.delete(`${backendUrl}/favorites/users/${userId}/shops/${shopId}`);
    
    return {
      success: true,
      message: "店舗をお気に入りから削除しました"
    };
  } catch (error) {
    console.error("Failed to remove shop favorite:", error);
    return {
      success: false,
      messages: error instanceof Error && 'response' in error && (error as any).response?.data?.detail
        ? [(error as any).response.data.detail] 
        : ["店舗のお気に入り削除に失敗しました"]
    };
  }
}

// 店舗がお気に入りかどうかチェック
export async function checkShopFavorite(userId: number, shopId: number): Promise<{ success: boolean; isFavorite: boolean }> {
  try {
    const response = await axios.get<{ is_favorite: boolean }>(
      `${backendUrl}/favorites/users/${userId}/shops/${shopId}/status`
    );
    
    return {
      success: true,
      isFavorite: response.data.is_favorite
    };
  } catch (error) {
    console.error("Failed to check shop favorite status:", error);
    return {
      success: false,
      isFavorite: false
    };
  }
}
