"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PersonalInfo() {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalAddress, setOriginalAddress] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    username: string;
    email: string;
    address?: string;
    phone?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const savedProfile = localStorage.getItem("userProfile");
        let user;
        
        if (savedProfile) {
          user = JSON.parse(savedProfile);
        } else {
          user = {
            id: 1,
            username: "サンプルユーザー",
            email: "user@example.com",
            address: "東京都",
            phone: "090-1234-5678"
          };
          localStorage.setItem("userProfile", JSON.stringify(user));
        }
        
        setCurrentUser(user);
        setEmail(user.email || "");
        setAddress(user.address || "");
        setPhone(user.phone || "");
        setOriginalEmail(user.email || "");
        setOriginalAddress(user.address || "");
        setOriginalPhone(user.phone || "");
      } catch (error) {
        console.error("Error loading user profile:", error);

        const defaultUser = {
          id: 1,
          username: "サンプルユーザー",
          email: "user@example.com",
          address: "東京都",
          phone: "090-1234-5678"
        };
        setCurrentUser(defaultUser);
        setEmail(defaultUser.email);
        setAddress(defaultUser.address || "");
        setPhone(defaultUser.phone || "");
        setOriginalEmail(defaultUser.email);
        setOriginalAddress(defaultUser.address || "");
        setOriginalPhone(defaultUser.phone || "");
      } finally {
        setInitializing(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    if (!currentUser) {
      return;
    }

    if (email === originalEmail && address === originalAddress && phone === originalPhone) {
      router.push("/profile");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updatedUser = {
        ...currentUser,
        email: email.trim(),
        address: address.trim(),
        phone: phone.trim()
      };
      
      localStorage.setItem("userProfile", JSON.stringify(updatedUser));
      
      console.log("個人情報が更新されました:", { email: email.trim(), address: address.trim(), phone: phone.trim() });
      router.push("/profile");
      
    } catch (error) {
      setError("個人情報の更新中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = email !== originalEmail || address !== originalAddress || phone !== originalPhone;

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
          <h1 className="text-normal font-medium text-center flex-1">個人情報の編集</h1>
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
        <h1 className="text-normal font-medium text-center flex-1">個人情報の編集</h1>
        <div className="w-10 h-10"></div>
      </header>

      <form className="flex flex-col items-center justify-center mt-24" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
          <div className="w-full">
            <label htmlFor="email" className="block text-sm font-medium mb-2">メールアドレス</label>
            <input 
              type="email" 
              id="email"
              className="border w-full rounded-lg py-3 px-4 bg-white"
              autoComplete="email"
              placeholder="メールアドレスを入力"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="w-full">
            <label htmlFor="address" className="block text-sm font-medium mb-2">住所</label>
            <input 
              type="text" 
              id="address"
              className="border w-full rounded-lg py-3 px-4 bg-white"
              autoComplete="address"
              placeholder="住所を入力"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="w-full">
            <label htmlFor="phone" className="block text-sm font-medium mb-2">電話番号</label>
            <input 
              type="tel" 
              id="phone"
              className="border w-full rounded-lg py-3 px-4 bg-white"
              autoComplete="tel"
              placeholder="電話番号を入力"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm w-full text-center">
              {error}
            </div>
          )}

          <button 
            type="button"
            onClick={handleSave}
            disabled={loading || (!email.trim() && !address.trim() && !phone.trim()) || !hasChanges}
            className={`
              w-full py-4 rounded-full shadow-bottom mt-24
              ${(hasChanges && !loading) ? "bg-main text-white" : "bg-[#EFEFEF] text-gray-500"}
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
