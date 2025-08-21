from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
  name: str = Field(..., max_length=100)
  password: str = Field(..., min_length=8)
  address: str = Field(None, max_length=255)
  email: str = Field(None, max_length=100)

class UserCreate(UserBase):
  pass

class UserUpdate(UserBase):
  name: Optional[str] = Field(None, max_length=100)
  password: Optional[str] = Field(None, min_length=8)
  address: Optional[str] = Field(None, max_length=255)
  email: Optional[str] = Field(None, max_length=100)

class UserResponse(UserBase):
  id: int
  created_at: datetime
  updated_at: Optional[datetime] = None

  class Config:
    from_attributes = True
