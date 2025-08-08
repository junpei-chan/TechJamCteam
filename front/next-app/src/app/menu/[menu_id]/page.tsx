"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MenuDetail, MenuDetailRequest } from "@/api/menu/menuDetail";
import { ShopDetail, ShopDetailRequest } from "@/api/shop/shopDetail";
import { MenuByShop } from "@/api/menu/menuByShop";
import { MenuIndexRequest } from "@/api/menu/menuIndex";
import { addMenuFavorite, removeMenuFavorite, checkMenuFavorite } from "@/api/favorites/menuFavorites";
import { Header } from "@/components/shared";
import { ConditionalFooter } from "@/components/shared";
import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";
import Link from "next/link";

export default function MenuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const menuId = params.menu_id as string;
  const [menu, setMenu] = useState<MenuDetailRequest | null>(null);
  const [shop, setShop] = useState<ShopDetailRequest | null>(null);
  const [shopMenus, setShopMenus] = useState<MenuIndexRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // TODO: 実際のユーザーIDを取得する仕組みを実装
  // 現在はテスト用に1を使用
  const userId = 1;

  const getImageSrc = (imageUrl: string) => {
    if (imageError) {
      return '/menu-default.jpg';
    }
    if (imageUrl && (imageUrl.startsWith('blob:') || imageUrl.startsWith('file:'))) {
      return '/menu-default.jpg';
    }
    if (imageUrl && imageUrl.startsWith('/static/')) {
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
      console.log('Generated image URL:', fullUrl);
      return fullUrl;
    }
    console.log('Using original image URL:', imageUrl);
    return imageUrl || '/menu-default.jpg';
  };

  const getMenuImageSrc = (imageUrl: string) => {
    console.log('Processing menu image URL:', imageUrl);
    
    if (!imageUrl) {
      console.log('No image URL provided, using default');
      return '/menu-default.jpg';
    }
    
    if (imageUrl && (imageUrl.startsWith('blob:') || imageUrl.startsWith('file:'))) {
      console.log('Blob or file URL detected, using default');
      return '/menu-default.jpg';
    }
    
    if (imageUrl && imageUrl.startsWith('/static/')) {
      const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${imageUrl}`;
      console.log('Static URL detected, full URL:', fullUrl);
      return fullUrl;
    }
    
    if (imageUrl && imageUrl.startsWith('http')) {
      console.log('HTTP URL detected:', imageUrl);
      return imageUrl;
    }
    
    console.log('Using original image URL:', imageUrl);
    return imageUrl || '/menu-default.jpg';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleMenuClick = (menuId: number) => {
    router.push(`/menu/${menuId}`);
  };

  const handleFavoriteClick = async () => {
    if (favoriteLoading || !menu) return;

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        // お気に入りから削除
        const response = await removeMenuFavorite(userId, parseInt(menuId));
        if (response.success) {
          setIsFavorite(false);
        }
      } else {
        // お気に入りに追加
        const response = await addMenuFavorite({
          user_id: userId,
          menu_id: parseInt(menuId)
        });
        if (response.success) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error("お気に入り操作に失敗しました:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      
      const response = await MenuDetail(menuId);

      if (response.success) {
        setMenu(response.menu);
        
        // お気に入り状態をチェック
        const favoriteCheck = await checkMenuFavorite(userId, parseInt(menuId));
        if (favoriteCheck.success) {
          setIsFavorite(favoriteCheck.isFavorite);
        }
        
        if (response.menu.shop_id) {
          const shopResponse = await ShopDetail(response.menu.shop_id.toString());
          if (shopResponse.success) {
            setShop(shopResponse.shop);
          }
          
          const shopMenusResponse = await MenuByShop(response.menu.shop_id, 4, response.menu.id);
          if (shopMenusResponse.success) {
            console.log('Shop menus response:', shopMenusResponse.items);
            setShopMenus(shopMenusResponse.items);
          }
        }
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
                <p className="text-normal font-semibold">¥{formatPrice(menu.price)}</p>
              </div>

              <div className="flex gap-5 justify-end">
                <button 
                  onClick={handleFavoriteClick}
                  disabled={favoriteLoading}
                  className={`transition-colors ${favoriteLoading ? 'opacity-50' : ''}`}
                >
                  <Image
                    src={
                      isFavorite ? "/icons/favorite-icon-selected.svg" : "/icons/favorite-icon.svg"
                    }
                    alt="お気に入り"
                    width={20}
                    height={20}
                    style={{
                      filter: isFavorite ? 'invert(31%) sepia(63%) saturate(2070%) hue-rotate(345deg) brightness(101%) contrast(95%)' : 'none'
                    }}
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
              
              {menu.tags && menu.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-end">
                  {menu.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-accent text-white px-2 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <div>
                  タグはありません
                </div>
              )}
            </div>
          </div>

          {menu.shop_id && shop && (
            <div className="px-6 py-4 mb-18">
              <h3 className="inline-block text-normal text-accent mb-3 border-b border-accent px-1">
                <Link href={`/shop/${menu.shop_id}`}>
                  {shop.name}
                </Link>
              </h3>
              <p className="text-small">[他のおすすめのメニュー]</p>
              {shopMenus.length > 0 ? (
                <div className="mt-4 pb-2">
                  <div 
                    className="flex gap-4 overflow-x-auto pb-2"
                    style={{ 
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#CBD5E0 #F7FAFC',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    {shopMenus.map((shopMenu) => (
                      <div
                        key={shopMenu.id}
                        onClick={() => handleMenuClick(shopMenu.id)}
                        className="cursor-pointer flex-shrink-0 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                      >
                        <Image
                          src={getMenuImageSrc(shopMenu.image_url)}
                          alt={shopMenu.name}
                          width={160}
                          height={120}
                          className="object-cover w-[160px] h-[120px] rounded-lg"
                          unoptimized
                          onError={(e) => {
                            console.log('Menu image error for:', shopMenu.name, shopMenu.image_url);
                            e.currentTarget.src = '/menu-default.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {shopMenus.length > 2 && (
                    <div className="flex justify-center mt-2">
                      <div className="text-xs text-gray-400">← スワイプして他のメニューを見る →</div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">他のメニューはありません</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500">メニューが見つかりませんでした</div>
        </div>
      )}

      <ConditionalFooter />
    </div>
  );
}