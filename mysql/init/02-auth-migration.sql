-- ユーザーテーブルにパスワードハッシュカラムを追加
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL;

-- 店舗ユーザーテーブルを作成
CREATE TABLE IF NOT EXISTS shop_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shop_id INT NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_shop_users_username (username),
  INDEX idx_shop_users_email (email),
  FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);
