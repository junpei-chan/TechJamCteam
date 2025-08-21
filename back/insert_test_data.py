import sys
import os
sys.path.append('/back')

from api.database import engine
from sqlalchemy import text

# テストデータを挿入
with engine.connect() as connection:
    # areaテーブルにデータを挿入
    connection.execute(text("INSERT IGNORE INTO areas (id, name) VALUES (1, 'Tokyo')"))
    
    # shopテーブルにデータを挿入
    connection.execute(text("""
        INSERT IGNORE INTO shops (id, area_id, name, shop_detail, address, phone) 
        VALUES (1, 1, 'Test Shop', 'Test shop description', 'Test Address', '123-456-7890')
    """))
    
    connection.commit()
    print("テストデータが正常に挿入されました")
