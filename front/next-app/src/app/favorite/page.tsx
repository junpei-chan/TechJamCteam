"use client";

import { useState, useEffect } from "react";
import { ConditionalFooter } from "@/components/shared";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { getUserMenuFavorites, MenuFavoriteWithDetails } from "@/api/favorites/menuFavorites";
import { getUserShopFavorites, ShopDetails } from "@/api/favorites/shopFavorites";
import { formatPrice } from "@/utils/formatPrice";

export default function Favorite() {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'menu' | 'shop'>('menu');
  const [menuFavorites, setMenuFavorites] = useState<MenuFavoriteWithDetails[]>([]);
  const [shopFavorites, setShopFavorites] = useState<ShopDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || isLoading) return;
      
      setLoading(true);
      setError(null);

      try {
        // TODO: 実際のユーザーIDを取得する仕組みを実装
        // 現在はテスト用に1を使用
        const userId = 1;

        // メニューお気に入りを取得
        const menuResponse = await getUserMenuFavorites(userId);
        if (menuResponse.success) {
          setMenuFavorites(menuResponse.favorites);
        } else {
          console.error("Failed to fetch menu favorites:", menuResponse.messages);
        }

        const shopResponse = await getUserShopFavorites(userId);
        if (shopResponse.success) {
          setShopFavorites(shopResponse.shops);
        } else {
          console.error("Failed to fetch shop favorites:", shopResponse.messages);
        }

      } catch (err) {
        setError("お気に入りデータの取得に失敗しました");
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, isLoading]);

  const getImageSrc = (imageUrl: string | undefined, defaultImage: string) => {
    if (!imageUrl) return defaultImage;
    if (imageUrl.startsWith('/static/')) {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
    }
    return imageUrl;
  };

  if (isLoading || loading) {
    return (
      <main>
        <header className="flex items-center justify-between px-4 pt-4 h-[92px] bg-base shadow-md">
          <Link href="/" className="flex items-center justify-center w-10">
            <Image
              src="/icons/close-icon.svg"
              alt="close-icon"
              width={20}
              height={20}
            />
          </Link>
          <h1 className="text-normal font-medium text-center flex-1">お気に入り</h1>
          <div className="w-10 h-10"></div>
        </header>
        
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500">読み込み中...</div>
        </div>
        
        <ConditionalFooter />
      </main>
    );
  }

  return (
    <main>
      <header className="flex items-center justify-between px-4 pt-4 h-[92px] bg-base shadow-md">
        <Link href="/" className="flex items-center justify-center w-10">
          <Image
            src="/icons/close-icon.svg"
            alt="close-icon"
            width={20}
            height={20}
          />
        </Link>
        <h1 className="text-normal font-medium text-center flex-1">お気に入り</h1>
        <div className="w-10 h-10"></div>
      </header>

      <div className="flex border-b border-gray-200 bg-white mt-20">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'menu'
              ? 'text-accent border-b-2 border-accent'
              : 'text-gray-500'
          }`}
        >
          メニュー ({menuFavorites.length})
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'shop'
              ? 'text-accent border-b-2 border-accent'
              : 'text-gray-500'
          }`}
        >
          店舗 ({shopFavorites.length})
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 mx-4 mt-4 rounded">
          {error}
        </div>
      )}

      <div className="px-4 py-6 pb-24">
        {activeTab === 'menu' ? (
          <div>
            {menuFavorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Image
                    src="/icons/favorite-icon.svg"
                    alt="お気に入り"
                    width={48}
                    height={48}
                    className="mx-auto opacity-50"
                  />
                </div>
                <p className="text-gray-500">お気に入りのメニューがありません</p>
                <Link
                  href="/"
                  className="inline-block mt-4 text-accent underline"
                >
                  メニューを探す
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {menuFavorites.map((favorite) => (
                  <Link
                    key={`${favorite.user_id}-${favorite.menu_id}`}
                    href={`/menu/${favorite.menu_id}`}
                    className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex p-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={getImageSrc(favorite.menu?.image_url, '/menu-default.jpg')}
                          alt={favorite.menu?.name || 'メニュー画像'}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-md"
                          unoptimized
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {favorite.menu?.name || 'メニュー名不明'}
                        </h3>
                        <p className="text-accent font-semibold mb-2">
                          ¥{favorite.menu?.price ? formatPrice(favorite.menu.price) : '---'}
                        </p>
                        {favorite.menu?.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {favorite.menu.description}
                          </p>
                        )}
                        {favorite.menu?.tags && favorite.menu.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {favorite.menu.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-accent text-white px-2 py-1 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {favorite.menu.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{favorite.menu.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {shopFavorites.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Image
                    src="/icons/favorite-icon.svg"
                    alt="お気に入り"
                    width={48}
                    height={48}
                    className="mx-auto opacity-50"
                  />
                </div>
                <p className="text-gray-500">お気に入りの店舗がありません</p>
                <Link
                  href="/"
                  className="inline-block mt-4 text-accent underline"
                >
                  店舗を探す
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {shopFavorites.map((shop) => (
                  <Link
                    key={shop.id}
                    href={`/shop/${shop.id}`}
                    className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex p-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={getImageSrc(shop.image_url, '/shop-default.jpg')}
                          alt={shop.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-md"
                          unoptimized
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {shop.name}
                        </h3>
                        {shop.address && (
                          <p className="text-sm text-gray-600 mb-2">
                            📍 {shop.address}
                          </p>
                        )}
                        {shop.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {shop.description}
                          </p>
                        )}
                        {shop.phone && (
                          <p className="text-sm text-gray-500 mt-1">
                            📞 {shop.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ConditionalFooter />
    </main>
  );
}