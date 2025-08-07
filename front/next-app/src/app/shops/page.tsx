import Link from 'next/link';
import ShopListComponent from '@/components/features/ShopList';

export default function ShopsPage() {
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
      
      <ShopListComponent />
    </main>
  );
}
