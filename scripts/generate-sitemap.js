const fs = require('fs');
const path = require('path');

// 定义网站的基础URL
const SITE_URL = 'https://savefile.space';

// 定义页面配置
const pages = [
  {
    url: '/',
    changefreq: 'daily',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0] + 'T00:00:00+00:00'
  },
  {
    url: '/changelog',
    changefreq: 'daily', // 更新日志页面更新频繁
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
    url: '/experimental',
    changefreq: 'monthly',
    priority: '0.6',
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
  
  if (!fs.existsSync(pagesDirectory)) {
    console.warn('Pages directory not found');
    return [];
  }
  
  const filenames = fs.readdirSync(pagesDirectory);
  const staticPages = [];
  
  filenames.forEach(name => {
    // 跳过API路由、_app.js、_document.js等特殊文件
    // 跳过CSS文件、图片文件等非页面文件
    if (name.startsWith('_') || 
        name.startsWith('api') || 
        name.includes('[') ||
        name.endsWith('.css') ||
        name.endsWith('.scss') ||
        name.endsWith('.sass') ||
        name.endsWith('.less') ||
        name.endsWith('.png') ||
        name.endsWith('.jpg') ||
        name.endsWith('.jpeg') ||
        name.endsWith('.gif') ||
        name.endsWith('.svg') ||
        name.endsWith('.ico') ||
        name.endsWith('.webp') ||
        name.endsWith('.pdf') ||
        name.endsWith('.txt') ||
        name.endsWith('.md') ||
        name.endsWith('.json')) {
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

function writeSitemap() {
  try {
    const sitemap = generateSitemap();
    const publicDir = path.join(process.cwd(), 'public');
    
    // 确保public目录存在
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    
    console.log('✅ Sitemap generated successfully at:', sitemapPath);
    console.log('📄 Generated sitemap with', sitemap.split('<url>').length - 1, 'pages');
    
    // 显示生成的页面列表
    const staticPages = getStaticPages();
    const allPages = [...pages, ...staticPages];
    console.log('📋 Pages included:');
    allPages.forEach(page => {
      console.log(`   - ${page.url} (priority: ${page.priority}, changefreq: ${page.changefreq})`);
    });
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  writeSitemap();
}

module.exports = { generateSitemap, writeSitemap }; 