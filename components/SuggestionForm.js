import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Text,
  useToast,
  Card,
  CardBody,
  Heading
} from '@chakra-ui/react';
import { useState } from 'react';

export default function SuggestionForm() {
  const [username, setUsername] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!suggestion.trim()) {
      toast({
        title: "请填写建议内容",
        description: "建议内容不能为空",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/supabase-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submitSuggestion',
          payload: {
            username: username.trim() || null,
            suggestion: suggestion.trim()
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "提交成功！",
          description: "感谢您的宝贵建议，我们会认真考虑！",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        // 清空表单
        setUsername('');
        setSuggestion('');
      } else {
        throw new Error(data.error || '提交失败');
      }
    } catch (error) {
      console.error('提交建议失败:', error);
      toast({
        title: "提交失败",
        description: error.message || "网络错误，请稍后重试",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card maxW="500px" w="100%">
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Heading size="md" textAlign="center" color="blue.600">
            💡 提点建议
          </Heading>
          
          <Text fontSize="sm" color="gray.600" textAlign="center">
            您的意见对我们很重要，请随时分享您的想法！
          </Text>

          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">您的称呼 (可选)</FormLabel>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="留个昵称吧～"
                  size="sm"
                  maxLength={50}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">
                  您的宝贵建议 <Text as="span" color="red.500">*</Text>
                </FormLabel>
                <Textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="写下任何您想说的...&#10;比如：功能建议、使用体验、发现的问题等"
                  rows={5}
                  size="sm"
                  maxLength={1000}
                  resize="vertical"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {suggestion.length}/1000 字符
                </Text>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                w="100%"
                isLoading={isSubmitting}
                loadingText="提交中..."
                size="sm"
              >
                💌 提交建议
              </Button>
            </VStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
} 