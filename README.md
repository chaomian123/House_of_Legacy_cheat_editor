# House of Legacy Save Editor

吾今有世家在线存档编辑器 - 专业的游戏存档修改工具

## 项目结构

### 核心页面 (`pages/`)
- `index.js` - 首页，文件上传和编辑入口
- `changelog.js` - 更新日志页面
- `privacy.js` - 隐私政策页面
- `terms.js` - 服务条款页面
- `_document.js` - HTML文档结构，全局配置

### 组件 (`components/`)
- `SEOHead.js` - SEO元数据和头部配置
- `LanguageSwitcher.js` - 语言切换组件
- `Navigation.js` - 底部导航栏
- `cryptForm.js` - 文件加密解密表单
- `editor.js` - 存档编辑器主组件

### 工具库 (`lib/`)
- `translations.js` - 多语言翻译配置
- `useLocale.js` - 语言检测和切换Hook

### 配置 (`config/`)
- `analytics.js` - Google Analytics配置和跟踪函数

### 静态资源 (`public/`)
- `sitemap.xml` - 搜索引擎站点地图
- `robots.txt` - 爬虫访问规则
- `favicon.ico` - 网站图标
- `site.webmanifest` - PWA应用清单

### 脚本 (`scripts/`)
- 构建和部署相关脚本

## 技术栈

- **框架**: Next.js
- **UI库**: Chakra UI + Ant Design
- **语言**: JavaScript/React
- **部署**: Vercel

## 功能特性

- 在线存档编辑
- 多语言支持 (中文/英文)
- 角色属性修改
- 响应式设计
- SEO优化

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Disclaimer

I'm not responsible for any corrupted save files. Back them up before using this.
