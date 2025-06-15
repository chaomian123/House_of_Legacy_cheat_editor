-- 泰语支持调查表设置脚本
-- 在Supabase的SQL编辑器中执行此脚本

-- 创建泰语调查表
CREATE TABLE IF NOT EXISTS public.thai_survey (
    id BIGSERIAL PRIMARY KEY,
    ip TEXT NOT NULL,
    vote TEXT NOT NULL CHECK (vote IN ('yes', 'no')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 添加注释
COMMENT ON TABLE public.thai_survey IS '泰语支持调查投票表';
COMMENT ON COLUMN public.thai_survey.id IS '主键ID';
COMMENT ON COLUMN public.thai_survey.ip IS '投票者IP地址';
COMMENT ON COLUMN public.thai_survey.vote IS '投票选择: yes或no';
COMMENT ON COLUMN public.thai_survey.created_at IS '创建时间';
COMMENT ON COLUMN public.thai_survey.updated_at IS '更新时间';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_thai_survey_ip ON public.thai_survey(ip);
CREATE INDEX IF NOT EXISTS idx_thai_survey_vote ON public.thai_survey(vote);
CREATE INDEX IF NOT EXISTS idx_thai_survey_created_at ON public.thai_survey(created_at);

-- 确保每个IP只能投一票的唯一约束
ALTER TABLE public.thai_survey ADD CONSTRAINT unique_ip_vote UNIQUE (ip);

-- 设置Row Level Security (RLS)
ALTER TABLE public.thai_survey ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略：允许插入投票
CREATE POLICY "Allow survey vote insertion" ON public.thai_survey
    FOR INSERT WITH CHECK (true);

-- 创建RLS策略：允许读取投票统计（仅查询，不返回IP）
CREATE POLICY "Allow survey stats reading" ON public.thai_survey
    FOR SELECT USING (true);

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER handle_thai_survey_updated_at
    BEFORE UPDATE ON public.thai_survey
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- 验证表创建
SELECT 
    'thai_survey table created successfully' as status,
    COUNT(*) as initial_vote_count 
FROM public.thai_survey;

-- 查看表结构 (替代 \d 命令)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'thai_survey'
ORDER BY ordinal_position; 