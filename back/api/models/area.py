from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from api.database import Base

class Area(Base):
  __tablename__ = "areas"

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String(100))

  shops = relationship("Shop", back_populates="area")