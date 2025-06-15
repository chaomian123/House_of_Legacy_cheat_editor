import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Progress,
  useColorModeValue,
  Flex,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useLocale } from '../lib/useLocale';
import { FaQuestionCircle } from 'react-icons/fa';
import SEOHead from '../components/SEOHead';
import Navigation from '../components/Navigation';
import ThirdPartyScripts from '../components/ThirdPartyScripts';
import { initializeWasm } from '../services/wasmService';
import SaveEditor from '../components/e33/SaveEditor';
import Script from 'next/script';

const MotionBox = motion(Box);

const Expedition33 = () => {
  const router = useRouter();
  const { t, locale } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [processingState, setProcessingState] = useState('idle');
  const [isFeatureListOpen, setIsFeatureListOpen] = useState(false);

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  );

  const handleStartEdit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);

      // 模拟加载进度
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // 初始化 WASM
      await initializeWasm();
      
      // 完成加载
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setProcessingState('ready');
      setStatusMessage(locale === 'zh' ? "模块加载完成，可以上传 .sav 文件" : "Editor Module Ready. Upload a .sav file.");
      setIsLoading(false);

    //   console.log('WASM 加载状态:', {
    //     isLoading,
    //     loadingProgress,
    //     processingState,
    //     statusMessage
    //   });

    } catch (err) {
      console.error('编辑器 加载失败:', err);
      setError(err.message || '加载失败，请刷新页面重试');
      setIsLoading(false);
    }
  };

  // 添加状态变化的日志
  useEffect(() => {
    console.log('状态更新:', {
      isLoading,
      loadingProgress,
      processingState,
      statusMessage
    });
  }, [isLoading, loadingProgress, processingState, statusMessage]);

  return (
    <>
      <SEOHead
        title={t.expedition33.title[locale]}
        description={t.expedition33.description[locale]}
        keywords="Expedition 33, save editor, game save, mod tool"
      />
      <Navigation />
      <ThirdPartyScripts />

      <Box
        minH="100vh"
        bgGradient={bgGradient}
        py={20}
        backgroundImage="url('https://makemaze.online/images/1750015821382_3wzas8ub.webp')"
        backgroundSize="cover"
        backgroundAttachment="fixed"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        position="relative"
      >
        <Box 
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.7)"
          zIndex="1"
        />
        <Container maxW="container.xl" position="relative" zIndex="2" textAlign="center">
          <VStack spacing={8} align="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              width="100%"
              textAlign="center"
            >
              <Heading
                as="h1"
                size="2xl"
                bgGradient="linear(to-r, #fcd88a, #fcd88a)"
                bgClip="text"
                textAlign="center"
                mb={4}
                width="100%"
              >
                {t.expedition33.title[locale]}
              </Heading>
              <Text
                fontSize="xl"
                color="#b4b2b0"
                textAlign="center"
                maxW="2xl"
                mx="auto"
                className="expedition-text"
                width="100%"
              >
                {t.expedition33.description[locale]}
              </Text>
            </MotionBox>

            {/* <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                size="lg"
                colorScheme="yellow"
                onClick={handleStartEdit}
                isLoading={isLoading}
                loadingText={t.expedition33.loading[locale]}
                disabled={isLoading}
              >
                {t.expedition33.startEdit[locale]}
              </Button>
            </MotionBox> */}

            {isLoading && (
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                w="full"
                maxW="md"
                textAlign="center"
              >
                <Progress
                  value={loadingProgress}
                  size="sm"
                  colorScheme="yellow"
                  hasStripe
                  isAnimated
                  borderRadius="full"
                />
                <Text
                  mt={2}
                  textAlign="center"
                  color="#b4b2b0"
                  width="100%"
                >
                  {t.expedition33.loadingWasm[locale]}
                </Text>
              </MotionBox>
            )}

            {!isLoading && loadingProgress === 100 && (
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                w="full"
                maxW="md"
                textAlign="center"
              >
                <Progress
                  value={100}
                  size="sm"
                  colorScheme="yellow"
                  borderRadius="full"
                />
                <Text
                  mt={2}
                  textAlign="center"
                  color="#fcd88a"
                  width="100%"
                >
                  {statusMessage || t.expedition33.loadingWasm[locale]}
                </Text>
              </MotionBox>
            )}

            {error && (
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                p={4}
                bg="rgba(0, 0, 0, 0.7)"
                color="#fcd88a"
                borderRadius="md"
                w="full"
                maxW="md"
                textAlign="center"
                borderWidth="1px"
                borderColor="red.500"
              >
                {error}
              </MotionBox>
            )}

            <Box width="100%" textAlign="center">
              <SaveEditor />
            </Box>
          </VStack>
        </Container>
      </Box>

     
    </>
  );
};

export default Expedition33; 