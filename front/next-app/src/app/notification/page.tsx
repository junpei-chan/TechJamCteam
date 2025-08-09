"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ConditionalFooter } from "@/components/shared";
import { useAuth } from "@/hooks/useAuth";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/api/notification";
import { Notification } from "@/types/notification";

export default function NotificationPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth(false);
  const [userProfile, setUserProfile] = useState<{ id: number; username: string } | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = () => {
      try {
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
          const userData = JSON.parse(savedProfile);
          setUserProfile(userData);
        } else {
          const defaultUser = {
            id: 1,
            username: "サンプルユーザー",
          };
          setUserProfile(defaultUser);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setUserProfile({ id: 1, username: "サンプルユーザー" });
      }
    };

    if (!authLoading) {
      loadUserProfile();
    }
  }, [authLoading]);

  const fetchNotifications = async () => {
    if (!userProfile) return;
    
    try {
      setLoading(true);
      const response = await getNotifications({ user_id: userProfile.id });
      
      if (response.success && response.notifications) {
        setNotifications(response.notifications);
      } else {
        setError(response.message || "通知の取得に失敗しました");
      }
    } catch (err) {
      setError("通知の取得中にエラーが発生しました");
      console.error("通知取得エラー:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, is_read: true }
              : notification
          )
        );
      }
    } catch (err) {
      console.error("既読処理エラー:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userProfile) return;
    
    try {
      const response = await markAllNotificationsAsRead(userProfile.id);
      
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, is_read: true }))
        );
      }
    } catch (err) {
      console.error("全既読処理エラー:", err);
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchNotifications();
    }
  }, [userProfile]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="flex items-center justify-between px-4 pt-4 h-[92px] bg-base shadow-md">
          <Link href="/" className="flex items-center justify-center w-10">
            <Image
              src="/icons/close-icon.svg"
              alt="閉じる"
              width={20}
              height={20}
            />
          </Link>
          <h1 className="text-normal font-medium text-center flex-1">お知らせ</h1>
          <div className="w-10 h-10"></div>
        </header>
        
        <div className="flex justify-center items-center p-8 mt-20">
          <div className="text-gray-500">読み込み中...</div>
        </div>
        
        <ConditionalFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-4 pt-4 h-[92px] bg-base shadow-md">
        <Link href="/" className="flex items-center justify-center w-10">
          <Image
            src="/icons/close-icon.svg"
            alt="閉じる"
            width={20}
            height={20}
          />
        </Link>
        <h1 className="text-normal font-medium text-center flex-1">お知らせ</h1>
        <div className="w-10 h-10"></div>
      </header>

      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="px-4 mt-4 pb-24">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4">
              <Image
                src="/icons/bell-icon.svg"
                alt="通知"
                width={48}
                height={48}
                className="mx-auto opacity-50"
              />
            </div>
            <p className="text-gray-500">通知はありません</p>
          </div>
        ) : (
          <div className="space-y-1">
            {unreadCount > 0 && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-accent hover:underline"
                >
                  すべて既読にする
                </button>
              </div>
            )}

            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white border-l-4 transition-all duration-200 cursor-pointer ${
                  notification.is_read 
                    ? 'border-gray-300 bg-gray-50' 
                    : 'border-accent bg-white'
                }`}
                onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {notification.type === 'favorite' ? (
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <Image
                            src="/icons/favorite-icon.svg"
                            alt="お気に入り"
                            width={16}
                            height={16}
                            className="filter invert"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                          <Image
                            src="/icons/user-icon.svg"
                            alt="通知"
                            width={16}
                            height={16}
                            className="filter invert"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        {notification.shop_name && (
                          <p className="text-sm font-medium text-gray-900 truncate">
                            [{notification.shop_name}]
                          </p>
                        )}
                        <p className="text-xs text-gray-500 ml-2">
                          {notification.date}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 break-words">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConditionalFooter />
    </main>
  );
}