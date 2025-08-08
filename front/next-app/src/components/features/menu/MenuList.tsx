'use client';

import { useEffect, useState } from 'react';
import { MenuIndex, MenuIndexRequest, MenuIndexResponse } from '@/api/menu/menuIndex';
import { MenuItem } from './MenuItem';
import { menuDelete } from '@/api/menu/menuDelete';
import { useRouter } from 'next/navigation';

export function MenuList() {
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
    <div className="container mx-auto px-4 py-4 mt-[182px] mb-18">      
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <MenuItem 
            key={menu.id}
            image_url={menu.image_url || '/menu-default.jpg'}
            name={menu.name}
            price={menu.price}
          />
        ))}
      </div>
    </div>
  );
}
