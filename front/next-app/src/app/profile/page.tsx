"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, GeneralFooter } from "@/components/shared";
import Image from "next/image";
import Link from "next/link";

type UserProfile = {
  id: number;
  username: string;
  email: string;
  address?: string;
};

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const loadProfile = () => {
      try {
        // ローカルストレージからユーザー情報を取得
        const savedProfile = localStorage.getItem("userProfile");
        
        if (savedProfile) {
          const userData = JSON.parse(savedProfile);
          setUser(userData);
        } else {
          // デフォルトのユーザー情報を設定
          const defaultUser = {
            id: 1,
            username: "サンプルユーザー",
            email: "user@example.com",
            address: "東京都"
          };
          setUser(defaultUser);
          localStorage.setItem("userProfile", JSON.stringify(defaultUser));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        // エラーの場合はデフォルト値を設定
        const defaultUser = {
          id: 1,
          username: "サンプルユーザー",
          email: "user@example.com",
          address: "東京都"
        };
        setUser(defaultUser);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();

    // ページがフォーカスされた時（編集ページから戻った時など）に再読み込み
    const handleFocus = () => {
      loadProfile();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (profileLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">プロフィールを読み込み中...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">ユーザー情報が見つかりません</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Header />

      <div className="flex flex-col my-32">
        <div className="flex flex-col justify-center items-center gap-4 mx-auto">
          <Image
            src="/icons/circle-icon.svg"
            alt="circle-icon"
            width={72}
            height={72}
          />
          <h1 className="text-large">{user.username}</h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-7 mt-18">
          <Link href="/profile/edit" className="flex justify-center items-center gap-14 w-[315px] h-19 py-7 px-8 mx-auto border border-black-30 rounded-full">
            <Image 
              src="/icons/user-icon.svg"
              alt="user-icon"
              width={24}
              height={24}
            />
            <span className="whitespace-nowrap">プロフィール</span>
            <Image 
              src="/icons/right-arrow-icon.svg"
              alt="right-arrow-icon"
              width={24}
              height={24}
            />
          </Link>
          <Link href="/profile/edit" className="flex justify-center items-center gap-14 w-[315px] h-19 py-7 px-8 mx-auto border border-black-30 rounded-full">
            <Image 
              src="/icons/settings-icon.svg"
              alt="settings-icon"
              width={24}
              height={24}
            />
            <span className="whitespace-nowrap">個人の情報</span>
            <Image 
              src="/icons/right-arrow-icon.svg"
              alt="right-arrow-icon"
              width={24}
              height={24}
            />
          </Link>
          <Link href="/favorite" className="flex justify-center items-center gap-14 w-[315px] h-19 py-7 px-8 mx-auto border border-black-30 rounded-full">
            <Image 
              src="/icons/favorite-icon.svg"
              alt="favorite-icon"
              width={24}
              height={24}
            />
            <span className="whitespace-nowrap">お気に入り</span>
            <Image 
              src="/icons/right-arrow-icon.svg"
              alt="right-arrow-icon"
              width={24}
              height={24}
            />
          </Link>
        </div>
      </div>

      <GeneralFooter />
    </main>
  );
}