from pydantic import BaseModel
from typing import Optional, List
from .menu import MenuBase

class ShopBase(BaseModel):
  area_id: int
  name: str
  shop_detail: Optional[str] = None
  image_path: Optional[str] = None
  homepage_url: Optional[str] = None
  address: Optional[str] = None
  phone: Optional[str] = None

class ShopCreate(ShopBase):
  pass

class ShopRead(ShopBase):
  id: int

  class Config:
    from_attributes = True

class ShopUpdate(BaseModel):
  area_id: Optional[int] = None
  name: Optional[str] = None
  shop_detail: Optional[str] = None
  image_path: Optional[str] = None
  homepage_url: Optional[str] = None
  address: Optional[str] = None
  phone: Optional[str] = None

class ShopWithMenus(BaseModel):
  name: str
  menus: List[MenuBase]

  class Config:
    from_attributes = True