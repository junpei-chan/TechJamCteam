from fastapi import FastAPI
from .database import engine, Base
from .routers import menu, shop

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Menu API", version="1.0.0")

app.include_router(menu.router)
app.include_router(shop.router)

@app.get("/")
def read_root():
  return {"message": "Tech Jam Cteam!"}