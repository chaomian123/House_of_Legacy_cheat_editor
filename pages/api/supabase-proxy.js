import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // 注意：这里用service key

// 调试环境变量
console.log('Environment variables check:', {
  supabaseUrl: supabaseUrl ? `${supabaseUrl.slice(0, 20)}...` : 'MISSING',
  supabaseServiceKey: supabaseServiceKey ? `${supabaseServiceKey.slice(0, 20)}...` : 'MISSING',
  nodeEnv: process.env.NODE_ENV
});

// 检查环境变量
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables:', {
    supabaseUrl: !!supabaseUrl,
    supabaseServiceKey: !!supabaseServiceKey
  });
}

let supabase = null;

try {
  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client created successfully');
  }
} catch (error) {
  console.error('Failed to create Supabase client:', error);
}

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 检查Supabase配置
  if (!supabase) {
    console.error('Supabase client not initialized')
    
    // 临时解决方案：返回模拟数据
    if (req.body.action === 'getLikes') {
      return res.status(200).json({ totalLikes: 0 });
    }
    if (req.body.action === 'like') {
      return res.status(200).json({ success: true, totalLikes: 1 });
    }
    
    return res.status(500).json({ error: 'Database configuration error' })
  }

  try {
    const { action, payload } = req.body

    // 调试接口：检查环境变量状态（包括空请求）
    if (action === 'debug' || !action) {
      return res.status(200).json({
        message: action ? 'Debug info' : 'No action provided - showing debug info',
        environmentCheck: {
          supabaseUrl: supabaseUrl ? `${supabaseUrl.slice(0, 30)}...` : 'MISSING',
          supabaseServiceKey: supabaseServiceKey ? `${supabaseServiceKey.slice(0, 30)}...` : 'MISSING',
          supabaseClientInitialized: !!supabase,
          nodeEnv: process.env.NODE_ENV
        }
      });
    }

    // 只处理点赞相关的操作
    if (action === 'like') {
      const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress || '127.0.0.1'
      
      console.log('Processing like from IP:', clientIP)
      
      // 检查今日是否已点赞
      const today = new Date().toISOString().split('T')[0]
      
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('ip', clientIP)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`)
        .maybeSingle()

      if (checkError) {
        console.error('Error checking existing like:', checkError)
        return res.status(500).json({ 
          error: 'Database query error',
          details: checkError.message
        })
      }

      if (existingLike) {
        console.log('User already liked today')
        return res.status(400).json({ error: 'Already liked today' })
      }

      // 插入新的点赞记录（只插入IP，地理位置列保持为NULL）
      console.log('Inserting new like record')
      
      try {
        const { data, error } = await supabase
          .from('likes')
          .insert([{ ip: clientIP }])
          .select()

        if (error) {
          console.error('Error inserting like:', error)
          throw error
        }

        console.log('Like inserted successfully:', data[0]?.id)

        // 返回总点赞数
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })

        console.log('Total likes count:', count)
        return res.status(200).json({ success: true, totalLikes: count })
        
      } catch (insertError) {
        console.error('Error in like insertion:', insertError)
        return res.status(500).json({ 
          error: 'Database query error',
          details: insertError.message
        })
      }
    }

    if (action === 'getLikes') {
      console.log('Getting likes count')
      const { count, error: countError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        console.error('Error getting likes count:', countError)
        return res.status(500).json({ 
          error: 'Failed to get likes count',
          details: countError.message
        })
      }

      console.log('Current likes count:', count)
      return res.status(200).json({ totalLikes: count })
    }

    if (action === 'submitSuggestion') {
      const { username, suggestion } = payload || {}
      
      // 验证必填字段
      if (!suggestion || !suggestion.trim()) {
        return res.status(400).json({ error: 'Suggestion content is required' })
      }

      const clientIP = req.headers['x-forwarded-for'] || 
                       req.headers['x-real-ip'] || 
                       req.connection.remoteAddress ||
                       '127.0.0.1'

      const userAgent = req.headers['user-agent'] || null

      console.log('Submitting suggestion from IP:', clientIP)
      
      try {
        const { data, error } = await supabase
          .from('suggestions')
          .insert([{
            username: username?.trim() || null,
            suggestion: suggestion.trim(),
            user_agent: userAgent
          }])
          .select()

        if (error) {
          console.error('Error inserting suggestion:', error)
          return res.status(500).json({ 
            error: 'Failed to submit suggestion',
            details: error.message
          })
        }

        console.log('Suggestion submitted successfully:', data[0]?.id)
        return res.status(200).json({ 
          success: true, 
          message: 'Suggestion submitted successfully',
          id: data[0]?.id 
        })

      } catch (error) {
        console.error('Error in suggestion submission:', error)
        return res.status(500).json({ 
          error: 'Failed to submit suggestion',
          details: error.message
        })
      }
    }

    return res.status(400).json({ error: 'Invalid action' })

  } catch (error) {
    console.error('Supabase proxy error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 