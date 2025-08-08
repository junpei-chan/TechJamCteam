'use client';

import { useParams } from 'next/navigation';
import { Header } from '@/components/shared';
import { GeneralFooter } from '@/components/shared';
import { ShopDetail, ShopDetailRequest } from "@/api/shop/shopDetail";
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ShopDetailPage() {
  const params = useParams();
  const shopId = params.id as string;
  const [shop, setShop] = useState<ShopDetailRequest | null>(null);

  useEffect(() => {
    const fetchShopDetail = async () => {
      const response = await ShopDetail(shopId);

      if (response.success) {
        setShop(response.shop);
      }
    }
    fetchShopDetail();
  }, [shopId]);

  if (!shopId) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">店舗IDが指定されていません</div>
      </div>
    );
  }

  return (
    <main>
      <Header />

      <div className="mt-24 px-6">
        <Image 
          src={shop?.image_path || '/shop-default.jpg'}
          alt="店舗画像"
          width={350}
          height={200}
          className="object-cover w-[350px] h-[200px]"
        />

        <h1 className="text-large my-1 mx-1">{shop?.name}</h1>

        <div className="flex gap-5 justify-end mx-1">
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

        <div className="text-center text-normal my-10">
          <p>{shop?.shop_detail}</p>
        </div>

        <div className="mb-26">
          {shop?.address && (
            <div className="mb-6">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(shop.address)}&output=embed`}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-[295px] h-[177px] rounded-lg mx-auto"
              />
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image 
                src="/icons/pin-icon.svg"
                alt="住所"
                width={16}
                height={16}
              />
              <span className="text-sm">{shop?.address}</span>
            </div>
            {shop?.homepage_url && (
              <a 
                href={shop.homepage_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Image 
                  src="/icons/link-icon.svg"
                  alt="ホームページのリンク"
                  width={16}
                  height={16}
                />
                <span className="text-sm text-blue-600 hover:underline">ホームページ</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <GeneralFooter />
    </main>
  );
}
