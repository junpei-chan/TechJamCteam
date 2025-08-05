from pydantic import BaseModel

class GenreBase(BaseModel):
  name: str

class GenreRead(GenreBase):
  id: int

  class Config:
    orm_mode = True