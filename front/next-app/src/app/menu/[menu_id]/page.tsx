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
            src={menu.image_url || "/menu-default.png"}
            alt={menu.name}
            width={200}
            height={200}
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