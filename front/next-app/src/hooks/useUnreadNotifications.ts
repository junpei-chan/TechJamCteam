"use client";

import { useState, useEffect } from "react";
import { getNotifications } from "@/api/notification";

// 未読通知数を取得するカスタムフック
export function useUnreadNotificationCount() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        // ローカルストレージからユーザー情報を取得
        const savedProfile = localStorage.getItem("userProfile");
        if (!savedProfile) {
          setLoading(false);
          return;
        }

        const userData = JSON.parse(savedProfile);
        const response = await getNotifications({ user_id: userData.id });
        
        if (response.success && response.notifications) {
          const unreadNotifications = response.notifications.filter(n => !n.is_read);
          setUnreadCount(unreadNotifications.length);
        }
      } catch (error) {
        console.error("未読通知数の取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    // 30秒ごとに未読数を更新（実際のアプリケーションではWebSocketなどを使用することを推奨）
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { unreadCount, loading };
}
