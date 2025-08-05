from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean
from ..database import Base

class Shop(Base):
  __tablename__ = "shop"

  id = Column(Integer, primary_key=True, index=True)
  area_id = Column(String(50), nullable=False)
  shop_name = Column(String(100), nullable=False)
  shop_detail = Column(Text)
  image_path = Column(String(255))
  homepage_url = Column(String(255))
  address = Column(String(255))
  phone = Column(String(20))