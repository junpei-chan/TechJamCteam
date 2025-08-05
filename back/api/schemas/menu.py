from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class MenuBase(BaseModel):
  name: str = Field(..., max_length=100)
  description: Optional[str] = None
  price: float = Field(..., gt=0)
  category: Optional[str] = Field(None, max_length=50)
  image_url: Optional[str] = None
  is_available: bool = True

  class config:
    orm_mode = True

class MenuCreate(MenuBase):
  pass

class MenuUpdate(BaseModel):
  name: Optional[str] = Field(None, max_length=100)
  description: Optional[str] = None
  price: Optional[float] = Field(None, gt=0)
  category: Optional[str] = Field(None, max_length=50)
  image_url: Optional[str] = None
  is_available: Optional[bool] = None

class MenuResponse(MenuBase):
  id: int
  created_at: datetime
  updated_at: Optional[datetime] = None
  
  class Config:
    from_attributes = True

class MenuListResponse(BaseModel):
  items: list[MenuResponse]
  total: int
  page: int
  per_page: int
