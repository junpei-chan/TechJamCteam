from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..schemas.notification_users import NotificationUsersCreate, NotificationUsersRead
from ..cruds.notification_users import NotificationUsersCRUD
from ..database import get_db

router = APIRouter(prefix="/notification-users", tags=["notification_users"])

@router.post("/", response_model=NotificationUsersRead)
def create_notification_user(
  data: NotificationUsersCreate,
  db: Session = Depends(get_db)
):
  # 新しい NotificationUsers レコードを作成
  crud = NotificationUsersCRUD(db)  # CRUDクラスを初期化
  return crud.create(data)  # create()を呼び出し、DBに保存

@router.get("/", response_model=List[NotificationUsersRead])
def list_notification_users(
  skip: int = 0,
  limit: int = 100,
  db: Session = Depends(get_db)
):
  # NotificationUsers を全件取得
  crud = NotificationUsersCRUD(db)  # CRUDクラスを初期化
  return crud.get_all(skip=skip, limit=limit)  # get_all()でデータ取得

@router.get("/{notification_user_id}", response_model=NotificationUsersRead)
def get_notification_user(
  notification_user_id: int,
  db: Session = Depends(get_db)
):
  # ID指定で NotificationUsers を取得
  crud = NotificationUsersCRUD(db)
  record = crud.get_by_id(notification_user_id)
  # 取得結果がなければ404
  if record is None:
    raise HTTPException(status_code=404, detail="NotificationUser not found")
  return record