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
  Image
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useEffect, useState, useRef } from 'react';
import { useLocale } from '../lib/useLocale';
import SEOHead from '../components/SEOHead';
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
      <Flex alignItems='center' justifyContent='center' mt='24' mb='20'>
        <Box
          direction='column'
          background='Blue.100'
          rounded='6'
          p='12'
          position='relative'
        >
          <Heading mb='6'>{t.mainTitle}</Heading>
          <Divider mt='8' mb='3' />
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
          <Divider mt='5' mb='3' />
          <Link href='/changelog' style={{textDecoration: 'underline', color: 'inherit'}}>
            {t.updateLog}
            {locale === 'zh' ? '(上次更新时间: 2025-05-29)' : '(Last updated: 2025-05-29)'}
          </Link>
          <br />
          <Popover >
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
            {/* <ul>
              {t.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul> */}
            <Flex alignItems='center' justifyContent='center' mt='5'>
              <a href='https://ko-fi.com/U7U01FMWB3' target='_blank' rel='noreferrer'>
                <img 
                  height='36' 
                  style={{border: '0px', height: '36px'}} 
                  src='https://storage.ko-fi.com/cdn/kofi3.png?v=6' 
                  border='0' 
                  alt='Buy Me a Coffee at ko-fi.com' 
                />
              </a>  
            </Flex>            
        </Box>
      
      </Flex>
    </>
  );
}

