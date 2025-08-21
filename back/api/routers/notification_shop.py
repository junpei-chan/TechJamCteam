from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..schemas.notification_shop import NotificationShopCreate, NotificationShopRead
from ..cruds.notification_shop import NotificationShopCRUD
from ..database import get_db

router = APIRouter(prefix="/notification-shop", tags=["notification_shops"])

@router.post("/", response_model=NotificationShopRead)
def create_notification_shop(
  data: NotificationShopCreate,
  db: Session = Depends(get_db)
):
  # 新しい NotificationShop レコードを作成
  crud = NotificationShopCRUD(db)
  return crud.create(data)

@router.get("/", response_model=List[NotificationShopRead])
def list_notification_shops(
  skip: int = 0,
  limit: int = 100,
  db: Session = Depends(get_db)
):
  # NotificationShop を全件取得
  crud = NotificationShopCRUD(db)
  return crud.get_all(skip=skip, limit=limit)

@router.get("/{notification_shop_id}", response_model=NotificationShopRead)
def get_notification_shop(
  notification_shop_id: int,
  db: Session = Depends(get_db)
):
  # ID指定で NotificationShop を取得
  crud = NotificationShopCRUD(db)
  record = crud.get_by_id(notification_shop_id)
  if record is None:
    raise HTTPException(status_code=404, detail="NotificatinoShop not found")
  return record