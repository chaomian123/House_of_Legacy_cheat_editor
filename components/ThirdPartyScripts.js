import { useEffect } from 'react';
import Script from 'next/script';
import { LazyScript, IdleLazyLoader, InteractionLazyLoader } from './LazyLoader';

// Google Analytics 延迟加载组件
export const GoogleAnalytics = ({ trackingId }) => {
  if (!trackingId) return null;
  
  return (
    <IdleLazyLoader timeout={3000}>
      <LazyScript
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics-config" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingId}');
        `}
      </Script>
    </IdleLazyLoader>
  );
};

// 广告脚本延迟加载组件（示例）
export const AdScript = ({ adProvider, adConfig }) => {
  return (
    <InteractionLazyLoader triggerEvents={['scroll', 'mouseenter']}>
      <LazyScript
        src={adConfig?.scriptUrl}
        strategy="lazyOnload"
        onLoad={() => {
          console.log(`${adProvider} ad script loaded`);
        }}
      />
    </InteractionLazyLoader>
  );
};

// 社交媒体分享脚本延迟加载
export const SocialScripts = () => {
  return (
    <InteractionLazyLoader triggerEvents={['mouseenter', 'click']}>
      {/* 微信分享 */}
      <LazyScript
        src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('WeChat SDK loaded');
        }}
      />
      
      {/* 微博分享 */}
      <LazyScript
        src="https://tjs.sjs.sinajs.cn/t4/apps/OpenApi/js/tk.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Weibo SDK loaded');
        }}
      />
    </InteractionLazyLoader>
  );
};

// 客服聊天脚本延迟加载
export const CustomerServiceScript = ({ serviceConfig }) => {
  return (
    <InteractionLazyLoader triggerEvents={['scroll', 'mouseenter']}>
      <LazyScript
        src={serviceConfig?.scriptUrl}
        strategy="lazyOnload"
        onLoad={() => {
          // 初始化客服脚本
          if (window.CustomerService && serviceConfig?.apiKey) {
            window.CustomerService.init({
              apiKey: serviceConfig.apiKey,
              position: 'bottom-right'
            });
          }
        }}
      />
    </InteractionLazyLoader>
  );
};

// 统计分析脚本集合
export const AnalyticsScripts = ({ 
  googleAnalyticsId, 
  baiduAnalyticsId, 
  umengAnalyticsId 
}) => {
  return (
    <IdleLazyLoader timeout={2000}>
      {/* Google Analytics */}
      {googleAnalyticsId && (
        <GoogleAnalytics trackingId={googleAnalyticsId} />
      )}
      
      {/* 百度统计 */}
      {baiduAnalyticsId && (
        <Script id="baidu-analytics" strategy="lazyOnload">
          {`
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?${baiduAnalyticsId}";
              var s = document.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(hm, s);
            })();
          `}
        </Script>
      )}
      
      {/* 友盟统计 */}
      {umengAnalyticsId && (
        <Script id="umeng-analytics" strategy="lazyOnload">
          {`
            var cnzz_protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
            document.write(unescape("%3Cspan id='cnzz_stat_icon_${umengAnalyticsId}'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s4.cnzz.com/z_stat.php%3Fid%3D${umengAnalyticsId}' type='text/javascript'%3E%3C/script%3E"));
          `}
        </Script>
      )}
    </IdleLazyLoader>
  );
};

// 主要的第三方脚本管理组件
const ThirdPartyScripts = ({ 
  analytics = {},
  ads = {},
  social = false,
  customerService = null
}) => {
  return (
    <>
      {/* 分析统计脚本 */}
      <AnalyticsScripts {...analytics} />
      
      {/* 广告脚本 */}
      {ads.enabled && (
        <AdScript adProvider={ads.provider} adConfig={ads.config} />
      )}
      
      {/* 社交分享脚本 */}
      {social && <SocialScripts />}
      
      {/* 客服脚本 */}
      {customerService && (
        <CustomerServiceScript serviceConfig={customerService} />
      )}
    </>
  );
};

export default ThirdPartyScripts; 