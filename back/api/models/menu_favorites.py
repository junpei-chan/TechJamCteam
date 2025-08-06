from ..database import Base
from sqlalchemy import Column, Integer, ForeignKey

class MenuFavorites(Base):
    __tablename__ = "menu_favorites"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    menu_id = Column(Integer, ForeignKey("menus.id"), primary_key=True)