from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from ..models.menu import Menu
from ..schemas.menu import MenuCreate, MenuUpdate

class MenuCRUD:
  def __init__(self, db: Session):
    self.db = db
  
  def get_menu(self, menu_id: int) -> Optional[Menu]:
    """メニューの詳細を取得"""
    return self.db.query(Menu).filter(Menu.id == menu_id).first()
  
  def get_menus(
    self, 
    skip: int = 0, 
    limit: int = 10,
    category: Optional[str] = None,
    search: Optional[str] = None,
    available_only: bool = True
  ) -> List[Menu]:
    """メニュー一覧を取得"""
    query = self.db.query(Menu)
    
    if available_only:
      query = query.filter(Menu.is_available == True)
    
    if category:
      query = query.filter(Menu.category == category)
    
    if search:
      query = query.filter(
        or_(
          Menu.name.contains(search),
          Menu.description.contains(search)
        )
      )
    
    return query.offset(skip).limit(limit).all()
  
  def get_menus_count(
    self,
    category: Optional[str] = None,
    search: Optional[str] = None,
    available_only: bool = True
  ) -> int:
    """メニューの総数を取得"""
    query = self.db.query(Menu)
    
    if available_only:
      query = query.filter(Menu.is_available == True)
    
    if category:
      query = query.filter(Menu.category == category)
    
    if search:
      query = query.filter(
        or_(
          Menu.name.contains(search),
          Menu.description.contains(search)
        )
      )
    
    return query.count()
  
  def create_menu(self, menu: MenuCreate) -> Menu:
    """新しいメニューを作成"""
    db_menu = Menu(**menu.dict())
    self.db.add(db_menu)
    self.db.commit()
    self.db.refresh(db_menu)
    return db_menu
  
  def update_menu(self, menu_id: int, menu: MenuUpdate) -> Optional[Menu]:
    """メニューを更新"""
    db_menu = self.get_menu(menu_id)
    if db_menu:
        update_data = menu.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_menu, field, value)
        self.db.commit()
        self.db.refresh(db_menu)
    return db_menu
  
  def delete_menu(self, menu_id: int) -> bool:
    """メニューを削除"""
    db_menu = self.get_menu(menu_id)
    if db_menu:
        self.db.delete(db_menu)
        self.db.commit()
        return True
    return False
