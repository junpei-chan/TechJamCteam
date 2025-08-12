from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from api.database import Base

class MenuFavorites(Base):
    __tablename__ = "menu_favorites"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    menu_id = Column(Integer, ForeignKey("menus.id"), primary_key=True)

    menu = relationship(
        "Menu",
        back_populates="menu_favorites"
    )