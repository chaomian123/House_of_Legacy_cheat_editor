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
  IconButton
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import Head from 'next/head';

import CryptForm from '../components/cryptForm';
// import passwords from '../passwords';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <meta property='og:title' content={'EasySave3 Editor | Modify your favorite games\' save files!'} />
        <meta property='og:url' content='https://es3.lol/' />
        <meta
          name='og:description'
          content='EasySave3 Editor helps you empower your gaming journey with effortless save file editing. Seamlessly modify, and manage EasySave3 game saves with a user-friendly web application designed to enhance your gaming experience.'
        />
        <meta
          name='description'
          content='EasySave3 Editor helps you empower your gaming journey with effortless save file editing. Seamlessly modify, and manage EasySave3 game saves with a user-friendly web application designed to enhance your gaming experience.'
        />
      </Head>

      <a id='downloader' style={{ display: 'none' }}></a>
      <Flex alignItems='center' justifyContent='center' mt='24' mb='14'>
        <Box
          direction='column'
          background='gray.700'
          rounded='6'
          p='12'
          position='relative'
        >
          <Heading mb='6'>Easy cheat Editor</Heading>

          <Divider mt='8' mb='3' />
          <Heading size='md' mb='3'>Decryption</Heading>
          <CryptForm isLoading={isLoading} setIsLoading={setIsLoading} password={password} />
          <Text mt='5'>Some games might not encrypt their save files and</Text>
          <Text>only compress them using GZip. In this case, you</Text>
          <Text>don&apos;t have to provide a password.</Text>

          <Divider mt='5' mb='3' />
          <Heading size='md' mb='3'>Encryption</Heading>
          <CryptForm isLoading={isLoading} setIsLoading={setIsLoading} password={password} isEncryption />
        </Box>
      </Flex>
    </>
  );
}
