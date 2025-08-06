from sqlalchemy.orm import Session
from ..models.genre import Genre

def get_genre(db: Session, genre_id: int):
  """指定されたIDのジャンルを取得"""
  return db.query(Genre).filter(Genre.id == genre_id).first()

def get_genres(db: Session, skip: int = 0, limit: int = 100):
  """ジャンル一覧を取得"""
  return db.query(Genre).offset(skip).limit(limit).all()

def get_genre_with_menus(db: Session, genre_id: int):
  """指定されたジャンルとそのメニューを取得"""
  return db.query(Genre).filter(Genre.id == genre_id).first()
