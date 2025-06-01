-- 创建建议表
CREATE TABLE public.suggestions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamptz DEFAULT now() NOT NULL,
    username text,  -- 可选的用户昵称
    suggestion text NOT NULL,  -- 建议内容
    user_agent text,  -- 用户UA信息
    status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'processed', 'rejected'))
);

-- 启用 RLS
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- 允许任何人提交建议
CREATE POLICY "Allow public suggestion submissions"
ON public.suggestions
FOR INSERT
WITH CHECK (true);

-- 只允许认证用户查看建议（管理员功能）
CREATE POLICY "Allow authenticated read"
ON public.suggestions
FOR SELECT
USING (auth.role() = 'authenticated');

-- 为了更好的性能，创建一些索引
CREATE INDEX idx_suggestions_created_at ON public.suggestions(created_at DESC);
CREATE INDEX idx_suggestions_status ON public.suggestions(status);

-- 插入示例数据（可选）
INSERT INTO public.suggestions (username, suggestion, status) VALUES 
('测试用户', '希望能添加更多的编辑功能', 'new'),
('匿名', '界面很棒，感谢开发者！', 'read');

-- 授权给 anon 角色插入权限
GRANT INSERT ON public.suggestions TO anon;
GRANT USAGE ON SCHEMA public TO anon; 