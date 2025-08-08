"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MenuDetail } from "@/api/menu/menuDetail";
import { MenuDetailRequest } from "@/api/menu/menuDetail";
import { Header } from "@/components/shared";
import Image from "next/image";

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
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
      console.log('Generated image URL:', fullUrl); // デバッグ用
      return fullUrl;
    }
    console.log('Using original image URL:', imageUrl); // デバッグ用
    return imageUrl || '/menu-default.jpg';
  };

  const handleImageError = () => {
    setImageError(true);
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
    <div className="container mx-auto px-4 py-8">

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center p-8">
          <div className="text-red-500">エラー: {error}</div>
        </div>
      ) : menu ? (
        <div className="mt-20">
          <Header />
          
          <div className="flex flex-col items-center space-y-6 p-6">
            <div className="relative">
              {imageError ? (
                <img 
                  src="/menu-default.jpg"
                  alt={menu.name}
                  width={350}
                  height={200}
                  className="object-cover w-[350px] h-[200px] rounded-md"
                />
              ) : (
                <Image 
                  src={menu.image_url ? getImageSrc(menu.image_url) : '/menu-default.jpg'}
                  alt={menu.name}
                  width={350}
                  height={200}
                  onError={handleImageError}
                  className="object-cover w-[350px] h-[200px] rounded-md"
                  unoptimized
                />
              )}
            </div>
            
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h1 className="text-large font-bold">{menu.name}</h1>
                <p className="text-normal font-semibold">¥{menu.price}</p>
              </div>

              <div className="flex gap-5 justify-end">
                <button>
                  <Image
                    src="/icons/favorite-icon.svg"
                    alt="お気に入り"
                    width={20}
                    height={20}
                  />
                </button>
                <button>
                  <Image
                    src="/icons/send-icon.svg"
                    alt="共有"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              
              {menu.description && (
                <p className="text-gray-600 text-small leading-6 break-words whitespace-normal">
                  {menu.description}
                </p>
              )}
              
              {menu.shop_id && (
                <div>
                  {/* 店舗詳細を見る */}
                </div>
              )}
              
              {menu.tags && menu.tags.length > 0 ? (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">タグ</p>
                  <div className="flex flex-wrap gap-2">
                    {menu.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  タグはありません
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500">メニューが見つかりませんでした</div>
        </div>
      )}
    </div>
  )
}