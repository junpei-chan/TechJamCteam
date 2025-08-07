"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShopSignup, ShopSignupRequest } from "../../../api/auth/shopRegister";

export default function ShopRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState<ShopSignupRequest>({
    shop_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",
    phone: "",
    homepage_url: "",
    shop_detail: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // パスワード確認
    if (formData.password !== formData.confirm_password) {
      setError("パスワードが一致しません");
      setLoading(false);
      return;
    }

    // 必須項目の検証
    if (!formData.shop_name || !formData.username || !formData.email || !formData.password || !formData.address) {
      setError("必須項目をすべて入力してください");
      setLoading(false);
      return;
    }

    try {
      const result = await ShopSignup({ request: formData });
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(Array.isArray(result.messages) ? result.messages.join(", ") : result.messages);
      }
    } catch (err) {
      setError("登録処理中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">店舗登録完了</h2>
          <p className="text-gray-600">店舗とアカウントの登録が完了しました。ログインページに移動します...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">店舗登録</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="shop_name" className="block text-sm font-medium text-gray-700 mb-1">
                店舗名 <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="shop_name"
                name="shop_name"
                value={formData.shop_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                ユーザー名 <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード <span className="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワードの確認 <span className="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              住所 <span className="text-red-500">*</span>
            </label>
            <select 
              name="address" 
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">選択してください</option>
              <option value="愛知県">愛知県</option>
              <option value="岐阜県">岐阜県</option>
              <option value="三重県">三重県</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              電話番号
            </label>
            <input 
              type="tel" 
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="例: 03-1234-5678"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="homepage_url" className="block text-sm font-medium text-gray-700 mb-1">
              ホームページURL
            </label>
            <input 
              type="url" 
              id="homepage_url"
              name="homepage_url"
              value={formData.homepage_url}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="shop_detail" className="block text-sm font-medium text-gray-700 mb-1">
              店舗詳細
            </label>
            <textarea 
              id="shop_detail"
              name="shop_detail"
              value={formData.shop_detail}
              onChange={handleInputChange}
              rows={3}
              placeholder="店舗の詳細情報を入力してください"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "登録中..." : "店舗を登録"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            一般ユーザーとして登録する場合は{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              こちら
            </a>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            既にアカウントをお持ちですか？{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              ログイン
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}