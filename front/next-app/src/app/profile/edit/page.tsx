"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Edit() {
  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    username: string;
    email: string;
    address?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // 現在のユーザー情報を取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // ローカルストレージから既存のユーザー情報を取得
        const savedProfile = localStorage.getItem("userProfile");
        let user;
        
        if (savedProfile) {
          user = JSON.parse(savedProfile);
        } else {
          // デフォルトのユーザー情報を設定
          user = {
            id: 1,
            username: "サンプルユーザー",
            email: "user@example.com",
            address: "東京都"
          };
          // 初回設定時にローカルストレージに保存
          localStorage.setItem("userProfile", JSON.stringify(user));
        }
        
        setCurrentUser(user);
        setUsername(user.username);
        setOriginalUsername(user.username);
      } catch (error) {
        console.error("Error loading user profile:", error);
        // エラーの場合はデフォルト値を設定
        const defaultUser = {
          id: 1,
          username: "サンプルユーザー",
          email: "user@example.com",
          address: "東京都"
        };
        setCurrentUser(defaultUser);
        setUsername(defaultUser.username);
        setOriginalUsername(defaultUser.username);
      } finally {
        setInitializing(false);
      }
    };

    fetchUserProfile();
  }, []); // 依存配列を空にして初回のみ実行

  const handleSave = async () => {
    if (!currentUser || !username.trim()) {
      return;
    }

    // 変更がない場合は何もしない
    if (username === originalUsername) {
      router.push("/profile");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ローカルストレージに保存（デモ用）
      const updatedUser = {
        ...currentUser,
        username: username.trim()
      };
      
      localStorage.setItem("userProfile", JSON.stringify(updatedUser));
      
      // 成功メッセージを表示してプロフィールページに戻る
      console.log("ユーザー名が更新されました:", username.trim());
      router.push("/profile");
      
    } catch (error) {
      setError("ユーザー名の更新中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // 初期化中の表示
  if (initializing) {
    return (
      <main>
        <header className="flex items-center justify-between px-4 pt-4 h-[92px] bg-base shadow-md">
          <Link href="/profile" className="flex items-center justify-center w-10">
            <Image
              src="/icons/close-icon.svg"
              alt="close-icon"
              width={20}
              height={20}
            />
          </Link>
          <h1 className="text-normal font-medium text-center flex-1">プロフィールの編集</h1>
          <div className="w-10 h-10"></div>
        </header>
        <div className="flex items-center justify-center mt-48">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="flex items-center justify-between px-4 pt-4 h-[92px] bg-base shadow-md">
        <Link href="/profile" className="flex items-center justify-center w-10">
          <Image
            src="/icons/close-icon.svg"
            alt="close-icon"
            width={20}
            height={20}
          />
        </Link>
        <h1 className="text-normal font-medium text-center flex-1">プロフィールの編集</h1>
        <div className="w-10 h-10"></div>
      </header>

      <form className="flex flex-col items-center justify-center mt-48" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col items-center gap-4">
          <label htmlFor="username" className="w-full px-2">新しいユーザー名を入力</label>
          <input 
            type="text" 
            id="username"
            className="border w-[350px] rounded-lg py-3 px-4 bg-white"
            autoComplete="off"
            placeholder="ユーザー名を入力"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />

          {error && (
            <div className="text-red-500 text-sm w-[350px] text-center">
              {error}
            </div>
          )}

          <button 
            type="button"
            onClick={handleSave}
            disabled={loading || !username.trim() || username === originalUsername}
            className={`
              w-[350px] py-4 rounded-full shadow-bottom mt-48
              ${(username.length > 0 && username !== originalUsername && !loading) ? "bg-main text-white" : "bg-[#EFEFEF] text-gray-500"}
              ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {loading ? "保存中..." : "変更を保存"}
          </button>
        </div>
      </form>
    </main>
  );
}