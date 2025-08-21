#!/usr/bin/env python3
"""
データベース接続テストスクリプト
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.database import engine, SessionLocal
from api.models.menu import Menu

def test_connection():
    """データベース接続をテスト"""
    try:
        with engine.connect() as connection:
            print("✅ データベース接続成功")
        
        from api.database import Base
        Base.metadata.create_all(bind=engine)
        print("✅ テーブル作成成功")
        
        db = SessionLocal()
        try:
            count = db.query(Menu).count()
            print(f"✅ セッション接続成功 - メニュー件数: {count}")
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ データベース接続エラー: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("データベース接続をテスト中...")
    if test_connection():
        print("🎉 すべてのテストが成功しました！")
    else:
        print("💥 テストに失敗しました。設定を確認してください。")
        sys.exit(1)
