from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..schemas.notification import NotificationCreate, NotificationOut
from ..cruds.notification import NotificationCRUD
from ..database import get_db

router = APIRouter(prefix="/notifications", tags=["notifications"])

# 通知を作成
@router.post("/", response_model=NotificationOut, status_code=201)
def create_notification(notification: NotificationCreate, db: Session = Depends(get_db)):
  crud = NotificationCRUD(db)
  return crud.create_notification(notification)

# 通知一覧取得（ユーザー別）
@router.get("/user/{user_id}", response_model=List[NotificationOut])
def get_user_notifications(user_id: int, db: Session = Depends(get_db)):
  crud = NotificationCRUD(db)
  notifications = crud.get_user_notifications(user_id)
  if not notifications:
    raise HTTPException(status_code=404, detail="Notification not found")
  return notifications

# 通知を既読に変更
@router.put("/read/{notification_id}", response_model=NotificationOut)
def mark_as_read(notification_id: int, db: Session = Depends(get_db)):
  crud = NotificationCRUD(db)
  updated = crud.mark_as_read(notification_id)
  if not updated:
    raise HTTPException(status_code=404, detail="Notification not found")
  return updated