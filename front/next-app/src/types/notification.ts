export type NotificationType = 'favorite' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  shop_name?: string;
  date: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationRequest {
  user_id: number;
  type?: NotificationType;
  is_read?: boolean;
}

export interface NotificationResponse {
  success: boolean;
  notifications?: Notification[];
  message?: string;
  messages?: string[];
}
