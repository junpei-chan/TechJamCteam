from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.auth import (
  UserCreate, UserResponse, UserLogin, UserUpdate,
  ShopUserCreate, ShopUserResponse, ShopUserLogin,
  Token, TokenData
)
from ..cruds.auth import (
  create_user, authenticate_user, get_user_by_username, get_user_by_email,
  create_shop_user, authenticate_shop_user, get_shop_user_by_username, get_shop_user_by_email,
  update_user
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
  # ユーザー名の重複チェック（一般ユーザー）
  if get_user_by_username(db, user.username):
    raise HTTPException(
      status_code=400,
      detail="Username already registered as general user"
    )
  
  # ユーザー名の重複チェック（店舗ユーザー）
  if get_shop_user_by_username(db, user.username):
    raise HTTPException(
      status_code=400,
      detail="Username already registered as shop user"
    )
  
  # メールアドレスの重複チェック（一般ユーザー）
  if get_user_by_email(db, user.email):
    raise HTTPException(
      status_code=400,
      detail="Email already registered as general user"
    )
  
  # メールアドレスの重複チェック（店舗ユーザー）
  if get_shop_user_by_email(db, user.email):
    raise HTTPException(
      status_code=400,
      detail="Email already registered as shop user"
    )
  
  return create_user(db=db, user=user)

@router.post("/shop/register", response_model=ShopUserResponse)
def register_shop_user(shop_user: ShopUserCreate, db: Session = Depends(get_db)):
  """店舗ユーザー登録"""
  # ユーザー名の重複チェック（店舗ユーザー）
  if get_shop_user_by_username(db, shop_user.username):
    raise HTTPException(
      status_code=400,
      detail="Username already registered as shop user"
    )
  
  # ユーザー名の重複チェック（一般ユーザー）
  if get_user_by_username(db, shop_user.username):
    raise HTTPException(
      status_code=400,
      detail="Username already registered as general user"
    )
  
  # メールアドレスの重複チェック（店舗ユーザー）
  if get_shop_user_by_email(db, shop_user.email):
    raise HTTPException(
      status_code=400,
      detail="Email already registered as shop user"
    )
  
  # メールアドレスの重複チェック（一般ユーザー）
  if get_user_by_email(db, shop_user.email):
    raise HTTPException(
      status_code=400,
      detail="Email already registered as general user"
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

@router.put("/me", response_model=UserResponse)
def update_current_user(user_update: UserUpdate, current_user: UserResponse = Depends(get_current_user), db: Session = Depends(get_db)):
  """現在のユーザー情報を更新"""
  # ユーザー名が変更される場合は重複チェック
  if user_update.username and user_update.username != current_user.username:
    if get_user_by_username(db, user_update.username):
      raise HTTPException(
        status_code=400,
        detail="Username already registered as general user"
      )
    if get_shop_user_by_username(db, user_update.username):
      raise HTTPException(
        status_code=400,
        detail="Username already registered as shop user"
      )
  
  # メールアドレスが変更される場合は重複チェック
  if user_update.email and user_update.email != current_user.email:
    if get_user_by_email(db, user_update.email):
      raise HTTPException(
        status_code=400,
        detail="Email already registered as general user"
      )
    if get_shop_user_by_email(db, user_update.email):
      raise HTTPException(
        status_code=400,
        detail="Email already registered as shop user"
      )
  
  updated_user = update_user(db, current_user.id, user_update)
  if not updated_user:
    raise HTTPException(status_code=404, detail="User not found")
  
  return updated_user

@router.get("/shop/me", response_model=ShopUserResponse)
def read_shop_users_me(current_shop_user: ShopUserResponse = Depends(get_current_shop_user)):
  """現在の店舗ユーザー情報を取得"""
  return current_shop_user

@router.get("/check-username/{username}")
def check_username_availability(username: str, db: Session = Depends(get_db)):
  """ユーザー名の可用性をチェック"""
  is_available = (
    not get_user_by_username(db, username) and 
    not get_shop_user_by_username(db, username)
  )
  return {"available": is_available, "username": username}

@router.get("/check-email/{email}")
def check_email_availability(email: str, db: Session = Depends(get_db)):
  """メールアドレスの可用性をチェック"""
  is_available = (
    not get_user_by_email(db, email) and 
    not get_shop_user_by_email(db, email)
  )
  return {"available": is_available, "email": email}
