from sqlalchemy.orm import Session

class MenuFavoritesCRUD:
  def __init__(self, db: Session):
    self.db = db