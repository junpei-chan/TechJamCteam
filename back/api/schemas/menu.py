from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class MenuBase(BaseModel):
  shop_id: int
  genre_id: Optional[int] = None
  name: str = Field(..., max_length=100)
  description: Optional[str] = None
  price: float = Field(..., gt=0)
  category: Optional[str] = Field(None, max_length=50)
  tags: Optional[List[str]] = Field(default_factory=list, max_items=10)
  image_url: Optional[str] = None
  is_available: bool = True

  class Config:
    from_attributes = True

class MenuCreate(MenuBase):
  pass

class MenuUpdate(BaseModel):
  shop_id: Optional[int] = None
  genre_id: Optional[int] = None
  name: Optional[str] = Field(None, max_length=100)
  description: Optional[str] = None
  price: Optional[float] = Field(None, gt=0)
  category: Optional[str] = Field(None, max_length=50)
  tags: Optional[List[str]] = Field(None, max_items=10)
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
