-- =============================================
-- シール管理アプリ: Supabase テーブル作成SQL
-- =============================================

-- ユーザーのシール所持データ
CREATE TABLE user_stickers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL,
  sticker_id  TEXT NOT NULL,
  count       INTEGER NOT NULL DEFAULT 1 CHECK (count >= 0),
  acquired_at TIMESTAMPTZ DEFAULT now(),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),

  UNIQUE (user_id, sticker_id)
);

-- updated_at を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_stickers_updated_at
  BEFORE UPDATE ON user_stickers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- パフォーマンス用インデックス
CREATE INDEX idx_user_stickers_user_id ON user_stickers(user_id);
CREATE INDEX idx_user_stickers_sticker_id ON user_stickers(sticker_id);

-- =============================================
-- RLS（Row Level Security）
-- 認証を有効にする場合は以下をONにしてください
-- =============================================

-- ALTER TABLE user_stickers ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Users can view own stickers"
--   ON user_stickers FOR SELECT
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert own stickers"
--   ON user_stickers FOR INSERT
--   WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update own stickers"
--   ON user_stickers FOR UPDATE
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Users can delete own stickers"
--   ON user_stickers FOR DELETE
--   USING (auth.uid() = user_id);

-- =============================================
-- 開発用: RLSなしで全アクセス許可
-- =============================================
ALTER TABLE user_stickers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for development"
  ON user_stickers FOR ALL
  USING (true)
  WITH CHECK (true);
