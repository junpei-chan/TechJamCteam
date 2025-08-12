from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from api.database import Base

class ShopUsers(Base):
  __tablename__ = "shop_users"

  id = Column(Integer, primary_key=True, index=True)
  shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)
  username = Column(String(50), nullable=False, unique=True, index=True)
  email = Column(String(100), nullable=False, unique=True, index=True)
  password_hash = Column(String(255), nullable=False)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  updated_at = Column(DateTime(timezone=True), onupdate=func.now())
  
  shop = relationship("Shop", back_populates="shop_users")
  
  def __repr__(self):
    return f"<ShopUsers(username='{self.username}', email='{self.email}', shop_id='{self.shop_id}')>"
