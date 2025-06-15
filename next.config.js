/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    // 添加 WASM 支持
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    // 添加 WASM 文件类型支持
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    // 添加 WASM 加载器
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  }
  // 移除 output: 'export' 以支持 API 路由
  // Vercel 部署会自动优化静态页面
};

module.exports = nextConfig;
