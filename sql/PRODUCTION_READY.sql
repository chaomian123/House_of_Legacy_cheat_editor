-- 生产就绪的RLS配置
-- 既安全又能正常工作

-- 1. 重新启用RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE like_count ENABLE ROW LEVEL SECURITY;

-- 2. 删除所有现有策略
DROP POLICY IF EXISTS "Enable read access for all users" ON likes;
DROP POLICY IF EXISTS "Enable insert access for all users" ON likes;
DROP POLICY IF EXISTS "Enable read access for all users" ON like_count;
DROP POLICY IF EXISTS "Enable insert access for all users" ON like_count;
DROP POLICY IF EXISTS "Enable update access for all users" ON like_count;

-- 3. 为 likes 表创建新策略
CREATE POLICY "Allow public read" ON likes
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert" ON likes
    FOR INSERT 
    WITH CHECK (true);

-- 4. 为 like_count 表创建新策略
CREATE POLICY "Allow public read" ON like_count
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert" ON like_count
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update" ON like_count
    FOR UPDATE 
    USING (true) 
    WITH CHECK (true);

-- 5. 确保 anon 角色权限正确
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 基本表权限
GRANT SELECT, INSERT ON likes TO anon;
GRANT SELECT, INSERT, UPDATE ON like_count TO anon;

-- 序列权限
GRANT USAGE, SELECT ON SEQUENCE likes_id_seq TO anon;

-- 6. 验证策略是否生效
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('likes', 'like_count');

-- 7. 测试操作
INSERT INTO likes (ip) VALUES ('production-test');
UPDATE like_count SET count = count + 1 WHERE id = 1;
SELECT * FROM like_count; 