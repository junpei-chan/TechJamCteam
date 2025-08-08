from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class NotificationUsers(Base):
  __tablename__ = "notification__users"

  id = Column(Integer, primary_key=True, index=True)
  notification_id = Column(Integer, ForeignKey("notifications.id", ondelete="CASCADE"), nullable=False)
  user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

  created_at = Column(DateTime(timezone=True), server_default=func.now())

  notification = relationship("Notification")
  user = relationship("Users")

  def __repr__(self):
    return f"<NotificationUsers(notification_id={self.notification_id}, user_id={self.user_id})>"