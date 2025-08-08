from pydantic import BaseModel
from datetime import datetime

class NotificationUsersBase(BaseModel):
  notification_id: int
  user_id: int

class NotificationUsersCreate(NotificationUsersBase):
  pass

class NotificationUsersRead(NotificationUsersBase):
  id: int
  create_at: datetime

  class Config:
    orm_mode = True