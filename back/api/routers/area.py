from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models
from ..schemas.area import AreaBase, AreaRead
from ..database import get_db

router = APIRouter(prefix="/areas", tags=["areas"])

# @router.get("/{area_id}", response_model=AreaRead)
# def get_area_by_id(area_id: int, db: Session = Depends(get_db)):
#   return db.query(models.Area).filter(models.Area.area_id == area_id).first()