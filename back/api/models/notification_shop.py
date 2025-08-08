from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class NotificationShop(Base):
  __tablename__ = "notification__shop"

  id = Column(Integer, primary_key=True, index=True)
  notification_id = Column(Integer, ForeignKey("notification.id", ondelete="CASCADE"), nullable=False)
  shop_id = Column(Integer, ForeignKey("shop.id", ondelete="CASCADE"), nullable=False)

  created_at = Column(DateTime(timezone=True), server_default=func.now())

  # Notificationモデル側の notification_shops と対応
  notification = relationship("Notification", back_populates="notification_shops")
  # Shopモデル側の shop_notifications と対応
  shop = relationship("Shop", back_populates="shop_notifications")

  def __repr__(self):
    return f"<NotificationShop(notification_id={self.notification_id}, shop_id={self.shop_id})>"