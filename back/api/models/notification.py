from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Notification(Base):
  __tablename__ = "notifications"

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)                          # 通知の送り先
  shop_id = Column(Integer, ForeignKey("shops.id"), nullable=True)           # 関連する店舗
  shop_user_id = Column(Integer, ForeignKey("shop_users.id"), nullable=True) # 店舗側ユーザー（オプション）
  contents = Column(String, nullable=False)                                  # 通知内容
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  status = Column(String, default="unread")                                                    # 既読・未読

  user = relationship("Users", back_populates="notifications")
  shop = relationship("Shop")
  shop_user = relationship("ShopUsers")

  # Notification → NotificationUsers の一対多リレーション
  notification_users = relationship(
    "NotificationUsers",
    back_populates="notification",
    cascade="all, delete-orphan"  # Notification を削除すると関連する中間行も削除
  )

  # Notification → NotificationShop の一対多リレーション
  notification_shops = relationship(
    "NotificationShop",
    back_populates="notification",
    cascade="all, delete-orphan"  # Notification を削除すると関連する中間行も削除
  )

  def __repr__(self):
    return f"<Notification(to_user={self.user_id}, contents={self.contents})>"