import axios from "axios";

export type ShopSignupRequest = {
  shop_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  address: string;
  phone?: string;
  homepage_url?: string;
  shop_detail?: string;
}

export async function ShopSignup({ request }: { request: ShopSignupRequest }) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;
  const { confirm_password, shop_name, shop_detail, phone, homepage_url, address, ...userData } = request;

  try {
    // 1. 店舗を作成（area_id は1（Tokyo）を固定で使用）
    const shopData = {
      area_id: 1,
      name: shop_name,
      shop_detail: shop_detail || undefined,
      address: address,
      phone: phone || undefined,
      homepage_url: homepage_url || undefined
    };

    // 空文字列のフィールドを除去
    Object.keys(shopData).forEach(key => {
      if (shopData[key as keyof typeof shopData] === undefined) {
        delete shopData[key as keyof typeof shopData];
      }
    });

    console.log("Sending shop data:", shopData);
    const shopResponse = await axios.post(`${apiUrl}/shops/`, shopData);
    console.log("Shop created successfully:", shopResponse.data);
    const createdShop = shopResponse.data as { id: number; name: string; area_id: number };

    // shop_idが正しく取得できているか確認
    console.log("Created shop ID:", createdShop.id);

    // 2. 店舗ユーザーを作成
    const shopUserData = {
      shop_id: createdShop.id,
      ...userData
    };

    console.log("Sending shop user data:", shopUserData);
    const userResponse = await axios.post(`${apiUrl}/auth/shop/register`, shopUserData);
    console.log("Shop user created successfully:", userResponse.data);

    return {
      success: true,
      messages: "Shop registration successful",
      shop: createdShop,
      user: userResponse.data
    };
  } catch (error: any) {
    console.error("Shop registration error:", error);
    console.error("Error response:", error.response);
    console.error("Error data:", error.response?.data);
    return {
      success: false,
      messages: error.response?.data?.detail || error.response?.data || ["Shop registration failed"],
    };
  }
}