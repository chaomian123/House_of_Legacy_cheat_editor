import {
  Box,
  Code,
  Divider,
  Flex,
  Heading,
  Input,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Image,
  VStack,
  HStack,
  Container,
  useToast,
  Spinner,
  Badge,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useEffect, useState, useRef } from 'react';
import { useLocale } from '../lib/useLocale';
import SEOHead from '../components/SEOHead';
import JianbingSupport from '../components/JianbingSupport';
import LikeButton from '../components/LikeButton';
import { inject } from "@vercel/analytics"

import CryptForm from '../components/cryptForm';
// import passwords from '../passwords';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { locale, t } = useLocale();
  const toast = useToast();
  
  // 调查相关状态
  const [surveyStats, setSurveyStats] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // 获取调查统计
  const fetchSurveyStats = async () => {
    try {
      const response = await fetch('/api/survey');
      const data = await response.json();
      setSurveyStats(data.stats);
    } catch (error) {
      console.error('Error fetching survey stats:', error);
    }
  };

  // 处理投票
  const handleVote = async (vote) => {
    if (hasVoted) {
      toast({
        title: "Already voted",
        description: "You have already participated in this survey.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsVoting(true);
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'vote',
          vote: vote
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setHasVoted(true);
        setSurveyStats(data.stats);
        setShowStats(true);
        toast({
          title: "Vote recorded!",
          description: "Thank you for your feedback!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        if (data.error === 'You have already voted') {
          setHasVoted(true);
          setShowStats(true);
          await fetchSurveyStats();
        }
        toast({
          title: "Error",
          description: data.error || "Failed to record vote",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsVoting(false);
    }
  };

  // 组件加载时获取统计数据
  useEffect(() => {
    fetchSurveyStats();
  }, []);

  inject()
  return (
    <>
      <SEOHead 
        title={locale === 'zh' ? '吾今有世家在线存档修改器 | House of Legacy Save Editor' : 'House of Legacy Save Editor | Free Online Save File Editor'}
        description={locale === 'zh' 
          ? '最佳的吾今有世家存档修改器 ，免费在线编辑游戏存档文件。直观查看和修改游戏中角色的各项属性和你的资源' 
          : 'The best House of Legacy save editor, free online editing of game save files. Intuitively view and modify various attributes of characters in the game and your resources.'
        }
        keywords={locale === 'zh' 
          ? '吾今有世家存档修改器, 存档编辑器, 游戏修改器, 存档修改工具'
          : 'House of Legacy, Save Editor, House of Legacy Save Editor, game editor, save file editor, House of Legacy modifier, game save editor, House of Legacy cheat tool'
        }
      />

      <a id='downloader' style={{ display: 'none' }}></a>
      
      {/* 主要内容区域 */}
      <Flex alignItems='center' justifyContent='center' mt='24' mb='10'>
        <Box
          direction='column'
          background='Blue.100'
          rounded='6'
          p='12'
          position='relative'
          maxW='800px'
          w='100%'
        >
          {/* SEO优化的标题结构 */}
          <Box mb='6'>
            <Heading as="h1" size="xl" mb='2' textAlign="center">
              {locale === 'zh' ? (
                <>
                  吾今有世家在线存档修改器
                  <Text as="span" fontSize="lg" color="blue.600" display="block" mt='1'>
                    House of Legacy Save Editor
                  </Text>
                </>
              ) : (
                <>
                  House of Legacy Save Editor
                  <Text as="span" fontSize="lg" color="blue.600" display="block" mt='1'>
                    Professional Save File Editor
                  </Text>
                </>
              )}
            </Heading>
            
            <Text textAlign="center" color="gray.600" fontSize="md" mb='3'>
              {locale === 'zh' 
                ? '吾今有世家存档编辑器，无需下载，浏览器直接使用，完全免费且安全' 
                : 'Professional House of Legacy Save Editor tool - No download required, browser-based, completely free and secure'
              }
            </Text>

            <Box textAlign="center" fontSize="sm">
              <Link href='/changelog' style={{textDecoration: 'underline', color: 'inherit'}}>
                {t.updateLog}
                {locale === 'zh' ? '(2025-06-01)' : '(2025-06-01)'}
              </Link>
            </Box>
          </Box>
          
          <Divider mb='4' />

          {/* House of Legacy Save Editor 功能介绍 */}
          <Box mb='4'>
            <Heading as="h2" size='md' mb='3' color="blue.700">
              {locale === 'zh' ? '吾今有世家 存档编辑功能' : 'House of Legacy Save Editor Features'}
            </Heading>
            
            <Text fontSize="sm" color="gray.700" mb='3'>
              {locale === 'zh' 
                ? '吾今有世家存档编辑器支持功能：'
                : 'House of Legacy Save Editor provides comprehensive save editing features, allowing you to easily modify various game attributes:'
              }
            </Text>

            <List spacing={1} fontSize="sm" mb='4'>
              <ListItem>
                • {locale === 'zh' ? '家族成员属性编辑' : 'House of Legacy family member attributes editing'}
              </ListItem>
              <ListItem>
                • {locale === 'zh' ? '门客系统修改' : 'House of Legacy guest system modification'}
              </ListItem>
              <ListItem>
                • {locale === 'zh' ? '妻妾婿属性调整' : 'House of Legacy spouse attributes adjustment'}
              </ListItem>
              <ListItem>
                • {locale === 'zh' ? '货币和资源编辑' : 'House of Legacy currency and resources editing'}
              </ListItem>
              <ListItem>
                • {locale === 'zh' ? '技能数值修改' : 'House of Legacy skill values modification'}
              </ListItem>
              <ListItem>
                • {locale === 'zh' ? '怀孕状态编辑' : 'House of Legacy pregnancy status editing'}
              </ListItem>
            </List>
          </Box>

          {/* 存档路径示例 */}
          <Box mb='4'>
            <Heading as="h3" size='sm' mb='2' color="blue.600">
              {locale === 'zh' ? '吾今有世家 存档文件路径' : 'House of Legacy Save File Path'}
            </Heading>
            <Text fontSize="sm" mb='2'>
              {locale === 'zh' 
                ? '在您的电脑上找到吾今有世家存档文件：'
                : 'Locate your House of Legacy save file on your computer:'
              }
            </Text>
            <Box 
              as="pre"
              p={2} 
              bg="gray.100" 
              fontSize="sm"
              borderRadius="md"
              overflow="auto"
              style={{ userSelect: 'all' }}
            >
              <Text  
                fontFamily="monospace"
                margin={0}
                padding={0}
                color="gray.600"
              >
                C:\Users\用户名\AppData\LocalLow\S3Studio\House of Legacy\FW\0\GameData.es3
              </Text>
            </Box>
          </Box>
          
          {/* 安全说明 */}
          <Box mb='4'>
            <Heading as="h3" size="sm" mb='2' color="blue.600">
              {locale === 'zh' ? '安全的吾今有世家存档编辑' : 'Safe House of Legacy Save Editing'}
            </Heading>
            <Text fontSize="sm" color="gray.600">
              {locale === 'zh' 
                ? '吾今有世家存档编辑器采用本地处理技术，存档文件不会上传到服务器，确保数据安全和隐私。' 
                : 'House of Legacy Save Editor uses local processing technology. Your save files are not uploaded to servers, ensuring your House of Legacy game data is completely safe and private.'
              }
            </Text>
          </Box>
          
          <CryptForm isLoading={isLoading} setIsLoading={setIsLoading} password={password} />
          
          {/* 点赞按钮 */}
          <Box mt='3' display='flex' justifyContent='center'>
            <LikeButton />
          </Box>
          
          <Divider mt='5' mb='3' />
          
          {/* 泰语支持调查 */}
          {/* <Box textAlign='center' mb='4'>
            <Text fontSize="sm" color="gray.600" mb='2'>
              Survey: Would you like us to add Thai language support?
            </Text>
            
            {!hasVoted && !showStats ? (
              <HStack spacing={2} justifyContent='center'>
                <Button 
                  size="sm" 
                  colorScheme="green" 
                  variant="outline"
                  onClick={() => handleVote('yes')}
                  isLoading={isVoting}
                  disabled={isVoting}
                >
                  Yes, I need Thai support
                </Button>
                <Button 
                  size="sm" 
                  colorScheme="gray" 
                  variant="outline"
                  onClick={() => handleVote('no')}
                  isLoading={isVoting}
                  disabled={isVoting}
                >
                  No, current languages are enough
                </Button>
              </HStack>
            ) : (
              <VStack spacing={2}>
                {hasVoted && (
                  <Text fontSize="xs" color="green.600" fontWeight="medium">
                    ✓ Thank you for voting!
                  </Text>
                )}
                
                {surveyStats && (
                  <HStack spacing={4} fontSize="sm">
                    <HStack>
                      <Badge colorScheme="green" variant="outline">
                        Yes: {surveyStats.yes} ({surveyStats.yesPercentage}%)
                      </Badge>
                    </HStack>
                    <HStack>
                      <Badge colorScheme="gray" variant="outline">
                        No: {surveyStats.no} ({surveyStats.noPercentage}%)
                      </Badge>
                    </HStack>
                    <Text color="gray.500" fontSize="xs">
                      Total: {surveyStats.total} votes
                    </Text>
                  </HStack>
                )}
                
                {!hasVoted && (
                  <Button 
                    size="xs" 
                    variant="ghost" 
                    onClick={() => setShowStats(false)}
                  >
                    Vote now
                  </Button>
                )}
              </VStack>
            )}
          </Box> */}
          
          <Divider mb='3' />

          {/* House of Legacy Save Editor 说明 */}
          {/* <Box textAlign='center' mb='4'>
            <Text fontSize="xs" color="gray.500" mb='2'>
              {locale === 'zh' 
                ? '关于 House of Legacy Save Editor'
                : 'About House of Legacy Save Editor'
              }
            </Text>
            <Text fontSize="xs" color="gray.500">
              {locale === 'zh' 
                ? '本工具专为House of Legacy游戏设计，提供最安全、最专业的存档编辑体验。House of Legacy Save Editor让您的游戏体验更加自由和有趣。'
                : 'This tool is specifically designed for House of Legacy game, providing the safest and most professional save editing experience. House of Legacy Save Editor makes your gaming experience more free and enjoyable.'
              }
            </Text>
          </Box> */}
          
          {/* 赞助支持 */}
          <VStack spacing={3} alignItems='center' justifyContent='center' mt='3'>
            {locale === 'en' && <a href='https://ko-fi.com/U7U01FMWB3' target='_blank' rel='noreferrer'>
              <img 
                height='36' 
                style={{border: '0px', height: '36px'}} 
                src='https://storage.ko-fi.com/cdn/kofi3.png?v=6' 
                border='0' 
                alt='Buy Me a Coffee at ko-fi.com' 
              />
            </a>}
            {locale === 'zh' && <JianbingSupport />}
          </VStack>            
        </Box>
      </Flex>

      {/* Schema.org 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "House of Legacy Save Editor",
            "alternateName": ["House of Legacy Modifier", "House of Legacy Game Editor"],
            "description": locale === 'zh' 
              ? "专业的House of Legacy存档编辑工具，免费在线修改游戏存档文件，支持家族成员、门客、妻妾属性编辑。"
              : "Professional House of Legacy Save Editor tool for free online save file editing, supporting family member, guest, and spouse attribute modifications.",
            "applicationCategory": "GameApplication",
            "operatingSystem": "Web Browser",
            "browserRequirements": "HTML5, JavaScript",
            "softwareVersion": "2.0",
            "datePublished": "2024-01-01",
            "dateModified": "2025-06-01",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Organization",
              "name": "House of Legacy Editor Team"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "128"
            },
            "keywords": "House of Legacy, Save Editor, Game Modifier, Save File Editor",
            "inLanguage": [locale === 'en' ? 'en-US' : 'zh-CN'],
            "url": "https://savefile.space",
            "potentialAction": {
              "@type": "UseAction",
              "target": "https://savefile.space",
              "object": {
                "@type": "WebSite",
                "name": "House of Legacy Save Editor"
              }
            }
          })
        }}
      />
      
      
    </>
  );
}

