from pydantic import BaseModel
from typing import Optional

class ShopBase(BaseModel):
  area_id: str
  shop_name: str
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
  area_id: Optional[str]
  shop_name: Optional[str]
  shop_detail: Optional[str]
  image_path: Optional[str]
  homepage_url: Optional[str]
  address: Optional[str]
  phone: Optional[str]