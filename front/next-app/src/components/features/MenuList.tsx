'use client';

import { useEffect, useState } from 'react';
import { MenuIndex, MenuIndexRequest, MenuIndexResponse } from '@/api/menu/menuIndex';
import { menuDelete } from '@/api/menu/menuDelete';
import { useRouter } from 'next/navigation';

export default function MenuList() {
  const [menus, setMenus] = useState<MenuIndexRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [deletingMenuId, setDeletingMenuId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<MenuIndexRequest | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response: MenuIndexResponse = await MenuIndex();
        
        if (response.success) {
          setMenus(response.items);
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
  }, []);

  const handleImageError = (menuId: number) => {
    setImageErrors(prev => new Set(prev.add(menuId)));
  };

  const getImageSrc = (menu: MenuIndexRequest) => {
    if (imageErrors.has(menu.id)) {
      return '/menu-default.png';
    }
    // blob URLやローカルURLの場合はデフォルト画像を使用
    if (menu.image_url && (menu.image_url.startsWith('blob:') || menu.image_url.startsWith('file:'))) {
      return '/menu-default.png';
    }
    
    // バックエンドの静的画像URLの場合、完全なURLを構築
    if (menu.image_url && menu.image_url.startsWith('/static/')) {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}${menu.image_url}`;
    }
    
    return menu.image_url || '/menu-default.png';
  };

  const handleDeleteClick = (menu: MenuIndexRequest) => {
    setMenuToDelete(menu);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!menuToDelete) return;

    setDeletingMenuId(menuToDelete.id);
    try {
      const response = await menuDelete(menuToDelete.id);
      
      if (response.success) {
        // メニューリストから削除されたメニューを除外
        setMenus(prevMenus => prevMenus.filter(menu => menu.id !== menuToDelete.id));
        setShowDeleteModal(false);
        setMenuToDelete(null);
      } else {
        setError(response.messages.join(', '));
      }
    } catch (err) {
      setError('メニューの削除に失敗しました');
    } finally {
      setDeletingMenuId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setMenuToDelete(null);
  };

  const handleMenuClick = (menuId: number) => {
    router.push(`/menu/${menuId}`);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">メニュー一覧</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div 
            key={menu.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleMenuClick(menu.id)}
          >
            {/* 削除ボタン */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // カードクリックイベントを防ぐ
                handleDeleteClick(menu);
              }}
              disabled={deletingMenuId === menu.id}
              className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors"
              title="メニューを削除"
            >
              {deletingMenuId === menu.id ? '...' : '×'}
            </button>

            <div className="relative h-48">
              {/* Next.js Imageの代わりに通常のimgタグを使用 */}
              <img
                src={getImageSrc(menu)}
                alt={menu.name}
                className="w-full h-full object-cover"
                onError={() => handleImageError(menu.id)}
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{menu.name}</h3>
              <p className="text-gray-600 mb-3 line-clamp-2">{menu.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  ¥{menu.price.toLocaleString()}
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  menu.is_available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {menu.is_available ? '利用可能' : '利用不可'}
                </span>
              </div>
              
              {menu.category && (
                <div className="mt-2">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {menu.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 削除確認モーダル */}
      {showDeleteModal && menuToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">メニュー削除の確認</h2>
            <p className="text-gray-600 mb-4">
              「{menuToDelete.name}」を削除しますか？
            </p>
            <p className="text-sm text-red-600 mb-6">
              この操作は取り消すことができません。
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deletingMenuId !== null}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingMenuId !== null}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {deletingMenuId !== null ? '削除中...' : '削除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
