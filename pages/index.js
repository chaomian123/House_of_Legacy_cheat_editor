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
          background='Blue.100'
          rounded='6'
          p='12'
          position='relative'
        >
          <Heading mb='6'>吾今有世家  在线存档修改器</Heading>
          <Divider mt='8' mb='3' />
          <Heading size='md' mb='3'>存档在线编辑</Heading>
          <Text>存档路径示例<Code>C:\Users\用户名\AppData\LocalLow\S3Studio\House of Legacy\FW\0</Code></Text>
          <CryptForm isLoading={isLoading} setIsLoading={setIsLoading} password={password} />
          <Divider mt='5' mb='3' />
          <Text>功能更新日志 2025/5/23</Text>
            <ul>
              <li>家族成员属性编辑: 文,武,商,艺,谋,幸运,魅力,天赋</li>
              <li>门客属性编辑: 年龄,文,武,商,艺,谋</li>
            </ul>

            <Link href="https://gamertool.space/blog/expediton33-pictos">33号远征队全符文收集</Link>
        </Box>
      </Flex>
    </>
  );
}
