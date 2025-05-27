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
  Link
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
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
          <Text>{t.savePathExample}<Code>C:\Users\用户名\AppData\LocalLow\S3Studio\House of Legacy\FW\0</Code></Text>
          <CryptForm isLoading={isLoading} setIsLoading={setIsLoading} password={password} />
          <Divider mt='5' mb='3' />
          <Text>{t.updateLog}</Text>
            <ul>
              {t.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
        </Box>
      </Flex>
    </>
  );
}

