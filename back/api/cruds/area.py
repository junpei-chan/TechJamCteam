from sqlalchemy.orm import Session
from models import area as area_model
from models import shop as shop_model
from models import menu as menu_model
from schemas.shop import ShopWithMenus

def get_menus_by_area(db: Session, area_id: int):
  shops = db.query(shop_model.Shop).filter(shop_model.Shop.area_id == area_id).all()

  result = []
  for shop in shops:
    menus = db.query(menu_model.Menu).filter(menu_model.Menu.shop_id == shop.id).all()
    result.append({
      "shop_name": shop.name,
      "menus": menus
    })
  return result