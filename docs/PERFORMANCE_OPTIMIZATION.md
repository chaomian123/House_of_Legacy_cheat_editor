# 性能优化 - 首屏渲染与延迟加载实现

本项目实现了全面的性能优化策略，包括首屏渲染优化和延迟加载优化，特别针对第三方脚本和非关键资源。

## 🚀 主要特性

### 0. 首屏渲染优化
- **移除动态插入内容**: 存档路径等关键信息直接在 HTML 中渲染，避免 JavaScript 动态插入造成的渲染延迟
- **减少首屏 JavaScript**: 移除不必要的 useEffect 和 DOM 操作
- **优化关键渲染路径**: 确保首屏内容立即可见
- **静态内容优先**: 将用户最需要的信息（如存档路径）静态化显示

### 1. 第三方脚本延迟加载
- **Google Analytics**: 改为 `lazyOnload` 策略，在页面空闲时加载
- **Vercel Analytics**: 保持默认的轻量优化
- **广告脚本**: 支持基于用户交互的延迟加载
- **社交分享脚本**: 仅在用户交互时加载

### 2. CSS 延迟加载
- **关键 CSS**: 保持同步加载（editor.css）
- **非关键 CSS**: 延迟加载，不阻塞首屏渲染
- **字体文件**: 根据网络条件智能延迟

### 3. 智能加载策略
- **网络感知**: 根据用户网络状况调整延迟时间
- **空闲时加载**: 利用浏览器空闲时间加载非关键资源
- **用户交互触发**: 基于鼠标悬停、点击、滚动等事件

## 📊 性能监控

### 核心指标
- **FCP (First Contentful Paint)**: 首次内容绘制 - 通过移除动态插入获得显著提升
- **LCP (Largest Contentful Paint)**: 最大内容绘制
- **FID (First Input Delay)**: 首次输入延迟
- **CLS (Cumulative Layout Shift)**: 累积布局偏移 - 静态内容渲染避免布局偏移

### 监控数据
```javascript
// 在浏览器控制台查看性能数据
// Page Load Metrics 和 Resource Timing 会自动输出
```

## 🛠️ 使用方法

### 0. 首屏渲染优化实践
```javascript
// ❌ 避免 - 动态插入关键内容
useEffect(() => {
  if (pathRef.current) {
    pathRef.current.textContent = 'C:\\Users\\...\\GameData.es3';
  }
}, []);

// ✅ 推荐 - 直接渲染关键内容
<Text fontFamily="monospace" color="gray.600">
  C:\Users\用户名\AppData\LocalLow\S3Studio\House of Legacy\FW\0\GameData.es3
</Text>
```

### 1. 配置第三方脚本
```javascript
// 在 _app.js 中配置
<ThirdPartyScripts 
  analytics={{
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    baiduAnalyticsId: 'your-baidu-id', // 可选
    umengAnalyticsId: 'your-umeng-id'  // 可选
  }}
  ads={{
    enabled: true,
    provider: 'google-ads',
    config: { scriptUrl: 'https://...' }
  }}
  social={true}
  customerService={{
    scriptUrl: 'https://...',
    apiKey: 'your-api-key'
  }}
/>
```

### 2. 使用延迟加载组件
```javascript
import { LazyScript, LazyCSS, InteractionLazyLoader } from '../components/LazyLoader';

// 延迟加载脚本
<LazyScript 
  src="https://example.com/script.js"
  strategy="lazyOnload"
  onLoad={() => console.log('Script loaded')}
/>

// 延迟加载 CSS
<LazyCSS 
  href="https://example.com/styles.css"
  onLoad={() => console.log('CSS loaded')}
/>

// 基于交互的延迟加载
<InteractionLazyLoader triggerEvents={['mouseenter', 'click']}>
  <ExpensiveComponent />
</InteractionLazyLoader>
```

### 3. 自定义延迟加载
```javascript
import { runWhenIdle, shouldDelayLoad } from '../lib/performance';

// 在空闲时执行
runWhenIdle(() => {
  // 加载非关键功能
  loadNonCriticalFeatures();
}, 2000);

// 根据网络条件决定是否延迟
if (shouldDelayLoad()) {
  // 慢速网络，延迟更久
  setTimeout(loadHeavyResources, 5000);
} else {
  // 快速网络，正常加载
  setTimeout(loadHeavyResources, 1000);
}
```

## 📈 性能优化效果

### 预期提升
- **首屏加载时间**: 减少 30-50%
- **FCP**: 提升 200-500ms
- **LCP**: 提升 500-1000ms
- **阻塞资源**: 减少 70%

### 网络条件适配
- **快速网络 (4G+)**: 1秒后开始加载第三方资源
- **慢速网络 (2G/3G)**: 5秒后开始加载，优先关键功能
- **省流模式**: 自动检测并延长延迟时间

## 🔧 配置选项

### 延迟时间配置
```javascript
// lib/performance.js
export const performanceConfig = {
  lazyLoading: {
    scriptDelay: 2000,           // 脚本延迟时间
    imageRootMargin: '50px',     // 图片懒加载距离
    interactionEvents: [...]     // 交互触发事件
  }
};
```

### DNS 预解析优化
```html
<!-- _document.js 中已配置 -->
<link rel="dns-prefetch" href="//www.googletagmanager.com" />
<link rel="dns-prefetch" href="//www.google-analytics.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" />
```

## 🐛 故障排除

### 常见问题
1. **第三方脚本未加载**: 检查网络条件和延迟时间设置
2. **性能监控无数据**: 确保在支持 Performance API 的浏览器中运行
3. **样式闪烁**: 检查关键 CSS 是否正确同步加载

### 调试工具
```javascript
// 开发环境下查看加载状态
if (process.env.NODE_ENV === 'development') {
  console.log('Lazy loading enabled');
  // 监控性能数据会自动输出到控制台
}
```

## 📝 最佳实践

1. **关键资源优先**: 保持关键 CSS 和 JS 同步加载
2. **渐进增强**: 确保基础功能在第三方资源加载前可用
3. **网络感知**: 根据用户网络条件调整加载策略
4. **用户体验**: 避免因延迟加载导致的功能缺失感知
5. **监控指标**: 持续监控性能指标，优化延迟参数

## 🔄 持续优化

### 监控和调整
- 定期检查性能指标
- 根据用户反馈调整延迟时间
- A/B 测试不同的加载策略
- 监控第三方服务的可用性

### 未来计划
- [ ] 支持 Service Worker 缓存优化
- [ ] 实现资源优先级智能调度
- [ ] 添加更多网络条件检测
- [ ] 集成更多性能监控指标 