from sqlalchemy.orm import Session
from ..models.notification_users import NotificationUsers
from ..schemas.notification_users import NotificationUsersCreate
from typing import List, Optional

class NotificationUsersCRUD:
  
  def __init__(self, db: Session):
    self.db = db
  
  # 新規作成
  def create(self, notification_user: NotificationUsersCreate):
    db_notification_user = NotificationUsers(
      notification_id = notification_user.notification_id,
      user_id = notification_user.user_id
    )
    self.db.add(db_notification_user)
    self.db.commit()
    self.db.refresh(db_notification_user)
    return db_notification_user
  
  # 全件取得
  def get_all(self, skip: int = 0, limit: int = 100):
    return self.db.query(NotificationUsers).ofset(skip).limit(limit).all()
  
  # ID指定で取得
  def get_by_id(self, notification_user_id: int):
    return self.db.query(NotificationUsers).filter(
      NotificationUsers.id == notification_user_id
    ).first()