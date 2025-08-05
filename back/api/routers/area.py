from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..cruds import area as area_crud
from ..schemas.shop import ShopWithMenus
from typing import List

router = APIRouter(prefix="/areas", tags=["areas"])

@router.get("/{area_id}/menus", response_model=List[ShopWithMenus])
def read_menus_by_area(area_id: int, db: Session = Depends(get_db)):
    return area_crud.get_menus_by_area(db, area_id)