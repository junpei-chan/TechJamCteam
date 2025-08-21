from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..schemas.menu_favorites import MenuFavoritesBase, MenuFavoritesResponse
from ..cruds.menu_favorites import MenuFavoritesCRUD
from ..database import get_db

router = APIRouter(prefix="/menu_favorites", tags=["menu_favorites"])

@router.post("/", response_model=MenuFavoritesResponse)
def add_favorite(
  favorite: MenuFavoritesBase, 
  db: Session = Depends(get_db)
):
  """メニューをお気に入りに追加"""
  crud = MenuFavoritesCRUD(db)
  
  existing = crud.get_favorite(favorite.user_id, favorite.menu_id)
  if existing:
      raise HTTPException(status_code=400, detail="Already in favorites")
  
  created_favorite = crud.add_favorite(favorite)
  return created_favorite

@router.delete("/")
def remove_favorite(
  user_id: int, 
  menu_id: int, 
  db: Session = Depends(get_db)
):
  """お気に入りから削除"""
  crud = MenuFavoritesCRUD(db)
  
  favorite = crud.get_favorite(user_id, menu_id)
  if not favorite:
    raise HTTPException(status_code=404, detail="Favorite not found")
  
  crud.remove_favorite(user_id, menu_id)
  return {"message": "Removed from favorites"}

@router.get("/user/{user_id}", response_model=List[MenuFavoritesResponse])
def get_user_favorites(
  user_id: int, 
  db: Session = Depends(get_db)
):
  """ユーザーのお気に入り一覧を取得"""
  crud = MenuFavoritesCRUD(db)
  favorites = crud.get_user_favorites(user_id)
  return favorites

@router.get("/check")
def check_favorite(
  user_id: int, 
  menu_id: int, 
  db: Session = Depends(get_db)
):
  """メニューがお気に入りかどうか確認"""
  crud = MenuFavoritesCRUD(db)
  favorite = crud.get_favorite(user_id, menu_id)
  return {"is_favorite": favorite is not None}

