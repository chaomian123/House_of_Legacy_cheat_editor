import { useEffect, useState } from 'react';
import Script from 'next/script';

// 延迟加载第三方脚本组件
export const LazyScript = ({ src, onLoad, children, strategy = 'lazyOnload', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  return (
    <Script
      src={src}
      strategy={strategy}
      onLoad={handleLoad}
      {...props}
    >
      {children}
    </Script>
  );
};

// 延迟加载 CSS 样式表
export const LazyCSS = ({ href, media = 'all', onLoad }) => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print'; // 先设为 print 避免阻塞渲染
    link.onload = () => {
      link.media = media; // 加载完成后改为实际媒体类型
      if (onLoad) onLoad();
    };
    
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [href, media, onLoad]);
  
  return null;
};

// 基于用户交互的延迟加载
export const InteractionLazyLoader = ({ children, triggerEvents = ['mouseenter', 'click', 'scroll'] }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  
  useEffect(() => {
    const handleInteraction = () => {
      setShouldLoad(true);
      // 移除事件监听器
      triggerEvents.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
    
    if (!shouldLoad) {
      triggerEvents.forEach(event => {
        document.addEventListener(event, handleInteraction, { passive: true });
      });
    }
    
    return () => {
      triggerEvents.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [shouldLoad, triggerEvents]);
  
  return shouldLoad ? children : null;
};

// 基于视口的延迟加载（Intersection Observer）
export const ViewportLazyLoader = ({ children, rootMargin = '50px' }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ref, setRef] = useState(null);
  
  useEffect(() => {
    if (!ref || shouldLoad) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    
    observer.observe(ref);
    
    return () => observer.disconnect();
  }, [ref, shouldLoad, rootMargin]);
  
  return (
    <div ref={setRef}>
      {shouldLoad ? children : <div style={{ minHeight: '1px' }} />}
    </div>
  );
};

// 空闲时间延迟加载
export const IdleLazyLoader = ({ children, timeout = 2000 }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadWhenIdle = () => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => setShouldLoad(true), { timeout });
        } else {
          // 降级方案：使用 setTimeout
          setTimeout(() => setShouldLoad(true), 100);
        }
      };
      
      loadWhenIdle();
    }
  }, [timeout]);
  
  return shouldLoad ? children : null;
};

export default {
  LazyScript,
  LazyCSS,
  InteractionLazyLoader,
  ViewportLazyLoader,
  IdleLazyLoader
}; 