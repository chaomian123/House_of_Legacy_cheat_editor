import { ChakraProvider, Alert, AlertIcon, AlertTitle, AlertDescription, Link, Box } from '@chakra-ui/react';
import Head from 'next/head';
import { useEffect } from 'react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Navigation from '../components/Navigation';
import ThirdPartyScripts from '../components/ThirdPartyScripts';
import PerformanceMonitor, { runWhenIdle, shouldDelayLoad } from '../lib/performance';
// 主要 CSS 文件保持同步加载（关键样式）
import './editor.css';

export default function App({ Component, pageProps }) {
  // 性能监控和延迟加载优化
  useEffect(() => {
    // 启动性能监控
    const performanceMonitor = new PerformanceMonitor();
    performanceMonitor.startMonitoring();
    
    // 延迟加载非关键资源
    const loadNonCriticalResources = () => {
      // 检查是否应该延迟加载（基于网络条件）
      const shouldDelay = shouldDelayLoad();
      
      const loadCSS = (href, delay = 0) => {
        setTimeout(() => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.media = 'print';
          link.onload = () => {
            link.media = 'all';
          };
          link.onerror = () => {
            console.warn(`Failed to load CSS: ${href}`);
          };
          document.head.appendChild(link);
        }, delay);
      };
      
      // 根据网络条件调整延迟时间
      const baseDelay = shouldDelay ? 5000 : 1000;
      
      // 示例：延迟加载字体
      // loadCSS('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap', baseDelay);
      
      // 示例：延迟加载图标字体
      // loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', baseDelay + 500);
    };
    
    // 在空闲时或页面加载完成后加载非关键资源
    runWhenIdle(loadNonCriticalResources, 3000);
    
    // 清理函数
    return () => {
      performanceMonitor.stopMonitoring();
    };
  }, []);

  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        {/* 预加载关键资源 */}
        <link rel="preload" href="/favicon.ico" as="image" />
        
        {/* 性能优化提示 */}
        {process.env.NODE_ENV === 'development' && (
          <meta name="performance-hint" content="延迟加载已启用" />
        )}
      </Head>

      <ChakraProvider>
        <LanguageSwitcher />
        <Component {...pageProps} />
        <Navigation />
        
        {/* 延迟加载第三方脚本 */}
        <ThirdPartyScripts 
          analytics={{
            googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
          }}
          ads={{
            enabled: false // 暂时关闭广告，避免影响性能
          }}
          social={false} // 社交脚本可以按需启用
          customerService={null}
        />
      </ChakraProvider>
    </>
  );
}
