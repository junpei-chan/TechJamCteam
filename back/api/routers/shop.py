from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import cruds
from ..schemas.shop import ShopBase, ShopCreate, ShopRead, ShopUpdate
from ..database import get_db

router = APIRouter(prefix="/shops", tags=["shops"])

# 新しいショップを作成し、作成された内容を返す
@router.post("/", response_model=ShopBase)
def create_shop(shop: ShopCreate, db: Session = Depends(get_db)):
  return cruds.create_shop(db, shop)

# 全ショップの一覧を取得（最大100件まで）
@router.get("/", response_model=list[ShopRead])
def read_shops(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
  return cruds.get_shops(db, skip, limit)

# /shops/1 などで1件のショップを取得
@router.get("/{shop_id}", response_model=ShopRead)
def read_shop(shop_id: int, db: Session = Depends(get_db)):
  shop = cruds.get_shop_by_id(db, shop_id)
  if not shop:
    raise HTTPException(status_code=404, detail="Shop not found")
  return shop

# /shops/{shop_id} にアクセスで、該当IDのショップが更新される
@router.put("/{shop_id}", response_model=ShopRead)
def update_shop(shop_id: int, shop: ShopUpdate, db: Session = Depends(get_db)):
  updated_shop = cruds.update_shop(db, shop_id, shop)
  if updated_shop is None:
    raise HTTPException(status_code=404, detail="Shop not found")
  return updated_shop

# /shops/{shop_id} でショップを削除
@router.delete("/{shop_id}", response_model=ShopRead)
def delete_shop(shop_id: int, db: Session = Depends(get_db)):
  deleted_shop = cruds.delete_shop(db, shop_id)
  if deleted_shop is None:
    raise HTTPException(status_code=404, detail="Shop not found")
  return deleted_shop