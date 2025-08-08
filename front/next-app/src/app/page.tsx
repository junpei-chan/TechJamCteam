"use client";

import Link from "next/link";
import Image from "next/image";
import { MenuList } from "@/components/features/menu/MenuList";
import { Logo, SearchBar, GeneralFooter } from "@/components/shared/";
import { useAuth } from "../hooks/useAuth";

export default function Top() {
  const { isAuthenticated, userType, isLoading } = useAuth(true);

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

      <GeneralFooter />
    </main>
  );
}
