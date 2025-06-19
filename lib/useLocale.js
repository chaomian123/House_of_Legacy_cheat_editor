import { useState, useEffect } from 'react';
import { translations } from './translations';

export function useLocale() {
  const [locale, setLocale] = useState('zh');

  useEffect(() => {
    // 从 localStorage 获取语言设置
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && (savedLocale === 'zh' || savedLocale === 'en' || savedLocale === 'th')) {
      setLocale(savedLocale);
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language.toLowerCase();
      let detectedLocale = 'en'; // 默认英语

      if (browserLang.startsWith('zh')) {
        detectedLocale = 'zh';
      } else if (browserLang.startsWith('th')) {
        detectedLocale = 'th';
      }

      setLocale(detectedLocale);
      localStorage.setItem('locale', detectedLocale);
    }

    // 监听语言变更事件
    const handleLocaleChange = (event) => {
      setLocale(event.detail);
    };

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  const t = translations[locale] || translations.zh;

  return { locale, t };
} 