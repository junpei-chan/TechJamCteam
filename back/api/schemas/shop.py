from pydantic import BaseModel
from typing import Optional

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