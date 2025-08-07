"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, UserProfile } from "../../api/auth/getUserProfile";
import Cookies from "js-cookie";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("authToken");
        const userType = Cookies.get("userType");

        if (!token) {
          router.push("/login");
          return;
        }

        if (userType === "shop") {
          // 店舗ユーザーの場合は店舗プロフィールページにリダイレクト
          // 今回は一般ユーザーのプロフィールなので、エラー表示
          setError("このページは一般ユーザー専用です");
          setLoading(false);
          return;
        }

        const result = await getUserProfile(token);
        
        if (result.success) {
          setUser(result.user);
        } else {
          setError(result.messages.join(", "));
          // 認証エラーの場合はログインページへリダイレクト
          if (result.messages.some(msg => msg.includes("認証") || msg.includes("unauthorized"))) {
            router.push("/login");
          }
        }
      } catch (err) {
        setError("プロフィール情報の取得中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userType");
    router.push("/login");
  };

  if (loading) {
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
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">プロフィール</h1>
                <p className="text-blue-100 mt-1">一般ユーザー</p>
              </div>
              <div className="text-right">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>

          {/* ユーザー情報 */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ユーザーID
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                    #{user.id}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ユーザー名
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                    {user.username}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    住所
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                    {user.address || "未設定"}
                  </div>
                </div>
              </div>

              {/* アクション */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">アカウント情報</h3>
                  <p className="text-blue-600 text-sm mb-4">
                    プロフィール情報の編集やパスワードの変更は今後実装予定です。
                  </p>
                  <div className="space-y-2">
                    <button
                      className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
                      disabled
                    >
                      プロフィール編集（未実装）
                    </button>
                    <button
                      className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
                      disabled
                    >
                      パスワード変更（未実装）
                    </button>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">機能</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => router.push("/")}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      ホームに戻る
                    </button>
                    <button
                      onClick={() => router.push("/menu")}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      メニューを見る
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}