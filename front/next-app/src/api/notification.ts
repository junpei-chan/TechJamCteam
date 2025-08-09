import { Notification, NotificationRequest, NotificationResponse } from '@/types/notification';

// モックデータ（実際のAPIが実装されるまで使用）
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'favorite',
    title: 'お気に入り通知',
    message: 'いいねした店舗に新しいメニューが追加されました',
    shop_name: '店舗名',
    date: '2025/08/07',
    is_read: false,
    created_at: '2025-08-07T10:00:00Z'
  },
  {
    id: '2',
    type: 'general',
    title: '店舗名',
    message: 'いいねした店舗に新しいメニューが追加されました',
    date: '2025/08/07',
    is_read: false,
    created_at: '2025-08-07T09:00:00Z'
  },
  {
    id: '3',
    type: 'general',
    title: '店舗名',
    message: 'いいねした店舗に新しいメニューが追加されました',
    date: '2025/08/07',
    is_read: false,
    created_at: '2025-08-07T08:00:00Z'
  },
  {
    id: '4',
    type: 'general',
    title: '店舗名',
    message: 'いいねした店舗に新しいメニューが追加されました',
    date: '2025/08/07',
    is_read: false,
    created_at: '2025-08-07T07:00:00Z'
  },
  {
    id: '5',
    type: 'general',
    title: '店舗名',
    message: 'いいねした店舗に新しいメニューが追加されました',
    date: '2025/08/07',
    is_read: false,
    created_at: '2025-08-07T06:00:00Z'
  },
  {
    id: '6',
    type: 'general',
    title: '店舗名',
    message: 'いいねした店舗に新しいメニューが追加されました',
    date: '2025/08/07',
    is_read: false,
    created_at: '2025-08-07T05:00:00Z'
  }
];

export async function getNotifications(request: NotificationRequest): Promise<NotificationResponse> {
  // TODO: 実際のAPIコールに置き換える
  // const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}` // 認証トークンが必要な場合
  //   }
  // });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        notifications: mockNotifications
      });
    }, 500); // API呼び出しをシミュレート
  });
}

export async function markNotificationAsRead(notificationId: string): Promise<NotificationResponse> {
  // TODO: 実際のAPIコールに置き換える
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '通知を既読にしました'
      });
    }, 200);
  });
}

export async function markAllNotificationsAsRead(userId: number): Promise<NotificationResponse> {
  // TODO: 実際のAPIコールに置き換える
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'すべての通知を既読にしました'
      });
    }, 300);
  });
}
