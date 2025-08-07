from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Notification(Base):
  __tablename__ = "notifications"

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id"))
  shop_id = Column(Integer, ForeignKey("shops.id"))
  shop_user_id = Column(Integer, ForeignKey("shop_users.id"))
  content = Column(String(255), nullable=False)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  status = Column(String)