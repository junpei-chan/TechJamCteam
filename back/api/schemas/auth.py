from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
  username: str
  email: str
  password: str
  address: Optional[str] = None

class UserLogin(BaseModel):
  email: str
  password: str

class UserResponse(BaseModel):
  id: int
  username: str
  email: str
  address: Optional[str] = None
  
  class Config:
    from_attributes = True

class ShopUserCreate(BaseModel):
  shop_id: int
  username: str
  email: str
  password: str

class ShopUserLogin(BaseModel):
  username: str
  password: str

class ShopUserResponse(BaseModel):
  id: int
  shop_id: int
  username: str
  email: str
  
  class Config:
    from_attributes = True

class Token(BaseModel):
  access_token: str
  token_type: str
  user_type: str  # "user" or "shop_user"

class TokenData(BaseModel):
  username: Optional[str] = None
  user_type: Optional[str] = None
