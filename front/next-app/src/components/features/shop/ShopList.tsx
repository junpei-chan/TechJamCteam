'use client';

import { useEffect, useState } from 'react';
import { ShopList, ShopListItem, ShopListResponse } from '@/api/shop/shopList';
import { useRouter } from 'next/navigation';

export default function ShopListComponent() {
  const [shops, setShops] = useState<ShopListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response: ShopListResponse = await ShopList();
        
        if (response.success) {
          setShops(response.shops);
        } else {
          setError(response.messages.join(', '));
        }
      } catch (err) {
        setError('店舗一覧の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const handleShopClick = (shopId: number) => {
    router.push(`/shop/${shopId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">店舗が見つかりませんでした</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">店舗一覧</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <div 
            key={shop.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleShopClick(shop.id)}
          >
            {/* 店舗画像 */}
            <div className="relative h-48 bg-gray-200">
              {shop.image_path ? (
                <img
                  src={shop.image_path}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-4xl">🏪</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
              <p className="text-gray-600 mb-3 line-clamp-2">{shop.shop_detail}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">📍</span>
                  <span className="truncate">{shop.address}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">📞</span>
                  <span>{shop.phone}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                  詳細を見る
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
