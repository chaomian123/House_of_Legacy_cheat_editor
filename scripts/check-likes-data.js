const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 手动读取 .env.local 文件
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  const env = {};
  
  try {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          }
        }
      });
    }
  } catch (error) {
    console.warn('无法读取 .env.local 文件:', error.message);
  }
  
  return env;
}

const envVars = loadEnvFile();
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Environment check:');
console.log('SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
console.log('SUPABASE_SERVICE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.log('Please check your .env.local file');
  console.log('Expected variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkLikesData() {
  try {
    console.log('\n🔍 检查点赞数据...\n');

    // 1. 获取总点赞数
    const { count: totalCount, error: countError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ 获取总点赞数失败:', countError);
      return;
    }

    console.log(`📊 总点赞数: ${totalCount}`);

    // 2. 获取最近的点赞记录（带详细信息）
    const { data: recentLikes, error: recentError } = await supabase
      .from('likes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('❌ 获取最近点赞记录失败:', recentError);
      return;
    }

    console.log(`\n📝 最近 ${recentLikes.length} 条点赞记录:`);
    recentLikes.forEach((like, index) => {
      const date = new Date(like.created_at);
      const formattedDate = date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      console.log(`${index + 1}. ID: ${like.id}, IP: ${like.ip}, 时间: ${formattedDate}`);
    });

    // 3. 按日期统计点赞数
    const { data: dailyStats, error: statsError } = await supabase
      .from('likes')
      .select('created_at');

    if (statsError) {
      console.error('❌ 获取统计数据失败:', statsError);
      return;
    }

    // 按日期分组统计
    const dateGroups = {};
    dailyStats.forEach(like => {
      const date = new Date(like.created_at).toLocaleDateString('zh-CN');
      dateGroups[date] = (dateGroups[date] || 0) + 1;
    });

    console.log('\n📅 按日期统计:');
    Object.entries(dateGroups)
      .sort((a, b) => new Date(b[0]) - new Date(a[0])) // 按日期倒序
      .slice(0, 7) // 显示最近7天
      .forEach(([date, count]) => {
        console.log(`${date}: ${count} 次点赞`);
      });

    // 4. 检查今天的点赞情况
    const today = new Date().toISOString().split('T')[0];
    const { count: todayCount, error: todayError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    if (!todayError) {
      console.log(`\n🕐 今天 (${today}) 的点赞数: ${todayCount}`);
    }

    // 5. 检查数据库表结构
    console.log('\n🏗️  数据库表信息:');
    const { data: tableInfo, error: tableError } = await supabase
      .from('likes')
      .select('*')
      .limit(1);

    if (tableInfo && tableInfo.length > 0) {
      const sampleRecord = tableInfo[0];
      console.log('字段信息:', Object.keys(sampleRecord));
    }

  } catch (error) {
    console.error('❌ 检查过程中出现错误:', error);
  }
}

async function testAPIEndpoint() {
  console.log('\n🧪 测试 API 端点...');
  
  try {
    // 模拟API调用
    const response = await fetch('http://localhost:3000/api/supabase-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'getLikes' }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API 返回:', data);
    } else {
      console.log('❌ API 错误:', response.status, await response.text());
    }
  } catch (error) {
    console.log('⚠️  无法连接到本地服务器 (需要先运行 npm run dev)');
  }
}

// 主函数
async function main() {
  await checkLikesData();
  await testAPIEndpoint();
  
  console.log('\n✅ 检查完成');
  console.log('\n💡 如果总点赞数显示为 0 或过少，可能的原因:');
  console.log('1. 数据库中确实没有点赞记录');
  console.log('2. 数据库连接配置有问题');
  console.log('3. 表权限设置不正确');
  console.log('4. 前端查询逻辑有问题');
}

main().catch(console.error); 