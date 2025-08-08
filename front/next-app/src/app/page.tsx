"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MenuList } from "@/components/features/top/MenuList";
import { Logo, SearchBar, GeneralFooter } from "@/components/shared/";
import { useAuth, useLogout } from "../hooks/useAuth";

export default function Top() {
  const { isAuthenticated, userType, isLoading } = useAuth(true);
  const logout = useLogout();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">認証確認中...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="bg-base py-4 px-6">
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

      <GeneralFooter />
    </main>
  );
}
