from pydantic import BaseModel
from typing import Optional, List
from schemas.menu import MenuBase

class ShopBase(BaseModel):
  area_id: int
  shop_name: str
  shop_deteil: Optional[str] = None
  image_patth: Optional[str] = None
  homepage_url: Optional[str] = None
  address: Optional[str] = None
  phone: Optional[str] = None

class ShopCreate(ShopBase):
  pass

class ShopRead(ShopBase):
  shop_id: int

  class Config:
    orm_mode = True

class ShopUpdate(BaseModel):
  area_id: Optional[int]
  shop_name: Optional[str]
  shop_detail: Optional[str]
  image_path: Optional[str]
  homepage_url: Optional[str]
  address: Optional[str]
  phone: Optional[str]

class ShopWithMenus(BaseModel):
  shop_name: str
  menus: List[MenuBase]

  class Config:
    orm_mode = True