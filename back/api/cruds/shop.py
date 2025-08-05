from sqlalchemy.orm import Session
from .. import models, schemas

# ShopCreateのデータを受け取り、DBに新規登録
def create_shop(db: Session, shop: schemas.ShopCreate):
  db_shop = models.Shop(**shop.dict())
  db.add(db_shop)
  db.commit()
  db.refresh(db_shop)
  return db_shop

# 店舗一覧を取得（最大100件、任意のスキップ付き）
def get_shops(db: Session, skip: int = 0, limit: int = 100):
  return db.query(models.Shop).offset(skip).limit(limit).all()

# 特定のIDの店舗を一件取得
def get_shop_by_id(db: Session, shop_id: int):
  return db.query(models.Shop).filter(models.Shop.shop_id == shop_id).first()

# 店舗情報の更新
def update_shop(db: Session, shop_id, shop_update: schemas.ShopUpdate):
  db_shop = db.query(models.Shop).filter(models.Shop.shop_id == shop_id).first()
  if not db_shop:
    return None   # NotFound対応
  
  for key, value in shop_update.dict().items():
    setattr(db_shop, key, value)    # モデルの各属性に新しい値を代入

  db.commit()
  db.refresh(db_shop)
  return db_shop

# 店舗情報の削除
def delete_shop(db: Session, shop_id: int):
  db_shop = db.query(models.Shop).filter(models.Shop.shop_id == shop_id).first()
  if not db_shop:
    return None

  db.delete(db_shop)
  db.commit()
  return db_shop