from pydantic import BaseModel, Field

class FavoriteBase(BaseModel):
  user_id: int = Field(..., description="ID of the user")
  shop_id: int = Field(..., description="ID of the shop")

class FavoriteRead(FavoriteBase):
  class Config:
    from_attributes = True