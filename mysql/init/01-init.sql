-- MySQL初期化スクリプト
-- データベースが存在しない場合のみ作成
CREATE DATABASE IF NOT EXISTS menu_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 必要に応じて専用ユーザーを作成
-- CREATE USER IF NOT EXISTS 'menu_user'@'%' IDENTIFIED BY 'menu_password';
-- GRANT ALL PRIVILEGES ON menu_app.* TO 'menu_user'@'%';
-- FLUSH PRIVILEGES;
