from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..cruds import genre as genre_crud
from ..schemas.genre import GenreRead

router = APIRouter(prefix="/genres", tags=["genres"])

@router.get("/", response_model=List[GenreRead])
def read_genres(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
  """ジャンル一覧を取得"""
  genres = genre_crud.get_genres(db, skip=skip, limit=limit)
  return genres

@router.get("/{genre_id}", response_model=GenreRead)
def read_genre(genre_id: int, db: Session = Depends(get_db)):
  """指定されたIDのジャンルを取得"""
  genre = genre_crud.get_genre(db, genre_id=genre_id)
  if genre is None:
    raise HTTPException(status_code=404, detail="Genre not found")
  return genre

@router.get("/{genre_id}/menus")
def read_genre_menus(genre_id: int, db: Session = Depends(get_db)):
  """指定されたジャンルのメニューを取得"""
  genre = genre_crud.get_genre_with_menus(db, genre_id=genre_id)
  if genre is None:
    raise HTTPException(status_code=404, detail="Genre not found")
  return {"genre": genre.name, "menus": genre.menus}
