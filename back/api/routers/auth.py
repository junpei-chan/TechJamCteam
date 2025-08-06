from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.auth import (
  UserCreate, UserResponse, UserLogin,
  ShopUserCreate, ShopUserResponse, ShopUserLogin,
  Token, TokenData
)
from ..cruds.auth import (
  create_user, authenticate_user, get_user_by_username, get_user_by_email,
  create_shop_user, authenticate_shop_user, get_shop_user_by_username, get_shop_user_by_email
)
from ..auth import create_access_token, verify_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
  """現在のユーザーを取得（一般ユーザー）"""
  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
  )
  
  try:
    payload = verify_token(token)
    username: str = payload.get("sub")
    user_type: str = payload.get("user_type")
    if username is None or user_type != "user":
      raise credentials_exception
  except:
    raise credentials_exception
  
  user = get_user_by_username(db, username=username)
  if user is None:
    raise credentials_exception
  return user

def get_current_shop_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
  """現在の店舗ユーザーを取得"""
  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
  )
  
  try:
    payload = verify_token(token)
    username: str = payload.get("sub")
    user_type: str = payload.get("user_type")
    if username is None or user_type != "shop_user":
      raise credentials_exception
  except:
    raise credentials_exception
  
  shop_user = get_shop_user_by_username(db, username=username)
  if shop_user is None:
    raise credentials_exception
  return shop_user

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
  """一般ユーザー登録"""
  # ユーザー名の重複チェック
  if get_user_by_username(db, user.username):
    raise HTTPException(
      status_code=400,
      detail="Username already registered"
    )
  
  # メールアドレスの重複チェック
  if get_user_by_email(db, user.email):
    raise HTTPException(
      status_code=400,
      detail="Email already registered"
    )
  
  return create_user(db=db, user=user)

@router.post("/shop/register", response_model=ShopUserResponse)
def register_shop_user(shop_user: ShopUserCreate, db: Session = Depends(get_db)):
  """店舗ユーザー登録"""
  # ユーザー名の重複チェック
  if get_shop_user_by_username(db, shop_user.username):
    raise HTTPException(
      status_code=400,
      detail="Username already registered"
    )
  
  # メールアドレスの重複チェック
  if get_shop_user_by_email(db, shop_user.email):
    raise HTTPException(
      status_code=400,
      detail="Email already registered"
    )
  
  return create_shop_user(db=db, shop_user=shop_user)

@router.post("/login", response_model=Token)
def login_for_access_token(user_login: UserLogin, db: Session = Depends(get_db)):
  """ログイン（一般ユーザー）"""
  user = authenticate_user(db, user_login.email, user_login.password)
  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Incorrect email or password",
      headers={"WWW-Authenticate": "Bearer"},
    )
  access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  access_token = create_access_token(
    data={"sub": user.username, "user_type": "user"}, expires_delta=access_token_expires
  )
  return {"access_token": access_token, "token_type": "bearer", "user_type": "user"}

@router.post("/shop/login", response_model=Token)
def login_shop_user_for_access_token(shop_user_login: ShopUserLogin, db: Session = Depends(get_db)):
  """ログイン（店舗ユーザー）"""
  shop_user = authenticate_shop_user(db, shop_user_login.username, shop_user_login.password)
  if not shop_user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Incorrect username or password",
      headers={"WWW-Authenticate": "Bearer"},
    )
  access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  access_token = create_access_token(
    data={"sub": shop_user.username, "user_type": "shop_user"}, expires_delta=access_token_expires
  )
  return {"access_token": access_token, "token_type": "bearer", "user_type": "shop_user"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: UserResponse = Depends(get_current_user)):
  """現在の一般ユーザー情報を取得"""
  return current_user

@router.get("/shop/me", response_model=ShopUserResponse)
def read_shop_users_me(current_shop_user: ShopUserResponse = Depends(get_current_shop_user)):
  """現在の店舗ユーザー情報を取得"""
  return current_shop_user
