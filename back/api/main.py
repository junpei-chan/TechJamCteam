from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from api.routers import menu, menu_single, users, shop, area, menu_favorites, favorites, auth, upload  # , genre  # 一時的にコメントアウト
from api.models import users as user_models
from api.models import area as area_models
from api.models import menu as menu_models
from api.models import menu as menu_models
from api.models import shop as shop_models
from api.models import menu_favorites as menu_favorites_models
from api.models import shop_users as shop_user_models
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

# 静的ファイルの配信設定
from pathlib import Path
static_path = Path(__file__).parent.parent / "static"
static_path.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

# CORS設定を強化
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3006", 
        "http://localhost:3000",
        "http://127.0.0.1:3006",
        "http://127.0.0.1:3000",
        "http://10.79.10.139:3006",  # 外部アクセス用
        "http://10.79.10.139:3000"   # 外部アクセス用
    ],  # フロントエンドのURL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With"
    ],
)

@app.on_event("startup")
async def startup_event():
  """アプリケーション開始時の処理"""
  create_tables()

app.include_router(menu.router)
app.include_router(menu_single.router)
app.include_router(users.router)
app.include_router(shop.router)
app.include_router(area.router)
# app.include_router(genre.router)  # 一時的にコメントアウト
app.include_router(menu_favorites.router)
app.include_router(favorites.router)
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(upload.router)

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