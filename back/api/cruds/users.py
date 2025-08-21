from sqlalchemy.orm import Session
from typing import Optional
from ..models.users import Users
from ..schemas.users import UserCreate, UserUpdate

class UsersCRUD:
  def __init__(self, db: Session):
    self.db = db

  # ユーザーの情報を取得
  def get_user(self, user_id: int) -> Optional[Users]:
    return self.db.query(Users).filter(Users.id == user_id).first()
  
  # ユーザーの新規登録
  def create_user(self, user: UserCreate) -> Users:
    db_user = Users(
      name=user.name,
      password=user.password,
      address=user.address,
      email=user.email
    )
    self.db.add(db_user)
    self.db.commit()
    self.db.refresh(db_user)
    return db_user
  
  # ユーザー情報の更新
  def update_user(self, user_id: int, user: UserUpdate) -> Optional[Users]:
    db_user = self.get_user(user_id)

    if db_user:
      for field, value in user.model_dump(exclude_unset=True).items():
        setattr(db_user, field, value)
      self.db.commit()
      self.db.refresh(db_user)
      return db_user
  
  # ユーザーの削除
  def delete_user(self, user_id: int) -> bool:
    db_user = self.get_user(user_id)
    if db_user:
      self.db.delete(db_user)
      self.db.commit()
      return True
    return False
