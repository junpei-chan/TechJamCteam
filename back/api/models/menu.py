from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from api.database import Base

class Menu(Base):
    __tablename__ = "menus"
    
    id = Column(Integer, primary_key=True, index=True)
    shop_id = Column(Integer, ForeignKey("shops.id"), nullable=False)
    genre_id = Column(Integer, nullable=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text)
    price = Column(Float, nullable=False)
    category = Column(String(50), index=True)
    tags = Column(JSON, default=list)
    image_url = Column(String(255))
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    menu_favorites = relationship(
        "MenuFavorites",
        back_populates="menu",
        cascade="all, delete-orphan"
    )

    shop = relationship("Shop", back_populates="menus")
    
    def __repr__(self):
        return f"<Menu(name='{self.name}', price={self.price})>"
