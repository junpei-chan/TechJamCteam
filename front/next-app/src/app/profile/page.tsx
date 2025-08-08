"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, UserProfile } from "../../api/auth/getUserProfile";
import { useAuth, useLogout } from "../../hooks/useAuth";
import { Header, GeneralFooter } from "@/components/shared";
import Image from "next/image";
import Link from "next/link";

export default function Profile() {
  const router = useRouter();
  const { isAuthenticated, userType, token, isLoading } = useAuth(true);
  const logout = useLogout();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || userType === "shop") {
        if (userType === "shop") {
          setError("このページは一般ユーザー専用です");
        }
        return;
      }

      setProfileLoading(true);
      try {
        const result = await getUserProfile(token);
        
        if (result.success) {
          setUser(result.user);
        } else {
          setError(result.messages.join(", "));
          if (result.messages.some(msg => msg.includes("認証") || msg.includes("unauthorized"))) {
            logout();
          }
        }
      } catch (err) {
        setError("プロフィール情報の取得中にエラーが発生しました");
      } finally {
        setProfileLoading(false);
      }
    };

    if (!isLoading && isAuthenticated) {
      fetchProfile();
    }
  }, [isLoading, isAuthenticated, token, userType]); // logoutを依存配列から削除

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

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">エラー</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            ログインページへ
          </button>
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
          <h1 className="text-large">ユーザー名</h1>
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