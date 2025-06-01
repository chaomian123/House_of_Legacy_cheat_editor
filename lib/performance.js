// 性能优化配置
export const performanceConfig = {
  // 延迟加载配置
  lazyLoading: {
    // 第三方脚本延迟时间（毫秒）
    scriptDelay: 2000,
    // 图片懒加载距离
    imageRootMargin: '50px',
    // 用户交互触发事件
    interactionEvents: ['mouseenter', 'click', 'scroll', 'touchstart']
  },
  
  // 资源预加载配置
  preloading: {
    // 关键资源
    critical: [
      '/favicon.ico'
    ],
    // DNS 预解析
    dnsPrefetch: [
      '//www.googletagmanager.com',
      '//www.google-analytics.com',
      '//fonts.googleapis.com',
      '//fonts.gstatic.com'
    ],
    // 预连接资源
    preconnect: [
      'https://fonts.gstatic.com'
    ]
  }
};

// 性能监控工具
export class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = {};
  }
  
  // 监控页面加载性能
  measurePageLoad() {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.metrics.pageLoad = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        load: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: this.getFirstContentfulPaint(),
        largestContentfulPaint: this.getLargestContentfulPaint()
      };
      
      console.log('Page Load Metrics:', this.metrics.pageLoad);
    });
  }
  
  // 获取首次内容绘制时间
  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : null;
  }
  
  // 监控最大内容绘制
  getLargestContentfulPaint() {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcpEntry = entries[entries.length - 1];
          resolve(lcpEntry.startTime);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // 10秒后停止监控
        setTimeout(() => {
          observer.disconnect();
        }, 10000);
      } else {
        resolve(null);
      }
    });
  }
  
  // 监控累积布局偏移
  measureCLS() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
    
    let clsScore = 0;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      }
      this.metrics.cls = clsScore;
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.cls = observer;
  }
  
  // 监控首次输入延迟
  measureFID() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.fid = entry.processingStart - entry.startTime;
        console.log('First Input Delay:', this.metrics.fid);
      }
    });
    
    observer.observe({ entryTypes: ['first-input'] });
    this.observers.fid = observer;
  }
  
  // 监控资源加载时间
  measureResourceTiming() {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      const resourceMetrics = resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize,
        type: this.getResourceType(resource.name)
      }));
      
      this.metrics.resources = resourceMetrics;
      console.log('Resource Timing:', resourceMetrics);
    });
  }
  
  // 获取资源类型
  getResourceType(url) {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.includes('font')) return 'font';
    return 'other';
  }
  
  // 启动所有监控
  startMonitoring() {
    this.measurePageLoad();
    this.measureCLS();
    this.measureFID();
    this.measureResourceTiming();
  }
  
  // 停止所有监控
  stopMonitoring() {
    Object.values(this.observers).forEach(observer => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    });
  }
  
  // 获取性能报告
  getReport() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };
  }
}

// 延迟执行工具
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 空闲时执行
export const runWhenIdle = (callback, timeout = 2000) => {
  if (typeof window === 'undefined') return;
  
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 100);
  }
};

// 检查用户网络状况
export const getNetworkInfo = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return { effectiveType: 'unknown', saveData: false };
  }
  
  const connection = navigator.connection;
  return {
    effectiveType: connection.effectiveType,
    saveData: connection.saveData,
    downlink: connection.downlink,
    rtt: connection.rtt
  };
};

// 根据网络状况调整加载策略
export const shouldDelayLoad = () => {
  const networkInfo = getNetworkInfo();
  
  // 在慢速网络或省流模式下延迟加载
  if (networkInfo.saveData || networkInfo.effectiveType === 'slow-2g' || networkInfo.effectiveType === '2g') {
    return true;
  }
  
  return false;
};

export default PerformanceMonitor; 