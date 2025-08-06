"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MenuIndex } from "@/api/menu/menuIndex";
import { MenuIndexRequest } from "@/api/menu/menuIndex";
import Image from "next/image";

export default function MenuDetail() {
  const params = useParams();
  const menuId = params.menu_id as string;
  const [menu, setMenu] = useState<MenuIndexRequest | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      // 全メニューを取得して特定のIDのメニューを見つける
      // 本来は個別メニュー取得APIが望ましい
      const response = await MenuIndex();

      if (response.success) {
        const foundMenu = response.menus.find(m => m.id?.toString() === menuId);
        setMenu(foundMenu || null);
      }
    };
    if (menuId) {
      fetchMenu();
    }
  }, [menuId]);
  return (
    <main>
      <h1>Menu Detail</h1>

      {menu ? (
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
        </div>
      ) : (
        <p>メニューが見つかりません</p>
      )}
    </main>
  )
}