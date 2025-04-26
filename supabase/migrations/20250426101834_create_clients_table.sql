CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- UUIDを自動生成
  name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- レコード作成時のタイムスタンプ
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- レコード更新時のタイムスタンプ
);