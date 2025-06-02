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
import { useLocale } from '../lib/useLocale';

export default function SuggestionForm() {
  const { locale } = useLocale();
  const [username, setUsername] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!suggestion.trim()) {
      toast({
        title: locale === 'zh' ? "请填写建议内容" : "Please enter your suggestion",
        description: locale === 'zh' ? "建议内容不能为空" : "Suggestion content cannot be empty",
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
          title: locale === 'zh' ? "提交成功！" : "Submitted Successfully!",
          description: locale === 'zh' ? "感谢您的宝贵建议，我们会认真考虑！" : "Thank you for your valuable suggestion. We will consider it carefully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        // 清空表单
        setUsername('');
        setSuggestion('');
      } else {
        throw new Error(data.error || (locale === 'zh' ? '提交失败' : 'Submission failed'));
      }
    } catch (error) {
      console.error(locale === 'zh' ? '提交建议失败:' : 'Failed to submit suggestion:', error);
      toast({
        title: locale === 'zh' ? "提交失败" : "Submission Failed",
        description: error.message || (locale === 'zh' ? "网络错误，请稍后重试" : "Network error, please try again later"),
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
            💡 {locale === 'zh' ? '提点建议' : 'Share Your Thoughts'}
          </Heading>
          
          <Text fontSize="sm" color="gray.600" textAlign="center">
            {locale === 'zh' ? '您的意见对我们很重要，请随时分享您的想法！' : 'Your feedback is important to us. Feel free to share your thoughts!'}
          </Text>

          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">{locale === 'zh' ? '您的称呼 (可选)' : 'Your Name (Optional)'}</FormLabel>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={locale === 'zh' ? "留个昵称吧～" : "Enter your nickname..."}
                  size="sm"
                  maxLength={50}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">
                  {locale === 'zh' ? '您的宝贵建议' : 'Your Suggestion'} <Text as="span" color="red.500">*</Text>
                </FormLabel>
                <Textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder={locale === 'zh' 
                    ? "写下任何您想说的...&#10;比如：功能建议、使用体验、发现的问题等"
                    : "Write anything you want to say...&#10;For example: feature suggestions, user experience, issues found, etc."}
                  rows={5}
                  size="sm"
                  maxLength={1000}
                  resize="vertical"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {suggestion.length}/1000 {locale === 'zh' ? '字符' : 'characters'}
                </Text>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                w="100%"
                isLoading={isSubmitting}
                loadingText={locale === 'zh' ? "提交中..." : "Submitting..."}
                size="sm"
              >
                💌 {locale === 'zh' ? '提交建议' : 'Submit'}
              </Button>
            </VStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
} 