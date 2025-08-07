'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import ShopDetailComponent from '@/components/features/shop/ShopDetail';

export default function ShopDetailPage() {
  const params = useParams();
  const shopId = params.id as string;

  if (!shopId) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">店舗IDが指定されていません</div>
      </div>
    );
  }

  return (
    <main>
      {/* ナビゲーション */}
      <nav className="bg-blue-600 text-white p-4 mb-8">
        <div className="container mx-auto flex flex-wrap gap-4">
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
      
      <ShopDetailComponent shopId={shopId} />
    </main>
  );
}
