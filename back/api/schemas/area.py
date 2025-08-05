from pydantic import BaseModel

class AreaBase(BaseModel):
  area_name: str

class AreaRead(AreaBase):
  area_id: int

  class Config:
    orm_mode = True