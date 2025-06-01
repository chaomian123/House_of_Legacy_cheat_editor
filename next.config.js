/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  }
  // 移除 output: 'export' 以支持 API 路由
  // Vercel 部署会自动优化静态页面
};

module.exports = nextConfig;
