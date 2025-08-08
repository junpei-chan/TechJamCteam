from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas.menu import MenuResponse
from ..cruds.menu import MenuCRUD
from ..database import get_db

router = APIRouter(prefix="/menu", tags=["menu-single"])

@router.get("/{menu_id}", response_model=MenuResponse)
def get_menu(menu_id: int, db: Session = Depends(get_db)):
  """メニューの詳細を取得（単数形パス）"""
  crud = MenuCRUD(db)
  menu = crud.get_menu(menu_id)
  if menu is None:
    raise HTTPException(status_code=404, detail="Menu not found")
  return menu
