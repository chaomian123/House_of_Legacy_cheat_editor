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
  Container
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
  
  inject()
  return (
    <>
      <SEOHead />

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
          {/* 头部：标题和更新日志 */}
          <Flex justify='space-between' align='start' mb='6' wrap='wrap'>
            <Heading as="h1" mb={['4', '0']} flex='1'>
              {locale === 'zh' ? '吾今有世家 在线存档修改器' : 'House of Legacy Save Editor'}
            </Heading>
            <Box ml={['0', '4']} fontSize='sm'>
              <Link href='/changelog' style={{textDecoration: 'underline', color: 'inherit'}}>
                {t.updateLog}
                {locale === 'zh' ? '(2025-06-01)' : '(2025-06-01)'}
              </Link>
            </Box>
          </Flex>
          
          <Divider mb='3' />
          {/* <Heading as="h2" size='lg' mb='3' color="blue.700">
            {locale === 'zh' ? '在线存档编辑器' : 'Online Save Editor'}
          </Heading> */}
          <Text textAlign="center" color="gray.600" fontSize="sm" mb='4'>
            {locale === 'zh' 
              ? '无需下载安装，浏览器直接使用，完全免费且安全' 
              : 'No download required, browser-based, completely free and safe'
            }
          </Text>
          <Heading size='md' mb='3'>{t.onlineEditor}</Heading>
          <Text>{t.savePathExample}</Text>
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
          
          <Heading as="h3" size="sm" mb='2' color="blue.600">
            {locale === 'zh' ? '安全编辑存档文件' : 'Safe Save File Editing'}
          </Heading>
          <Text fontSize="sm" color="gray.600" mb='4'>
            {locale === 'zh' 
              ? '本地处理，数据不会上传到服务器，确保您的存档文件完全安全' 
              : 'Local processing, no data uploaded to servers, ensuring your save files are completely secure'
            }
          </Text>
          
          <CryptForm isLoading={isLoading} setIsLoading={setIsLoading} password={password} />
          
          {/* 点赞按钮 */}
          <Box mt='3' display='flex' justifyContent='center'>
            <LikeButton />
          </Box>
          
          <Divider mt='5' mb='3' />
          
          {/* 微信群二维码 */}
          {/* <Box textAlign='center' mb='3'>
            <Popover>
              <PopoverTrigger>
                <Link style={{textDecoration: 'underline', color: 'inherit', cursor: 'pointer'}}>
                  {locale === 'zh' ? '吾今有世家在线存档修改器问题反馈群' : 'House of Legacy Save Editor Feedback Group'}
                </Link>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                  {locale === 'zh' ? '微信群二维码' : 'WeChat Group QR Code'}
                </PopoverHeader>
                <PopoverBody>
                  <Image 
                    src="https://i.postimg.cc/t4cfrFHN/wechatgroup.jpg" 
                    alt={locale === 'zh' ? '微信群二维码' : 'WeChat Group QR Code'}
                    maxW="200px"
                    mx="auto"
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
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

      {/* 导航行 */}
      {/* <Box py='4' borderTop='1px' borderColor='gray.200'>
        <Container maxW='container.lg'>
          <Flex justify='center' align='center' wrap='wrap' gap='4'>
            <Link href='/faq' style={{textDecoration: 'underline', color: 'inherit'}}>
              <span data-nosnippet>{t.faq}</span>
            </Link>
            <Text color='gray.400'>|</Text>
            <Link href='/suggestions' style={{textDecoration: 'underline', color: 'inherit'}}>
              <span data-nosnippet>💡 提建议</span>
            </Link>
          </Flex>
        </Container>
      </Box> */}
      
      
    </>
  );
}

