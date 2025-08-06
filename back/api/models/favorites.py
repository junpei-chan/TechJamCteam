from ..database import Base
from sqlalchemy import Column, Integer, ForeignKey

class Favorite(Base):
  __tablename__ = "favorites"

  user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
  shop_id = Column(Integer, ForeignKey("shops.id"), primary_key=True)