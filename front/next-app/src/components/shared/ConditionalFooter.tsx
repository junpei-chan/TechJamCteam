"use client";

import { useState, useEffect } from "react";
import { GeneralFooter } from "./GeneralFooter";
import { ShopFooter } from "./ShopFooter";
import Cookies from "js-cookie";

export function ConditionalFooter() {
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cookieから認証情報を取得
    const getUserType = () => {
      try {
        // Cookieに保存されたユーザータイプを確認
        const savedUserType = Cookies.get("userType");
        setUserType(savedUserType || "user"); // デフォルトは一般ユーザー
      } catch (error) {
        console.error("Error getting user type:", error);
        setUserType("user"); // エラー時はデフォルトで一般ユーザー
      } finally {
        setIsLoading(false);
      }
    };

    getUserType();

    // Cookieの変更を定期的にチェック（Cookieには直接的な変更イベントがないため）
    const interval = setInterval(() => {
      const currentUserType = Cookies.get("userType");
      if (currentUserType !== userType) {
        setUserType(currentUserType || "user");
      }
    }, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [userType]);

  // ローディング中は何も表示しない
  if (isLoading) {
    return null;
  }

  // ユーザータイプに応じてフッターを表示
  if (userType === "shop_user") {
    return <ShopFooter />;
  } else {
    // 一般ユーザーまたは未ログインの場合はGeneralFooterを表示
    return <GeneralFooter />;
  }
}
