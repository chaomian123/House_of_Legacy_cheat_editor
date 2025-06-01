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
  const pathRef = useRef(null);
  
  // 动态插入路径，避免SEO索引
  useEffect(() => {
    if (pathRef.current) {
      const pathText = 'C:\\Users\\用户名\\AppData\\LocalLow\\S3Studio\\House of Legacy\\FW\\0\\GameData.es3';
      pathRef.current.textContent = pathText;
    }
  }, []);
  
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
            <Heading mb={['4', '0']} flex='1'>{t.mainTitle}</Heading>
            <Box ml={['0', '4']} fontSize='sm'>
              <Link href='/changelog' style={{textDecoration: 'underline', color: 'inherit'}}>
                {t.updateLog}
                {locale === 'zh' ? '(2025-05-31)' : '(2025-05-31)'}
              </Link>
            </Box>
          </Flex>
          
          <Divider mb='3' />
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
            <p  
              data-nosnippet="true"
              role="presentation"
              aria-hidden="true"
              style={{ 
                fontFamily: 'monospace',
                margin: 0,
                padding: 0,
                color: '#666'
              }}
              ref={pathRef}
            >
              {/* 路径将通过JavaScript动态插入，避免SEO索引 */}
            </p>
          </Box>
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
              {t.faq}
            </Link>
            <Text color='gray.400'>|</Text>
            <Link href='/changelog' style={{textDecoration: 'underline', color: 'inherit'}}>
              {t.updateLog}
            </Link>
          </Flex>
        </Container>
      </Box> */}
      
      
    </>
  );
}

