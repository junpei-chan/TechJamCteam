'use client';

import { useEffect, useState } from 'react';
import { ShopDetail, ShopDetailRequest, ShopDetailResponse } from '@/api/shop/shopDetail';

interface ShopDetailComponentProps {
  shopId: string;
}

export default function ShopDetailComponent({ shopId }: ShopDetailComponentProps) {
  const [shop, setShop] = useState<ShopDetailRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopDetail = async () => {
      try {
        setLoading(true);
        const response: ShopDetailResponse = await ShopDetail(shopId);
        
        if (response.success) {
          setShop(response.shop);
        } else {
          setError(response.messages.join(', '));
        }
      } catch (err) {
        setError('店舗詳細の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetail();
  }, [shopId]);

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

  if (!shop) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">店舗が見つかりませんでした</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 店舗画像 */}
        {shop.image_path && (
          <div className="w-full h-64 bg-gray-200">
            <img
              src={shop.image_path}
              alt={shop.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="p-6">
          {/* 店舗名 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{shop.name}</h1>

          {/* 店舗説明 */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">店舗について</h2>
            <p className="text-gray-600 leading-relaxed">{shop.shop_detail}</p>
          </div>

          {/* 店舗情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 住所 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📍 住所</h3>
              <p className="text-gray-600">{shop.address}</p>
            </div>

            {/* 電話番号 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📞 電話番号</h3>
              <a 
                href={`tel:${shop.phone}`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {shop.phone}
              </a>
            </div>

            {/* ホームページ */}
            {shop.homepage_url && (
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">🌐 ホームページ</h3>
                <a 
                  href={shop.homepage_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors break-all"
                >
                  {shop.homepage_url}
                </a>
              </div>
            )}
          </div>

          {/* アクションボタン */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.open(`tel:${shop.phone}`, '_self')}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📞 電話をかける
            </button>
            
            {shop.homepage_url && (
              <button
                onClick={() => window.open(shop.homepage_url!, '_blank')}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🌐 ホームページを見る
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
