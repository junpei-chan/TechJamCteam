from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Shop(Base):
  __tablename__ = "shops"

  id = Column(Integer, primary_key=True, index=True)
  area_id = Column(Integer, ForeignKey("areas.id"), nullable=False)
  name = Column(String(100), nullable=False)
  shop_detail = Column(Text)
  image_path = Column(String(255))
  homepage_url = Column(String(255))
  address = Column(String(255))
  phone = Column(String(20))

  area = relationship("Area", back_populates="shops")
  menus = relationship("Menu", back_populates="shop")