from sqlalchemy.orm import Session
from ..models.notification import Notification
from ..schemas.notification import NotificationCreate
from typing import List, Optional

class NotificationCRUD:
  def __init__(self, db: Session):
    self.db = db

  # 通知を一件作成
  def create_notification(self, notification: NotificationCreate) -> Notification:
    db_notification = Notification(**notification.dict())
    self.db.add(db_notification)
    self.db.commit()
    self.db.refresh(db_notification)
    return db_notification
  
  # 指定ユーザーの通知一覧を取得
  def get_user_notifications(self, user_id: int) -> List[Notification]:
    return self.db.query(Notification).filter(Notification.user_id == user_id).all()

  # 通知を既読に変更
  def mark_as_read(self, notification_id: int) -> Optional[Notification]:
    notification = self.db.query(Notification).filter(Notification.notification_id == notification_id).first()
    if notification:
      notification.status = "read"
      self.db.commit()
      self.db.refresh(notification)
      return notification
    return None   # 該当なし
