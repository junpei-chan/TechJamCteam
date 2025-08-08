"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MenuDetail } from "@/api/menu/menuDetail";
import { MenuDetailRequest } from "@/api/menu/menuDetail";
import Link from "next/link";

export default function MenuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const menuId = params.menu_id as string;
  const [menu, setMenu] = useState<MenuDetailRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const getImageSrc = (imageUrl: string) => {
    if (imageError) {
      return '/menu-default.jpg';
    }
    // blob URLやローカルURLの場合はデフォルト画像を使用
    if (imageUrl && (imageUrl.startsWith('blob:') || imageUrl.startsWith('file:'))) {
      return '/menu-default.jpg';
    }
    // バックエンドの静的画像URLの場合、完全なURLを構築
    if (imageUrl && imageUrl.startsWith('/static/')) {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
    }
    return imageUrl || '/menu-default.jpg';
  };

  const handleShopClick = () => {
    if (menu?.shop_id) {
      router.push(`/shop/${menu.shop_id}`);
    }
  };

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      
      const response = await MenuDetail(menuId);

      if (response.success) {
        setMenu(response.menu);
      } else {
        setError(response.messages.join(", "));
      }
      setLoading(false);
    };
    
    if (menuId) {
      fetchMenu();
    }
  }, [menuId]);
  return (
    <main className="container mx-auto px-4 py-8">
      {/* ナビゲーション */}
      <nav className="bg-blue-600 text-white p-4 mb-8 rounded-lg">
        <div className="flex flex-wrap gap-4">
          <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
            メニュー一覧
          </Link>
          <Link href="/shops" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
            店舗一覧
          </Link>
          <Link href="/post" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">
            メニュー投稿
          </Link>
        </div>
      </nav>

      <h1 className="text-3xl font-bold text-center mb-8">メニュー詳細</h1>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center p-8">
          <div className="text-red-500">エラー: {error}</div>
        </div>
      ) : menu ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
          {/* メニュー画像 */}
          <div className="relative h-64 bg-gray-200">
            <img
              src={getImageSrc(menu.image_url)}
              alt={menu.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>

          <div className="p-6">
            {/* メニュー名 */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{menu.name}</h2>

            {/* メニュー説明 */}
            <p className="text-gray-600 mb-4 leading-relaxed">{menu.description}</p>

            {/* 価格 */}
            <div className="mb-4">
              <span className="text-3xl font-bold text-blue-600">¥{menu.price.toLocaleString()}</span>
            </div>

            {/* メニュー情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {menu.category && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">カテゴリ</h3>
                  <p className="text-gray-600">{menu.category}</p>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">利用可否</h3>
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  menu.is_available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {menu.is_available ? '利用可能' : '利用不可'}
                </span>
              </div>
            </div>

            {/* 店舗詳細へのボタン */}
            <div className="border-t pt-4">
              <button
                onClick={handleShopClick}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <span className="mr-2">🏪</span>
                この店舗の詳細を見る
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500">メニューが見つかりませんでした</div>
        </div>
      )}
    </main>
  )
}