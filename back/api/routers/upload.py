from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import uuid
from pathlib import Path
import shutil

router = APIRouter(prefix="/upload", tags=["upload"])

# アップロード用ディレクトリ
UPLOAD_DIR = Path(__file__).parent.parent.parent / "static" / "images"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# 許可する画像ファイルの拡張子
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

def is_allowed_file(filename: str) -> bool:
    """ファイル拡張子が許可されているかチェック"""
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    """画像ファイルをアップロード"""
    # ファイルサイズ制限（5MB）
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    
    # ファイルが選択されているかチェック
    if not file.filename:
        raise HTTPException(status_code=400, detail="ファイルが選択されていません")
    
    # ファイル拡張子チェック
    if not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=400, 
            detail="許可されていないファイル形式です。JPG, JPEG, PNG, GIF, WebPのみ対応しています"
        )
    
    # ファイルサイズチェック
    file_content = await file.read()
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="ファイルサイズが大きすぎます（最大5MB）")
    
    # ユニークなファイル名を生成
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    try:
        # ファイルを保存
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        
        # 保存されたファイルのURLを返す
        file_url = f"/static/images/{unique_filename}"
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "ファイルが正常にアップロードされました",
                "url": file_url,
                "filename": unique_filename
            }
        )
    
    except Exception as e:
        # アップロードに失敗した場合、ファイルが作成されていれば削除
        if file_path.exists():
            file_path.unlink()
        
        raise HTTPException(
            status_code=500, 
            detail=f"ファイルのアップロードに失敗しました: {str(e)}"
        )

@router.delete("/image/{filename}")
async def delete_image(filename: str):
    """画像ファイルを削除"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="ファイルが見つかりません")
    
    try:
        file_path.unlink()
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "ファイルが正常に削除されました"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"ファイルの削除に失敗しました: {str(e)}"
        )
