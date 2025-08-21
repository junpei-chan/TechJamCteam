from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..schemas.users import UserResponse, UserCreate
from ..cruds.users import UsersCRUD
from ..database import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
  crud = UsersCRUD(db)
  user = crud.get_user(user_id)

  if user is None:
    raise HTTPException(status_code=404, detail="User not found")
  return user

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
  crud = UsersCRUD(db)
  created_user = crud.create_user(user)
  return created_user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
  crud = UsersCRUD(db)
  updated_user = crud.update_user(user_id, user)

  if updated_user is None:
    raise HTTPException(status_code=404, detail="User not found")
  return updated_user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
  crud = UsersCRUD(db)
  crud.delete_user(user_id)
  return {"message": "User deleted successfully"}