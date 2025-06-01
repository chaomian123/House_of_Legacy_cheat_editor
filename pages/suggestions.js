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

export default function SuggestionsPage() {
  return (
    <>
      <SEOHead 
        title="提建议 - House of Legacy 存档编辑器"
        description="向 House of Legacy 存档编辑器提出您的建议和想法"
      />
      
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="center">
          {/* 返回首页链接 */}
          <Flex w="100%" justify="flex-start">
            <Link as={NextLink} href="/" color="blue.500" fontSize="sm">
              <ArrowBackIcon mr={2} />
              返回首页
            </Link>
          </Flex>

          {/* 页面标题 */}
          <VStack spacing={4} textAlign="center">
            <Heading size="lg" color="gray.700">
              <span data-nosnippet>💭 建议反馈</span>
            </Heading>
            <Text color="gray.600" maxW="500px">
              欢迎分享您在使用 House of Legacy 存档编辑器时的想法、<span data-nosnippet>建议</span>。
            </Text>
          </VStack>

          {/* 建议表单 */}
          <SuggestionForm />

          {/* 说明文字 */}
          <Box textAlign="center" maxW="500px">
            <Text fontSize="sm" color="gray.500">
              📧 您的建议将被匿名提交，我们承诺不会收集任何个人敏感信息
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              🔒 所有数据传输经过加密保护
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 