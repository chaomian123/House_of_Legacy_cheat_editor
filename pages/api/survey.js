import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// 调试环境变量
console.log('Survey API Environment variables check:', {
  supabaseUrl: supabaseUrl ? `${supabaseUrl.slice(0, 20)}...` : 'MISSING',
  supabaseServiceKey: supabaseServiceKey ? `${supabaseServiceKey.slice(0, 20)}...` : 'MISSING',
  nodeEnv: process.env.NODE_ENV
});

let supabase = null;

try {
  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client created successfully for survey');
  }
} catch (error) {
  console.error('Failed to create Supabase client for survey:', error);
}

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 检查Supabase配置
  if (!supabase) {
    console.error('Supabase client not initialized for survey')
    return res.status(500).json({ error: 'Database configuration error' })
  }

  try {
    const { action, vote } = req.body || {}

    // 处理POST请求 - 投票
    if (req.method === 'POST' && action === 'vote') {
      if (!vote || (vote !== 'yes' && vote !== 'no')) {
        return res.status(400).json({ error: 'Invalid vote. Must be "yes" or "no"' })
      }

      const clientIP = req.headers['x-forwarded-for'] || 
                      req.headers['x-real-ip'] || 
                      req.connection.remoteAddress || 
                      '127.0.0.1'
      
      console.log('Processing survey vote from IP:', clientIP, 'Vote:', vote)
      
      // 检查是否已经投过票
      const { data: existingVote, error: checkError } = await supabase
        .from('thai_survey')
        .select('id')
        .eq('ip', clientIP)
        .maybeSingle()

      if (checkError) {
        console.error('Error checking existing vote:', checkError)
        return res.status(500).json({ 
          error: 'Database query error',
          details: checkError.message
        })
      }

      if (existingVote) {
        console.log('User already voted')
        return res.status(400).json({ error: 'You have already voted' })
      }

      // 插入新的投票记录
      console.log('Inserting new vote record')
      
      const { data, error } = await supabase
        .from('thai_survey')
        .insert([{ 
          ip: clientIP, 
          vote: vote,
          created_at: new Date().toISOString()
        }])
        .select()

      if (error) {
        console.error('Error inserting vote:', error)
        return res.status(500).json({ 
          error: 'Database insert error',
          details: error.message
        })
      }

      console.log('Vote inserted successfully:', data[0]?.id)

      // 返回当前投票统计
      const stats = await getSurveyStats(supabase)
      return res.status(200).json({ 
        success: true, 
        message: 'Vote recorded successfully',
        stats 
      })
    }

    // 处理GET请求 - 获取统计
    if (req.method === 'GET') {
      console.log('Getting survey statistics')
      const stats = await getSurveyStats(supabase)
      return res.status(200).json({ stats })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (error) {
    console.error('Survey API error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    })
  }
}

// 获取调查统计的辅助函数
async function getSurveyStats(supabase) {
  try {
    // 获取总投票数
    const { count: totalCount, error: totalError } = await supabase
      .from('thai_survey')
      .select('*', { count: 'exact', head: true })

    if (totalError) throw totalError

    // 获取YES投票数
    const { count: yesCount, error: yesError } = await supabase
      .from('thai_survey')
      .select('*', { count: 'exact', head: true })
      .eq('vote', 'yes')

    if (yesError) throw yesError

    // 获取NO投票数
    const { count: noCount, error: noError } = await supabase
      .from('thai_survey')
      .select('*', { count: 'exact', head: true })
      .eq('vote', 'no')

    if (noError) throw noError

    return {
      total: totalCount || 0,
      yes: yesCount || 0,
      no: noCount || 0,
      yesPercentage: totalCount > 0 ? ((yesCount / totalCount) * 100).toFixed(1) : 0,
      noPercentage: totalCount > 0 ? ((noCount / totalCount) * 100).toFixed(1) : 0
    }
  } catch (error) {
    console.error('Error getting survey stats:', error)
    return {
      total: 0,
      yes: 0,
      no: 0,
      yesPercentage: 0,
      noPercentage: 0
    }
  }
} 