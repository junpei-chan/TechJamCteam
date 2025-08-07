from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Notification(Base):
  __tablename__ = "notifications"

  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey("users.id"))           # 通知の送り先
  shop_id = Column(Integer, ForeignKey("shops.id"))           # 関連する店舗
  shop_user_id = Column(Integer, ForeignKey("shop_users.id")) # 発信元
  content = Column(String)               # 通知内容
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  status = Column(String)                                     # 既読・未読

  user = relationship("Users")
  shop = relationship("Shop")
  shop_user = relationship("ShopUsers")