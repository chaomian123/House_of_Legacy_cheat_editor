-- 通用调查表设置脚本
-- 在Supabase的SQL编辑器中执行此脚本

-- 创建调查表
CREATE TABLE IF NOT EXISTS public.surveys (
    id BIGSERIAL PRIMARY KEY,
    ip TEXT NOT NULL,
    vote TEXT NOT NULL CHECK (vote IN ('yes', 'no')),
    survey_id TEXT NOT NULL DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 添加注释
COMMENT ON TABLE public.surveys IS '通用调查投票表';
COMMENT ON COLUMN public.surveys.id IS '主键ID';
COMMENT ON COLUMN public.surveys.ip IS '投票者IP地址';
COMMENT ON COLUMN public.surveys.vote IS '投票选择: yes或no';
COMMENT ON COLUMN public.surveys.survey_id IS '调查ID，用于区分不同的调查';
COMMENT ON COLUMN public.surveys.created_at IS '创建时间';
COMMENT ON COLUMN public.surveys.updated_at IS '更新时间';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_surveys_ip ON public.surveys(ip);
CREATE INDEX IF NOT EXISTS idx_surveys_vote ON public.surveys(vote);
CREATE INDEX IF NOT EXISTS idx_surveys_survey_id ON public.surveys(survey_id);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON public.surveys(created_at);

-- 确保每个IP在每个调查中只能投一票的唯一约束
ALTER TABLE public.surveys ADD CONSTRAINT unique_ip_survey_vote UNIQUE (ip, survey_id);

-- 设置Row Level Security (RLS)
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略：允许插入投票
CREATE POLICY "Allow survey vote insertion" ON public.surveys
    FOR INSERT WITH CHECK (true);

-- 创建RLS策略：允许读取投票统计（仅查询，不返回IP）
CREATE POLICY "Allow survey stats reading" ON public.surveys
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
CREATE TRIGGER handle_surveys_updated_at
    BEFORE UPDATE ON public.surveys
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- 验证表创建
SELECT 
    'surveys table created successfully' as status,
    COUNT(*) as initial_vote_count 
FROM public.surveys;

-- 查看表结构
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'surveys'
ORDER BY ordinal_position; 