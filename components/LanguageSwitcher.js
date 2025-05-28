import { Button, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { translations } from '../lib/translations';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState('zh');
  const t = translations[locale] || translations.zh;

  useEffect(() => {
    // 从 localStorage 获取语言设置，或者根据浏览器语言设置默认值
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && (savedLocale === 'zh' || savedLocale === 'en')) {
      setLocale(savedLocale);
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language.toLowerCase();
      const detectedLocale = browserLang.startsWith('zh') ? 'zh' : 'en';
      setLocale(detectedLocale);
      localStorage.setItem('locale', detectedLocale);
    }
  }, []);

  const switchLanguage = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // 触发自定义事件通知其他组件语言已更改
    window.dispatchEvent(new CustomEvent('localeChange', { detail: newLocale }));
  };

  return (
    <Box position="fixed" top="4" right="4" zIndex="1000">
      <Button
        onClick={switchLanguage}
        colorScheme="blue"
        variant="outline"
        size="sm"
        bg="white"
        _hover={{ bg: "blue.50" }}
        aria-label={locale === 'zh' ? '切换到英文' : 'Switch to Chinese'}
        title={locale === 'zh' ? '切换到英文' : 'Switch to Chinese'}
      >
        🌐
      </Button>
    </Box>
  );
} 