from pydantic import BaseModel

class NotificationBase(BaseModel):
  content: str
  status: str

class NotificationCreate(NotificationBase):
  pass