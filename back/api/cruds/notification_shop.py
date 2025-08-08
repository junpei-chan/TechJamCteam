from sqlalchemy.orm import Session
from ..models.notification_shop import NotificationShop
from ..schemas.notification_shop import NotificationShopCreate

class NotificationShopCRUD:
  def __init__(self, db: Session):
    self.db = db

  # 新規作成
  def create(self, notification_shop: NotificationShopCreate):
    db_notification_shop = NotificationShop(
      notification_id = notification_shop.notification_id,
      shop_id = notification_shop.shop_id
    )
    self.db.add(db_notification_shop)
    self.db.commit()
    self.db.refresh(db_notification_shop)
    return db_notification_shop
  
  # 全件取得
  def get_all(self, skip: int = 0, limit: int = 100):
    return self.db.query(NotificationShop).offset(skip).limit(limit).all()
  
  # ID指定で取得
  def get_by_id(self, notification_shop_id: int):
    return self.db.query(NotificationShop).filter(
      NotificationShop.id == notification_shop_id
    ).first()