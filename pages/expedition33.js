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
import Head from 'next/head';

const MotionBox = motion(Box);

// 获取自定义SEO数据
export async function getStaticProps({ locale }) {
  return {
    props: {
      seoData: {
        en: {
          title: "Expedition 33 Save Editor | Edit Game Inventory and Items",
          description: "Free online save editor for Expedition 33. Edit inventory, unlock items, modify characters, weapons and more. No download required.",
          keywords: "Expedition 33 trainer, expedition trainer, Expedition 33, save editor, save file editor, game items, inventory editor, Gustave, Lune, Maelle, Monoco, Sciel, Verso, roguelite game, space horror, inventory management, character items, expedition33 cheats, expedition33 mods, online editor",
          structuredData: {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Expedition 33 Save Editor",
            "description": "save editor for Expedition 33 in browser",
            "applicationCategory": "GameModificationApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": "Edit inventory items, Unlock all outfits, Modify character weapons, Change gold amount",
            "keywords": "Expedition 33 trainer, expedition33 trainer, Expedition 33 save editor, game inventory"
          }
        },
        zh: {
          title: "Expedition 33 存档修改器 | 编辑游戏物品和装备",
          description: "免费在线Expedition 33存档编辑器。修改物品栏、解锁装备、编辑角色、武器等。无需下载即可使用。",
          keywords: "Expedition 33 trainer, expedition trainer, Expedition 33, 存档修改器, 游戏修改器, 存档编辑器, 游戏物品, 物品栏编辑, Gustave, Lune, Maelle, Monoco, Sciel, Verso, 肉鸽游戏, 太空恐怖, 物品管理, 角色装备, expedition33修改, expedition33 MOD, 在线修改器",
          structuredData: {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Expedition 33 存档修改器",
            "description": "免费在线Expedition 33游戏存档编辑器",
            "applicationCategory": "GameModificationApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": "编辑物品栏, 解锁所有服装, 修改角色武器, 更改金币数量, 更改灵光点",
            "keywords": "33号远征队存档修改器, 33号远征队, Expedition 33, 存档修改器, 游戏物品"
          }
        }
      }
    }
  };
}

const Expedition33 = ({ seoData }) => {
  const router = useRouter();
  const { t, locale } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [processingState, setProcessingState] = useState('idle');
  const [isFeatureListOpen, setIsFeatureListOpen] = useState(false);
  
  // 获取当前语言的SEO数据
  const currentSeoData = seoData[locale] || seoData.en;

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
      setStatusMessage("Module loaded successfully. You can now upload .sav files.");
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

  // 页面加载时自动加载WASM
  useEffect(() => {
    console.log('页面加载，自动初始化WASM...');
    handleStartEdit();
  }, []);

  return (
    <>
      <SEOHead
        title={currentSeoData.title}
        description={currentSeoData.description}
        keywords={currentSeoData.keywords}
        ogImage="/images/expedition33-editor-og.jpg"
      />
      <Head>
        {/* 额外的结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(currentSeoData.structuredData)
          }}
        />
        {/* 额外的元标签 */}
        <meta property="article:tag" content="Expedition 33" />
        <meta property="article:tag" content="Save Editor" />
        <meta property="article:tag" content="Game Tools" />
        <meta property="article:tag" content="Expedition 33 trainer" />
        <meta property="article:tag" content="expedition trainer" />
        <meta name="application-name" content="Expedition 33 Trainer & Save Editor" />
        <meta name="apple-mobile-web-app-title" content="Expedition 33 Trainer" />
      </Head>
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