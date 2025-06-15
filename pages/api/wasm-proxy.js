/**
 * WASM资源代理API
 * 用于解决跨域问题，代理从外部域名获取WASM和JS资源
 */

export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: '请提供URL参数' });
  }

  try {
    console.log(`WASM代理: 正在获取资源 ${url}`);

    const fetchOptions = {
      method: 'GET',
      headers: {
        'User-Agent': req.headers['user-agent'] || 'NextJS-WASM-Proxy',
      },
      credentials: 'omit',
      redirect: 'follow',
    };

    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      console.error(`WASM代理错误: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ 
        error: `从源服务器获取资源失败: ${response.status} ${response.statusText}` 
      });
    }

    const contentType = response.headers.get('content-type');
    
    // 设置适当的响应头
    res.setHeader('Content-Type', contentType || 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');  // 允许任何源访问
    
    // 如果是二进制文件(wasm)，返回ArrayBuffer
    if (contentType && (contentType.includes('application/wasm') || url.endsWith('.wasm'))) {
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
      console.log(`WASM代理: 成功代理二进制资源 ${url} (${buffer.byteLength} 字节)`);
    } else {
      // 否则返回文本(js)
      const text = await response.text();
      res.send(text);
      console.log(`WASM代理: 成功代理文本资源 ${url} (${text.length} 字符)`);
    }
  } catch (error) {
    console.error('WASM代理错误:', error);
    return res.status(500).json({ 
      error: `代理请求失败: ${error.message}`,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
} 