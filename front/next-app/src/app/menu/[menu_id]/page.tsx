"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MenuDetail, MenuDetailRequest } from "@/api/menu/menuDetail";
import { ShopDetail, ShopDetailRequest } from "@/api/shop/shopDetail";
import { MenuByShop, MenuByShopResponse } from "@/api/menu/menuByShop";
import { MenuIndexRequest } from "@/api/menu/menuIndex";
import { Header } from "@/components/shared";
import { GeneralFooter } from "@/components/shared";
import Image from "next/image";

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

  const handleShopClick = () => {
    if (menu?.shop_id) {
      router.push(`/shop/${menu.shop_id}`);
    }
  };

  const handleMenuClick = (menuId: number) => {
    router.push(`/menu/${menuId}`);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      
      const response = await MenuDetail(menuId);

      if (response.success) {
        setMenu(response.menu);
        
        // メニュー取得後、店舗情報も取得
        if (response.menu.shop_id) {
          const shopResponse = await ShopDetail(response.menu.shop_id.toString());
          if (shopResponse.success) {
            setShop(shopResponse.shop);
          }
          
          // 店舗の他のメニューも取得（現在のメニューを除外）
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
              <h3 className="text-normal mb-3">{shop.name}</h3>
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
                  
                  {/* スクロールヒント */}
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

      <GeneralFooter />
    </div>
  )
}