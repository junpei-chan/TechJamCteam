import axios from 'axios';

export type MenuFavoriteRequest = {
  user_id: number;
  menu_id: number;
};

export type MenuFavoriteResponse = {
  user_id: number;
  menu_id: number;
};

export type MenuDetails = {
  id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  shop_id: number;
  genre_id: number;
  tags?: string[];
};

export type MenuFavoriteWithDetails = {
  user_id: number;
  menu_id: number;
  menu?: MenuDetails;
};

export type MenuFavoritesApiResponse = 
  | {
      success: true;
      favorites: MenuFavoriteWithDetails[];
    }
  | {
      success: false;
      messages: string[];
    };

export type AddMenuFavoriteApiResponse = 
  | {
      success: true;
      favorite: MenuFavoriteResponse;
      message: string;
    }
  | {
      success: false;
      messages: string[];
    };

export type RemoveMenuFavoriteApiResponse = 
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      messages: string[];
    };

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8006';

// ユーザーのメニューお気に入り一覧を取得
export async function getUserMenuFavorites(userId: number): Promise<MenuFavoritesApiResponse> {
  try {
    const response = await axios.get<MenuFavoriteResponse[]>(
      `${backendUrl}/menu_favorites/user/${userId}`
    );
    
    // メニュー詳細情報も取得
    const favoritesWithDetails: MenuFavoriteWithDetails[] = [];
    
    for (const favorite of response.data) {
      try {
        const menuResponse = await axios.get(`${backendUrl}/menus/${favorite.menu_id}`);
        favoritesWithDetails.push({
          ...favorite,
          menu: menuResponse.data as MenuDetails
        });
      } catch (error) {
        console.error(`Failed to fetch menu details for menu_id: ${favorite.menu_id}`, error);
        // メニュー詳細が取得できない場合でもお気に入り情報は含める
        favoritesWithDetails.push(favorite);
      }
    }
    
    return {
      success: true,
      favorites: favoritesWithDetails
    };
  } catch (error) {
    console.error("Failed to fetch menu favorites:", error);
    return {
      success: false,
      messages: error instanceof Error && 'response' in error && (error as any).response?.data?.detail
        ? [(error as any).response.data.detail] 
        : ["メニューお気に入り一覧の取得に失敗しました"]
    };
  }
}

// メニューをお気に入りに追加
export async function addMenuFavorite(request: MenuFavoriteRequest): Promise<AddMenuFavoriteApiResponse> {
  try {
    const response = await axios.post<MenuFavoriteResponse>(
      `${backendUrl}/menu_favorites/`,
      request
    );
    
    return {
      success: true,
      favorite: response.data,
      message: "メニューをお気に入りに追加しました"
    };
  } catch (error) {
    console.error("Failed to add menu favorite:", error);
    return {
      success: false,
      messages: error instanceof Error && 'response' in error && (error as any).response?.data?.detail
        ? [(error as any).response.data.detail] 
        : ["メニューのお気に入り追加に失敗しました"]
    };
  }
}

// メニューをお気に入りから削除
export async function removeMenuFavorite(userId: number, menuId: number): Promise<RemoveMenuFavoriteApiResponse> {
  try {
    await axios.delete(`${backendUrl}/menu_favorites/?user_id=${userId}&menu_id=${menuId}`);
    
    return {
      success: true,
      message: "メニューをお気に入りから削除しました"
    };
  } catch (error) {
    console.error("Failed to remove menu favorite:", error);
    return {
      success: false,
      messages: error instanceof Error && 'response' in error && (error as any).response?.data?.detail
        ? [(error as any).response.data.detail] 
        : ["メニューのお気に入り削除に失敗しました"]
    };
  }
}

// メニューがお気に入りかどうかチェック
export async function checkMenuFavorite(userId: number, menuId: number): Promise<{ success: boolean; isFavorite: boolean }> {
  try {
    const response = await axios.get<{ is_favorite: boolean }>(
      `${backendUrl}/menu_favorites/check?user_id=${userId}&menu_id=${menuId}`
    );
    
    return {
      success: true,
      isFavorite: response.data.is_favorite
    };
  } catch (error) {
    console.error("Failed to check menu favorite status:", error);
    return {
      success: false,
      isFavorite: false
    };
  }
}
