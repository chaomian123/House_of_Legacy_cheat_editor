const fs = require('fs');
const path = require('path');

const baseUrl = 'https://savefile.space';
const currentDate = new Date().toISOString().split('T')[0];

const pages = [
  {
    url: '/',
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '1.0'
  },
  {
    url: '/changelog',
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    url: '/privacy',
    lastmod: currentDate,
    changefreq: 'yearly',
    priority: '0.5'
  },
  {
    url: '/terms',
    lastmod: currentDate,
    changefreq: 'yearly',
    priority: '0.5'
  }
];

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('Sitemap generated successfully!');
}

if (require.main === module) {
  generateSitemap();
}

module.exports = generateSitemap; 