from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Users(Base):
  __tablename__ = "users"

  id = Column(Integer, primary_key=True, index=True)
  username = Column(String(50), nullable=False, unique=True, index=True)
  address = Column(String(255), nullable=True)
  email = Column(String(100), nullable=False, unique=True, index=True)
  password_hash = Column(String(255), nullable=False)
  created_at = Column(DateTime(timezone=True), server_default=func.now())
  updated_at = Column(DateTime(timezone=True), onupdate=func.now())

  # ユーザーに紐づく NotificationUsers の一覧を取得できるように
  user_notifications = relationship(
    "NotificationUsers",
    back_populates="user",
    cascade="all, delete-orphan"
  )
  
  def __repr__(self):
    return f"<Users(username='{self.username}', email='{self.email}')>"