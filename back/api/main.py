from fastapi import FastAPI
from .database import engine, Base
from .routers import menu
import time
import logging
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_tables():
  """データベーステーブルを作成（リトライ機能付き）"""
  max_retries = 30
  retry_delay = 2
  
  for attempt in range(max_retries):
    try:
      Base.metadata.create_all(bind=engine)
      logger.info("データベーステーブルの作成に成功しました")
      return
    except Exception as e:
      logger.warning(f"データベース接続試行 {attempt + 1}/{max_retries} 失敗: {e}")
      if attempt < max_retries - 1:
        time.sleep(retry_delay)
      else:
        logger.error("データベースへの接続に失敗しました")
        raise

app = FastAPI(title="Menu API", version="1.0.0")

@app.on_event("startup")
async def startup_event():
  """アプリケーション開始時の処理"""
  create_tables()

app.include_router(menu.router)

@app.get("/health")
def health_check():
  """ヘルスチェックエンドポイント"""
  try:
    with engine.connect() as connection:
      connection.execute(text("SELECT 1"))
    return {"status": "healthy", "database": "connected"}
  except Exception as e:
    return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

@app.get("/")
def read_root():
  return {"message": "Tech Jam Cteam!"}