from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
  contents: str
  user_id: int
  shop_id: Optional[int] = None
  shop_user_id: Optional[int] = None
  status: Optional[str] = "unread"

class NotificationCreate(NotificationBase):
  pass

class NotificationOut(NotificationBase):
  notification_id: int
  created_at: datetime

  class Config:
    orm_mode = True