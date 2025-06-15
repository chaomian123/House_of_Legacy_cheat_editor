import {
  Box,
  Code,
  Divider,
  Flex,
  Heading,
  Input,
  Text,
  Button,
  useDisclosure,
  IconButton,
  Link,
  Image,
  VStack,
  HStack,
  Container,
  useToast,
  Spinner,
  Badge,
  List,
  ListItem,
  ListIcon,
  Collapse,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormHelperText,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useEffect, useState, useRef } from 'react';
import { useLocale } from '../lib/useLocale';
import SEOHead from '../components/SEOHead';
import JianbingSupport from '../components/hol/JianbingSupport';
import LikeButton from '../components/hol/LikeButton';
import { inject } from "@vercel/analytics"
import CryptForm from '../components/hol/CryptForm';
import SurveyVote from '../components/hol/SurveyVote';
import FeedbackGroupModal from '../components/hol/FeedbackGroupModal';
import Navigation from '../components/Navigation';
import ThirdPartyScripts from '../components/ThirdPartyScripts';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { FaHeart, FaRegHeart, FaThumbsUp, FaThumbsDown, FaQuestionCircle } from 'react-icons/fa';

export default function HouseOfLegacy() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isFeedbackOpen, onOpen: onFeedbackOpen, onClose: onFeedbackClose } = useDisclosure();
  const { locale, t } = useLocale();
  const toast = useToast();
  
  // 功能列表折叠状态
  const [isFeatureListOpen, setIsFeatureListOpen] = useState(false);

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
              <VStack spacing={2}>
                <HStack spacing={2} justifyContent="center" alignItems="center">
                  <Link href='/hol_guide' style={{textDecoration: 'underline', color: 'inherit'}}>
                    {t.userGuide}
                  </Link>
                  <Badge 
                    colorScheme="red" 
                    variant="solid" 
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                    animation="pulse 2s infinite"
                    fontWeight="bold"
                  >
                    NEW
                  </Badge>
                </HStack>
                <Link href='/changelog' style={{textDecoration: 'underline', color: 'inherit'}}>
                  {t.updateLog}
                  {locale === 'zh' ? '(2025-06-06)' : '(2025-06-06)'}
                </Link>
              </VStack>
            </Box>
          </Box>
          
          <Divider mb='4' />

          {/* House of Legacy Save Editor 功能介绍 */}
          <Box mb='4'>
            <Heading
              as="h2" 
              size='md' 
              mb='3' 
              color="blue.700"
              cursor="pointer"
              onClick={() => setIsFeatureListOpen(!isFeatureListOpen)}
              _hover={{ color: "blue.600" }}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {locale === 'zh' ? '吾今有世家 存档编辑功能' : 'House of Legacy Save Editor Features'}
              <Text fontSize="sm" color="gray.500" ml={2}>
                {isFeatureListOpen ? '▼' : '▶'}
              </Text>
            </Heading>
            
            <Collapse in={isFeatureListOpen} animateOpacity>
              <Text fontSize="sm" color="gray.700" mb='3'>
                {locale === 'zh'
                  ? '吾今有世家存档编辑器支持功能：'
                  : 'House of Legacy Save Editor provides comprehensive save editing features, allowing you to easily modify various game attributes:'
                }
              </Text>

              <List spacing={1} fontSize="sm" mb='4'>
                <ListItem>
                  • {locale === 'zh' ? '家族成员属性编辑' : 'family member attributes editing'}
                </ListItem>
                <ListItem>
                  • {locale === 'zh' ? '门客系统修改' : 'guest system modification'}
                </ListItem>
                <ListItem>
                  • {locale === 'zh' ? '妻妾婿属性调整' : 'spouse attributes adjustment'}
                </ListItem>
                <ListItem>
                  • {locale === 'zh' ? '货币和资源编辑' : 'currency and resources editing'}
                </ListItem>
                <ListItem>
                  • {locale === 'zh' ? '技能数值修改' : 'skill values modification'}
                </ListItem>
                <ListItem>
                  • {locale === 'zh' ? '怀孕状态编辑' : 'pregnancy status editing'}
                </ListItem>
              </List>
            </Collapse>
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
          {/* <Box mt='3' display='flex' justifyContent='center'>
            <LikeButton />
          </Box> */}
          
          {/* 问题反馈群按钮 - 仅中文环境显示 */}
          {locale === 'zh' && (
            <Box mt='3' display='flex' justifyContent='center'>
              <Button
                onClick={onFeedbackOpen}
                colorScheme="green"
                variant="outline"
                size="sm"
                _hover={{ bg: "green.50" }}
              >
                {t.feedbackGroup}
              </Button>
            </Box>
          )}
          
          <Divider mt='5' mb='3' />
          
          {/* 调查组件 */}
          {/* <Box mt={8}>
            <SurveyVote 
              surveyId="default"
              title="您觉得这个工具对您有帮助吗？"
              yesText="有帮助"
              noText="没帮助"
            />
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

 

      {/* 问题反馈群弹窗 */}
      <FeedbackGroupModal 
        isOpen={isFeedbackOpen}
        onClose={onFeedbackClose}
      />
    </>
  );
} 