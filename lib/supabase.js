import { createClient } from '@supabase/supabase-js'

// 开发环境和生产环境配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 开发环境特殊配置（可选）
const isDevelopment = process.env.NODE_ENV === 'development'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // 点赞功能不需要持久化会话
  },
  // 开发环境可以启用更详细的日志
  ...(isDevelopment && {
    db: {
      schema: 'public'
    }
  })
})

// 导出环境信息，方便调试
export const ENV_INFO = {
  isDevelopment,
  supabaseUrl: supabaseUrl?.substring(0, 30) + '...' // 只显示部分URL用于调试
} 