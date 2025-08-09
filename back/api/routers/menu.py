from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..schemas.menu import MenuCreate, MenuUpdate, MenuResponse, MenuListResponse
from ..cruds.menu import MenuCRUD
from ..database import get_db
from ..routers.auth import get_current_shop_user
from ..models.shop_users import ShopUsers

router = APIRouter(prefix="/menus", tags=["menus"])

@router.get("/", response_model=MenuListResponse)
def get_menus(
  page: int = Query(1, ge=1),
  per_page: int = Query(10, ge=1, le=100),
  category: Optional[str] = None,
  search: Optional[str] = None,
  shop_id: Optional[int] = None,
  available_only: bool = True,
  db: Session = Depends(get_db)
):
  """メニュー一覧を取得"""
  skip = (page - 1) * per_page
  crud = MenuCRUD(db)
  
  menus = crud.get_menus(
    skip=skip, 
    limit=per_page, 
    category=category, 
    search=search,
    shop_id=shop_id,
    available_only=available_only
  )
  total = crud.get_menus_count(
    category=category, 
    search=search,
    shop_id=shop_id,
    available_only=available_only
  )
  
  return MenuListResponse(
    items=menus,
    total=total,
    page=page,
    per_page=per_page
  )

@router.get("/{menu_id}", response_model=MenuResponse)
def get_menu(menu_id: int, db: Session = Depends(get_db)):
  """メニューの詳細を取得"""
  crud = MenuCRUD(db)
  menu = crud.get_menu(menu_id)
  if menu is None:
    raise HTTPException(status_code=404, detail="Menu not found")
  return menu

@router.post("/", response_model=MenuResponse)
def create_menu(
  menu: MenuCreate, 
  db: Session = Depends(get_db),
  current_shop_user: ShopUsers = Depends(get_current_shop_user)
):
  """新しいメニューを作成"""
  # 店舗ユーザーが自分の店舗のメニューのみ作成できるようにチェック
  if menu.shop_id != current_shop_user.shop_id:
    raise HTTPException(status_code=403, detail="You can only create menus for your own shop")
  
  crud = MenuCRUD(db)
  return crud.create_menu(menu)

@router.post("/test", response_model=MenuResponse)
def create_menu_test(menu: MenuCreate, db: Session = Depends(get_db)):
  """新しいメニューを作成（テスト用、認証なし）"""
  crud = MenuCRUD(db)
  return crud.create_menu(menu)

@router.put("/{menu_id}", response_model=MenuResponse)
def update_menu(menu_id: int, menu: MenuUpdate, db: Session = Depends(get_db)):
  """メニューを更新"""
  crud = MenuCRUD(db)
  updated_menu = crud.update_menu(menu_id, menu)
  if updated_menu is None:
    raise HTTPException(status_code=404, detail="Menu not found")
  return updated_menu

@router.delete("/{menu_id}")
def delete_menu(menu_id: int, db: Session = Depends(get_db)):
  """メニューを削除"""
  crud = MenuCRUD(db)
  success = crud.delete_menu(menu_id)
  if not success:
    raise HTTPException(status_code=404, detail="Menu not found")
  return {"message": "Menu deleted successfully"}
