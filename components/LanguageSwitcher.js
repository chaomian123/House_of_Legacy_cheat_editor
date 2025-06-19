import { Button, Box, Alert, AlertIcon, AlertTitle, AlertDescription, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { translations } from '../lib/translations';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState('zh');
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [suggestedLocale, setSuggestedLocale] = useState('');
  const t = translations[locale] || translations.zh;

  useEffect(() => {
    // 从 localStorage 获取语言设置，或者根据浏览器语言设置默认值
    const savedLocale = localStorage.getItem('locale');
    const hasShownPrompt = localStorage.getItem('languagePromptShown');

    if (savedLocale && (savedLocale === 'zh' || savedLocale === 'en' || savedLocale === 'th')) {
      setLocale(savedLocale);
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language.toLowerCase();
      let detectedLocale = 'en'; // 默认英语
      let languageName = 'English';

      if (browserLang.startsWith('zh')) {
        detectedLocale = 'zh';
        languageName = '中文';
      } else if (browserLang.startsWith('th')) {
        detectedLocale = 'th';
        languageName = 'ไทย';
      }

      setLocale('en'); // 先设置为英语显示提示

      // 如果检测到的语言不是英语且没有显示过提示，则显示语言切换提示
      if (detectedLocale !== 'en' && !hasShownPrompt) {
        setDetectedLanguage(languageName);
        setSuggestedLocale(detectedLocale);
        setShowLanguagePrompt(true);
      } else {
        setLocale(detectedLocale);
        localStorage.setItem('locale', detectedLocale);
      }
    }
  }, []);

  const switchLanguage = () => {
    // 三语言循环切换：中文 -> 英文 -> 泰文 -> 中文
    let newLocale;
    if (locale === 'zh') {
      newLocale = 'en';
    } else if (locale === 'en') {
      newLocale = 'th';
    } else {
      newLocale = 'zh';
    }

    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);

    // 触发自定义事件通知其他组件语言已更改
    window.dispatchEvent(new CustomEvent('localeChange', { detail: newLocale }));
  };

  const handleLanguagePromptSwitch = () => {
    setLocale(suggestedLocale);
    localStorage.setItem('locale', suggestedLocale);
    localStorage.setItem('languagePromptShown', 'true');
    setShowLanguagePrompt(false);

    // 触发自定义事件通知其他组件语言已更改
    window.dispatchEvent(new CustomEvent('localeChange', { detail: suggestedLocale }));
  };

  const handleLanguagePromptKeep = () => {
    localStorage.setItem('languagePromptShown', 'true');
    setShowLanguagePrompt(false);
  };

  // 获取按钮显示文本和提示
  const getButtonText = () => {
    if (locale === 'zh') return 'A';
    if (locale === 'en') return 'ไทย';
    return '中';
  };

  const getButtonTitle = () => {
    if (locale === 'zh') return 'Switch to English';
    if (locale === 'en') return 'เปลี่ยนเป็นภาษาไทย';
    return '切换到中文';
  };

  return (
    <>
      {/* 语言检测提示 */}
      {showLanguagePrompt && (
        <Box
          position="fixed"
          top="4"
          left="50%"
          transform="translateX(-50%)"
          zIndex="1001"
          maxWidth="400px"
          width="90%"
        >
          <Alert status="info" borderRadius="md" boxShadow="lg">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">
                {t.languageDetection.detected} {detectedLanguage}
              </AlertTitle>
              <AlertDescription fontSize="sm" mt={1}>
                {t.languageDetection.switchPrompt}
              </AlertDescription>
              <Box mt={3} display="flex" gap={2}>
                <Button
                  size="xs"
                  colorScheme="blue"
                  onClick={handleLanguagePromptSwitch}
                >
                  {t.languageDetection.switch}
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={handleLanguagePromptKeep}
                >
                  {t.languageDetection.keep}
                </Button>
              </Box>
            </Box>
          </Alert>
        </Box>
      )}

      {/* 语言切换按钮 */}
      <Box position="fixed" top="4" right="4" zIndex="1000">
        <Button
          onClick={switchLanguage}
          colorScheme="blue"
          variant="outline"
          size="sm"
          bg="white"
          _hover={{ bg: "blue.50" }}
          aria-label={getButtonTitle()}
          title={getButtonTitle()}
        >
          {getButtonText()}
        </Button>
      </Box>
    </>
  );
}