from sqlalchemy.orm import Session
from typing import Optional
from ..models.shop_users import ShopUsers

class ShopUsersCRUD:
  def __init__(self, db: Session):
    self.db = db

  def get_shop_user(self, shop_user_id: int) -> Optional[ShopUsers]:
    return self.db.query(ShopUsers).filter(ShopUsers.id == shop_user_id).first()
  
  def create_shop_user(self, shop_user: ShopUsers) -> ShopUsers:
    db_shop_user = ShopUsers(
      shop_id=shop_user.shop_id,
      username=shop_user.username,
      password=shop_user.password,
      address=shop_user.address,
      email=shop_user.email,
    )
    self.db.add(db_shop_user)
    self.db.commit()
    self.db.refresh(db_shop_user)
    return db_shop_user
  
  def update_shop_user(self, shop_user_id: int, shop_user: ShopUsers) -> Optional[ShopUsers]:
    db_shop_user = self.get_shop_user(shop_user_id)

    if db_shop_user:
      for field, value in shop_user.model_dump(exclude_unset=True).items():
        setattr(db_shop_user, field, value)
      self.db.commit()
      self.db.refresh(db_shop_user)
      return db_shop_user
    return None

  def delete_shop_user(self, shop_user_id: int) -> bool:
    db_shop_user = self.get_shop_user(shop_user_id)

    if db_shop_user:
      self.db.delete(db_shop_user)
      self.db.commit()
      return True
    return False
  