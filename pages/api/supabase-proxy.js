import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // 注意：这里用service key

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { action, payload } = req.body

    // 只处理点赞相关的操作
    if (action === 'like') {
      const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress
      
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

      // 插入新的点赞记录
      console.log('Inserting new like record')
      const { data, error } = await supabase
        .from('likes')
        .insert([{ ip: clientIP }])
        .select()

      if (error) {
        throw error
      }

      // 返回总点赞数
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })

      return res.status(200).json({ success: true, totalLikes: count })
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