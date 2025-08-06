from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class Genre(Base):
  __tablename__ = "genres"

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String(100), nullable=False)

  menus = relationship("Menu", back_populates="genre")