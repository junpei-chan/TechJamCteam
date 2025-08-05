from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/shops", tags=["shops"])

# 新しいショップを作成し、作成された内容を返す
@router.post("/", response_model=schemas.ShopRead)
def create_shop(shop: schemas.ShopCreate, db: Session = Depends(get_db)):
  return crud.create_shop(db, shop)

# 全ショップの一覧を取得（最大100件まで）
@router.get("/", response_model=list[schemas.ShopRead])
def read_shops(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
  return crud.get_shops(db, skip, limit)

# GET /shops/1 などで1件のショップを取得（見つからなければ404）
@router.post("/", response_model=schemas.ShopRead)
def read_shop(shop_id: int, db: Session = Depends(get_db)):
  shop = crud.get_shop_by_id(db, shop_id)
  if not shop:
    raise HTTPException(status_code=404, detail="Shop not found")
  return shop