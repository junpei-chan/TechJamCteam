from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class ShopUsers(Base):
  __tablename__ = "shop_users"

  id = Column(Integer, primary_key=True, index=True)
  shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)
  username = Column(String(50), nullable=False, unique=True, index=True)
  password = Column(String(255), nullable=False)
  address = Column(String(255), nullable=True)
  email = Column(String(100), nullable=False, unique=True, index=True)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  updated_at = Column(DateTime(timezone=True), onupdate=func.now())

  def __repr__(self):
    return f"<ShopUser(username='{self.username}', email='{self.email}')>"