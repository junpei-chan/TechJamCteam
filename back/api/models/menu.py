from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Menu(Base):
    __tablename__ = "menus"
    
    id = Column(Integer, primary_key=True, index=True)
    # shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)  # 一時的にコメントアウト
    # genre_id = Column(Integer, ForeignKey("genres.id"), nullable=False)  # 一時的にコメントアウト
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text)
    price = Column(Float, nullable=False)
    category = Column(String(50), index=True)
    image_url = Column(String(255))
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # shop = relationship("Shop", back_populates="menus")  # 一時的にコメントアウト
    
    def __repr__(self):
        return f"<Menu(name='{self.name}', price={self.price})>"
