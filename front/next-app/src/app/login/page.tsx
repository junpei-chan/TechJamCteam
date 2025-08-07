"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authLogin } from "@/api/auth/authLogin";
import { shopLogin } from "@/api/auth/shopLogin";
import Cookies from "js-cookie";

export default function Login() {
  const [errors, setErrors] = useState<string[]>([]);
  const [userType, setUserType] = useState<'user' | 'shop'>('user');
  const [formValues, setFormValues] = useState({
    email: "",
    username: "",
    password: ""
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserType(e.target.value as 'user' | 'shop');
    setErrors([]);
    setFormValues({ email: "", username: "", password: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    
    if (userType === 'shop') {
      // 店舗ユーザーログイン
      const response = await shopLogin({
        request: {
          username: formValues.username,
          password: formValues.password
        }
      });
      
      if (response.success && "access_token" in response && response.access_token) {
        Cookies.set("authToken", String(response.access_token), { expires: 7 });
        Cookies.set("userType", "shop", { expires: 7 });
        router.push("/");
      } else {
        setErrors(
          typeof response.messages === "string"
            ? [response.messages]
            : Array.isArray(response.messages)
              ? response.messages
              : []
        );
      }
    } else {
      // 一般ユーザーログイン
      const response = await authLogin({
        request: {
          email: formValues.email,
          password: formValues.password
        }
      });
      
      if (response.success && "access_token" in response && response.access_token) {
        Cookies.set("authToken", String(response.access_token), { expires: 7 });
        Cookies.set("userType", "user", { expires: 7 });
        router.push("/");
      } else {
        setErrors(
          typeof response.messages === "string"
            ? [response.messages]
            : Array.isArray(response.messages)
              ? response.messages
              : []
        );
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">ログイン</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
              ユーザータイプ
            </label>
            <select
              id="userType"
              name="userType"
              value={userType}
              onChange={handleUserTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">一般ユーザー</option>
              <option value="shop">店舗ユーザー</option>
            </select>
          </div>

          {userType === 'user' ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                ユーザー名
              </label>
              <input 
                type="text" 
                id="username"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input 
              type="password" 
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ログイン
          </button>
        </form>

        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでないですか？{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              一般ユーザー登録
            </a>
            {" "}または{" "}
            <a href="/register/shop" className="text-blue-600 hover:underline">
              店舗登録
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}