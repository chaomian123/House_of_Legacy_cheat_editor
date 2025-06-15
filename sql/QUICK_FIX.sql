-- 快速修复：暂时禁用RLS以便测试
-- 在Supabase SQL编辑器中运行这些命令

-- 1. 暂时禁用RLS
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE like_count DISABLE ROW LEVEL SECURITY;

-- 2. 确保匿名用户有完整权限
GRANT ALL ON likes TO anon;
GRANT ALL ON like_count TO anon;
GRANT ALL ON SEQUENCE likes_id_seq TO anon;

-- 3. 验证设置
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('likes', 'like_count');

-- 4. 测试插入（应该成功）
INSERT INTO likes (ip) VALUES ('test-ip');
SELECT * FROM likes WHERE ip = 'test-ip';

-- 5. 测试更新计数
UPDATE like_count SET count = count + 1 WHERE id = 1;
SELECT * FROM like_count; 