from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.favorites import Favorite
from ..models.shop import Shop
from ..schemas.favorites import FavoriteBase

def get_user_favorites(db: Session, user_id: int) -> List[Favorite]:
  """ユーザーのお気に入り一覧を取得"""
  return db.query(Favorite).filter(Favorite.user_id == user_id).all()

def get_user_favorite_shops(db: Session, user_id: int) -> List[Shop]:
  """ユーザーのお気に入り店舗一覧を取得"""
  return db.query(Shop).join(Favorite).filter(Favorite.user_id == user_id).all()

def add_favorite(db: Session, user_id: int, shop_id: int) -> Favorite:
  """お気に入りを追加"""
  # 既に存在するかチェック
  existing = db.query(Favorite).filter(
      Favorite.user_id == user_id,
      Favorite.shop_id == shop_id
  ).first()
  
  if existing:
      return existing
  
  favorite = Favorite(user_id=user_id, shop_id=shop_id)
  db.add(favorite)
  db.commit()
  db.refresh(favorite)
  return favorite

def remove_favorite(db: Session, user_id: int, shop_id: int) -> bool:
  """お気に入りを削除"""
  favorite = db.query(Favorite).filter(
      Favorite.user_id == user_id,
      Favorite.shop_id == shop_id
  ).first()
  
  if favorite:
      db.delete(favorite)
      db.commit()
      return True
  return False

def is_favorite(db: Session, user_id: int, shop_id: int) -> bool:
  """お気に入り状態を確認"""
  favorite = db.query(Favorite).filter(
      Favorite.user_id == user_id,
      Favorite.shop_id == shop_id
  ).first()
  return favorite is not None