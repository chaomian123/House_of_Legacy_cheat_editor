import {
  Container,
  VStack,
  Heading,
  Text,
  Flex,
  Link,
  Box
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { ArrowBackIcon } from '@chakra-ui/icons';
import SEOHead from '../components/SEOHead';
import SuggestionForm from '../components/SuggestionForm';
import { useLocale } from '../lib/useLocale';

export default function SuggestionsPage() {
  const { locale, t } = useLocale();

  return (
    <>
      <SEOHead 
        title={locale === 'zh' ? "提建议 - House of Legacy 存档编辑器" : "Suggestions - House of Legacy Save Editor"}
        description={locale === 'zh' ? "向 House of Legacy 存档编辑器提出您的建议和想法" : "Share your suggestions and ideas for House of Legacy Save Editor"}
      />
      
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="center">
          {/* 返回首页链接 */}
          <Flex w="100%" justify="flex-start">
            <Link as={NextLink} href="/" color="blue.500" fontSize="sm">
              <ArrowBackIcon mr={2} />
              {locale === 'zh' ? '返回首页' : 'Back to Home'}
            </Link>
          </Flex>

          {/* 页面标题 */}
          <VStack spacing={4} textAlign="center">
            <Heading size="lg" color="gray.700">
              <span data-nosnippet>💭 {locale === 'zh' ? '建议反馈' : 'Suggestions'}</span>
            </Heading>
            <Text color="gray.600" maxW="500px">
              {locale === 'zh' ? (
                <>欢迎分享您在使用 House of Legacy 存档编辑器时的想法、<span data-nosnippet>建议</span>。</>
              ) : (
                <>Share your thoughts and suggestions about House of Legacy Save Editor.</>
              )}
            </Text>
          </VStack>

          {/* 建议表单 */}
          <SuggestionForm />

          {/* 说明文字 */}
          <Box textAlign="center" maxW="500px">
            <Text fontSize="sm" color="gray.500">
              📧 {locale === 'zh' ? 
                '您的建议将被匿名提交，我们承诺不会收集任何个人敏感信息' : 
                'Your suggestions will be submitted anonymously. We promise not to collect any sensitive personal information'}
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              🔒 {locale === 'zh' ? 
                '所有数据传输经过加密保护' :
                'All data transmissions are encrypted'}
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 