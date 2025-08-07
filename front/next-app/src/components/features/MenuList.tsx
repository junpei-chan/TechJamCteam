'use client';

import { useEffect, useState } from 'react';
import { MenuIndex, MenuIndexRequest, MenuIndexResponse } from '@/api/menu/menuIndex';
import Image from 'next/image';

export default function MenuList() {
  const [menus, setMenus] = useState<MenuIndexRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <div key={menu.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={menu.image_url || '/menu-default.png'}
                alt={menu.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
    </div>
  );
}
