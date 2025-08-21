from sqlalchemy.orm import Session
from ..models.menu_favorites import MenuFavorites
from ..schemas.menu_favorites import MenuFavoritesBase

class MenuFavoritesCRUD:
    def __init__(self, db: Session):
        self.db = db
    
    def get_favorite(self, user_id: int, menu_id: int):
        """特定のユーザーとメニューのお気に入り関係を取得"""
        return self.db.query(MenuFavorites).filter(
            MenuFavorites.user_id == user_id,
            MenuFavorites.menu_id == menu_id
        ).first()
    
    def get_user_favorites(self, user_id: int):
        """ユーザーのお気に入りメニュー一覧を取得"""
        return self.db.query(MenuFavorites).filter(
            MenuFavorites.user_id == user_id
        ).all()
    
    def add_favorite(self, favorite: MenuFavoritesBase):
        """お気に入りを追加"""
        db_favorite = MenuFavorites(
            user_id=favorite.user_id,
            menu_id=favorite.menu_id
        )
        self.db.add(db_favorite)
        self.db.commit()
        self.db.refresh(db_favorite)
        return db_favorite
    
    def remove_favorite(self, user_id: int, menu_id: int):
        """お気に入りを削除"""
        favorite = self.get_favorite(user_id, menu_id)
        if favorite:
            self.db.delete(favorite)
            self.db.commit()
            return True
        return False