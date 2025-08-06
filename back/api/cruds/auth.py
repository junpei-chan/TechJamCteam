from sqlalchemy.orm import Session
from typing import Optional
from ..models.users import Users
from ..models.shop_users import ShopUsers
from ..schemas.auth import UserCreate, ShopUserCreate
from ..auth import get_password_hash, verify_password

def get_user_by_username(db: Session, username: str) -> Optional[Users]:
  """ユーザー名でユーザーを取得"""
  return db.query(Users).filter(Users.username == username).first()

def get_user_by_email(db: Session, email: str) -> Optional[Users]:
  """メールアドレスでユーザーを取得"""
  return db.query(Users).filter(Users.email == email).first()

def create_user(db: Session, user: UserCreate) -> Users:
  """新しいユーザーを作成"""
  hashed_password = get_password_hash(user.password)
  db_user = Users(
      username=user.username,
      email=user.email,
      address=user.address,
      password_hash=hashed_password
  )
  db.add(db_user)
  db.commit()
  db.refresh(db_user)
  return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[Users]:
  """ユーザー認証（メールアドレスでの認証）"""
  user = get_user_by_email(db, email)
  if not user:
    return None
  if not verify_password(password, user.password_hash):
    return None
  return user

def get_shop_user_by_username(db: Session, username: str) -> Optional[ShopUsers]:
  """ユーザー名で店舗ユーザーを取得"""
  return db.query(ShopUsers).filter(ShopUsers.username == username).first()

def get_shop_user_by_email(db: Session, email: str) -> Optional[ShopUsers]:
  """メールアドレスで店舗ユーザーを取得"""
  return db.query(ShopUsers).filter(ShopUsers.email == email).first()

def create_shop_user(db: Session, shop_user: ShopUserCreate) -> ShopUsers:
  """新しい店舗ユーザーを作成"""
  hashed_password = get_password_hash(shop_user.password)
  db_shop_user = ShopUsers(
    shop_id=shop_user.shop_id,
    username=shop_user.username,
    email=shop_user.email,
    password_hash=hashed_password
  )
  db.add(db_shop_user)
  db.commit()
  db.refresh(db_shop_user)
  return db_shop_user

def authenticate_shop_user(db: Session, username: str, password: str) -> Optional[ShopUsers]:
  """店舗ユーザー認証"""
  shop_user = get_shop_user_by_username(db, username)
  if not shop_user:
    return None
  if not verify_password(password, shop_user.password_hash):
    return None
  return shop_user
