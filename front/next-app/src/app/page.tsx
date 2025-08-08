"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MenuList } from "@/components/features/menu/MenuList";
import { Logo, SearchBar, ConditionalFooter } from "@/components/shared/";
import { useAuth } from "../hooks/useAuth";

export default function Top() {
  const { isAuthenticated, userType, isLoading } = useAuth(false); // 認証を必須にしない
  const [currentUserType, setCurrentUserType] = useState<string | null>(null);

  useEffect(() => {
    // ローカルストレージからユーザータイプを取得、存在しない場合はデフォルト設定
    let savedUserType = localStorage.getItem("userType");
    if (!savedUserType) {
      savedUserType = "user"; // デフォルトは一般ユーザー
      localStorage.setItem("userType", savedUserType);
    }
    setCurrentUserType(savedUserType);
  }, []);

  const toggleUserType = () => {
    const newUserType = currentUserType === "shop_user" ? "user" : "shop_user";
    localStorage.setItem("userType", newUserType);
    setCurrentUserType(newUserType);
    // ページをリロードしてフッターを更新
    window.location.reload();
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-main mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="fixed top-0 left-0 bg-base py-4 px-6 z-20">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <span className="w-6"></span>

          <Logo />
          
          <Link href="/notification" className="flex items-center">
            <Image 
              src="/icons/bell-icon.svg"
              alt="通知"
              width={24}
              height={24}
            />
          </Link>
        </div>

        <SearchBar />
      </header>

      <MenuList />

      <ConditionalFooter />
    </main>
  );
}
