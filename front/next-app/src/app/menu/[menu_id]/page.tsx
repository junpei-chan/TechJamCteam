"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MenuDetail } from "@/api/menu/menuDetail";
import { MenuDetailRequest } from "@/api/menu/menuDetail";
import Image from "next/image";

export default function MenuDetailPage() {
  const params = useParams();
  const menuId = params.menu_id as string;
  const [menu, setMenu] = useState<MenuDetailRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const getImageSrc = (imageUrl: string) => {
    if (imageError) {
      return '/menu-default.png';
    }
    // blob URLやローカルURLの場合はデフォルト画像を使用
    if (imageUrl && (imageUrl.startsWith('blob:') || imageUrl.startsWith('file:'))) {
      return '/menu-default.png';
    }
    return imageUrl || '/menu-default.png';
  };

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      
      const response = await MenuDetail(menuId);

      if (response.success) {
        setMenu(response.menu);
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
    <main>
      <h1>Menu Detail</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : error ? (
        <p>エラー: {error}</p>
      ) : menu ? (
        <div>
          <h2>{menu.name}</h2>
          <p>{menu.description}</p>
          <Image 
            src={getImageSrc(menu.image_url)}
            alt={menu.name}
            width={200}
            height={200}
            onError={() => setImageError(true)}
          />
          <p>¥{menu.price}</p>
          {menu.category && <p>カテゴリ: {menu.category}</p>}
          <p>利用可能: {menu.is_available ? "はい" : "いいえ"}</p>
        </div>
      ) : (
        <p>メニューが見つかりません</p>
      )}
    </main>
  )
}