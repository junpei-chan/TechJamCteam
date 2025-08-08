'use client';

import { useEffect, useState } from 'react';
import { MenuIndex, MenuIndexRequest, MenuIndexResponse } from '@/api/menu/menuIndex';
import { MenuItem } from './MenuItem';
import { useRouter } from 'next/navigation';

export function MenuList() {
  const [menus, setMenus] = useState<MenuIndexRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const response: MenuIndexResponse = await MenuIndex(currentPage, perPage);
        
        if (response.success) {
          setMenus(response.items);
          setTotalItems(response.total);
        } else {
          setError(response.messages.join(', '));
        }
      } catch (err) {
        setError('メニューの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [currentPage, perPage]);

  const getImageSrc = (menu: MenuIndexRequest) => {
    if (imageErrors.has(menu.id)) {
      return '/menu-default.jpg';
    }
    // blob URLやローカルURLの場合はデフォルト画像を使用
    if (menu.image_url && (menu.image_url.startsWith('blob:') || menu.image_url.startsWith('file:'))) {
      return '/menu-default.jpg';
    }
    
    // バックエンドの静的画像URLの場合、完全なURLを構築
    if (menu.image_url && menu.image_url.startsWith('/static/')) {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}${menu.image_url}`;
    }
    
    return menu.image_url || '/menu-default.jpg';
  };

  const handleMenuClick = (menuId: number) => {
    router.push(`/menu/${menuId}`);
  };

  const totalPages = Math.ceil(totalItems / perPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 前へボタン
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 mx-1 bg-accent text-white rounded hover:bg-blue-600 transition-colors"
        >
          前へ
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded transition-colors ${
            i === currentPage
              ? 'bg-accent text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 mx-1 bg-accent text-white rounded hover:bg-blue-600 transition-colors"
        >
          次へ
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-8 mb-4">
        <div className="flex items-center">
          {pages}
        </div>
        <div className="ml-4 text-sm text-gray-600">
          {totalItems}件中 {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, totalItems)}件表示
        </div>
      </div>
    );
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

  if (menus.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">メニューが見つかりませんでした</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 mt-[182px] mb-18">      
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div key={menu.id} className="relative">
            <div 
              onClick={() => handleMenuClick(menu.id)}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <MenuItem 
                image_url={getImageSrc(menu)}
                name={menu.name}
                price={menu.price}
              />
            </div>
          </div>
        ))}
      </div>
      
      {renderPagination()}
    </div>
  );
}
