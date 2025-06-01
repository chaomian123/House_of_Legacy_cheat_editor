# Supabase 数据库设置说明 / Supabase Database Setup Guide

## 环境变量配置 / Environment Variables

### 1. 创建Supabase项目

1. 访问 https://supabase.com 并创建账户
2. 创建新项目
3. 在项目设置中找到API配置
4. 获取以下信息：
   - Project URL
   - Anon public key

### 2. 设置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

对于Vercel部署，在项目设置中添加这些环境变量。

## 数据库设置 / Database Setup

### 1. 创建数据表

在Supabase SQL编辑器中运行以下SQL：

```sql
-- 创建点赞记录表
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  ip VARCHAR(45) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引提高查询性能（修复版本）
CREATE INDEX idx_likes_ip ON likes(ip);
CREATE INDEX idx_likes_created_at ON likes(created_at);

-- 创建点赞计数表
CREATE TABLE like_count (
  id INTEGER PRIMARY KEY DEFAULT 1,
  count INTEGER DEFAULT 0
);

-- 插入初始计数记录
INSERT INTO like_count (id, count) VALUES (1, 0);

-- 设置RLS (Row Level Security) 策略
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE like_count ENABLE ROW LEVEL SECURITY;

-- 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Allow anonymous read access" ON likes;
DROP POLICY IF EXISTS "Allow anonymous insert access" ON likes;
DROP POLICY IF EXISTS "Allow anonymous read access" ON like_count;
DROP POLICY IF EXISTS "Allow anonymous update access" ON like_count;

-- 为likes表创建新的策略
CREATE POLICY "Enable read access for all users" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON likes
  FOR INSERT WITH CHECK (true);

-- 为like_count表创建新的策略
CREATE POLICY "Enable read access for all users" ON like_count
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON like_count
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON like_count
  FOR UPDATE USING (true) WITH CHECK (true);

-- 确保匿名用户有访问权限
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT ON likes TO anon;
GRANT SELECT, INSERT, UPDATE ON like_count TO anon;
GRANT USAGE, SELECT ON SEQUENCE likes_id_seq TO anon;
```

### 2. 验证表结构

确保表结构正确创建：

```sql
-- 查看表结构（使用标准SQL）
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'likes' 
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'like_count' 
ORDER BY ordinal_position;

-- 查看表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('likes', 'like_count');

-- 测试插入数据
INSERT INTO likes (ip) VALUES ('127.0.0.1');
SELECT * FROM likes;

-- 查看计数表
SELECT * FROM like_count;

-- 测试更新权限
UPDATE like_count SET count = count + 1 WHERE id = 1;
SELECT * FROM like_count;
```

## 功能说明 / Features

### 点赞功能 / Like Feature
- ✅ 用户可以为项目点赞
- ✅ 每个 IP 地址每天只能点赞一次
- ✅ 实时显示总点赞数
- ✅ 使用Supabase实时数据库
- ✅ 响应式 UI 设计
- ✅ 支持静态导出部署

### 数据库结构 / Database Schema

#### likes 表
- `id`: 自增主键
- `ip`: 用户 IP 地址 (VARCHAR(45))
- `created_at`: 点赞时间 (TIMESTAMP WITH TIME ZONE)

#### like_count 表
- `id`: 固定为1的主键
- `count`: 总点赞数

## 技术栈 / Tech Stack
- **数据库**: Supabase (PostgreSQL)
- **前端**: React + Chakra UI
- **部署**: 静态导出 (支持Vercel, Netlify, GitHub Pages等)
- **IP获取**: ipify.org API

## 部署说明 / Deployment

由于使用了静态导出，这个项目可以部署到任何静态托管服务：

1. **Vercel**: 直接连接GitHub仓库
2. **Netlify**: 拖拽dist文件夹或连接Git
3. **GitHub Pages**: 使用GitHub Actions构建部署
4. **其他CDN**: 上传构建后的静态文件

构建命令：
```bash
npm run build
```

输出目录：`out/` 