from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..cruds import favorites as favorites_crud
from ..schemas.favorites import FavoriteRead, FavoriteBase
from ..schemas.shop import ShopRead

router = APIRouter(prefix="/favorites", tags=["favorites"])

@router.get("/users/{user_id}", response_model=List[FavoriteRead])
def get_user_favorites(user_id: int, db: Session = Depends(get_db)):
  """ユーザーのお気に入り一覧を取得"""
  favorites = favorites_crud.get_user_favorites(db, user_id=user_id)
  return favorites

@router.get("/users/{user_id}/shops", response_model=List[ShopRead])
def get_user_favorite_shops(user_id: int, db: Session = Depends(get_db)):
  """ユーザーのお気に入り店舗一覧を取得"""
  shops = favorites_crud.get_user_favorite_shops(db, user_id=user_id)
  return shops

@router.post("/users/{user_id}/shops/{shop_id}", response_model=FavoriteRead)
def add_favorite(user_id: int, shop_id: int, db: Session = Depends(get_db)):
  """お気に入りを追加"""
  favorite = favorites_crud.add_favorite(db, user_id=user_id, shop_id=shop_id)
  return favorite

@router.delete("/users/{user_id}/shops/{shop_id}")
def remove_favorite(user_id: int, shop_id: int, db: Session = Depends(get_db)):
  """お気に入りを削除"""
  success = favorites_crud.remove_favorite(db, user_id=user_id, shop_id=shop_id)
  if not success:
      raise HTTPException(status_code=404, detail="Favorite not found")
  return {"message": "Favorite removed successfully"}

@router.get("/users/{user_id}/shops/{shop_id}/status")
def check_favorite_status(user_id: int, shop_id: int, db: Session = Depends(get_db)):
  """お気に入り状態を確認"""
  is_favorite = favorites_crud.is_favorite(db, user_id=user_id, shop_id=shop_id)
  return {"is_favorite": is_favorite}
