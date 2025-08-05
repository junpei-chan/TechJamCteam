from pydantic import BaseModel, Field

class MenuFavoritesBase(BaseModel):
    user_id: int = Field(..., description="ID of the user")
    menu_id: int = Field(..., description="ID of the menu item")

class MenuFavoritesResponse(MenuFavoritesBase):
    class Config:
        from_attributes = True
