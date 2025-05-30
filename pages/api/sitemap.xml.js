import fs from 'fs';
import path from 'path';

// 定义网站的基础URL
const SITE_URL = 'https://savefile.space';

// 定义页面配置
const pages = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0] + 'T00:00:00+00:00'
  },
  {
    url: '/changelog',
    changefreq: 'weekly', // 更新日志页面更新频繁
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0] + 'T00:00:00+00:00'
  },
  {
    url: '/faq',
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0] + 'T00:00:00+00:00'
  },
  {
    url: '/privacy',
    changefreq: 'yearly',
    priority: '0.5',
    lastmod: '2025-05-28T00:00:00+00:00'
  },
  {
    url: '/terms',
    changefreq: 'yearly',
    priority: '0.5',
    lastmod: '2025-05-28T00:00:00+00:00'
  }
];

// 自动扫描pages目录获取所有页面
function getStaticPages() {
  const pagesDirectory = path.join(process.cwd(), 'pages');
  const filenames = fs.readdirSync(pagesDirectory);
  
  const staticPages = [];
  
  filenames.forEach(name => {
    // 跳过API路由、_app.js、_document.js等特殊文件
    if (name.startsWith('_') || name.startsWith('api') || name.includes('[')) {
      return;
    }
    
    // 移除.js扩展名
    const route = name === 'index.js' ? '/' : `/${name.replace('.js', '')}`;
    
    // 检查是否已经在手动配置的页面中
    const existingPage = pages.find(page => page.url === route);
    if (!existingPage) {
      staticPages.push({
        url: route,
        changefreq: 'monthly',
        priority: '0.6',
        lastmod: new Date().toISOString().split('T')[0] + 'T00:00:00+00:00'
      });
    }
  });
  
  return staticPages;
}

function generateSitemap() {
  const staticPages = getStaticPages();
  const allPages = [...pages, ...staticPages];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

export default function handler(req, res) {
  try {
    const sitemap = generateSitemap();
    
    // 设置正确的Content-Type
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 缓存1小时
    
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
} 