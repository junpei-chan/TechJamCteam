from pydantic import BaseModel
from datetime import datetime

class NotificationShopBase(BaseModel):
  notification_id: int
  shop_id: int

class NotificationShopCreate(NotificationShopBase):
  pass

class NotificationShopRead(NotificationShopBase):
  id: int
  created_at: datetime

  class Config:
    orm_mode = True