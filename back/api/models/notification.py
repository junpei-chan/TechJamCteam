from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from api.database import Base

from api.models.notification_shop import NotificationShop

class Notification(Base):
  __tablename__ = "notifications"

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  shop_id = Column(Integer, ForeignKey("shops.id"), nullable=True)
  shop_user_id = Column(Integer, ForeignKey("shop_users.id"), nullable=True)
  contents = Column(String(255), nullable=False)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  status = Column(String(255), default="unread")

  user = relationship("Users", back_populates="notifications")
  shop = relationship("Shop")
  shop_user = relationship("ShopUsers")

  notification_users = relationship(
    "NotificationUsers",
    back_populates="notification",
    cascade="all, delete-orphan"
  )

  notification_shops = relationship(
    "NotificationShop",
    back_populates="notification",
    cascade="all, delete-orphan"
  )

  def __repr__(self):
    return f"<Notification(to_user={self.user_id}, contents={self.contents})>"