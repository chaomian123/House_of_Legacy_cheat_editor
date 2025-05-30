import {
  Box,
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  VStack,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { useLocale } from '../lib/useLocale';

const JianbingSupport = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { locale } = useLocale();

  return (
    <>
      {/* 煎饼果子按钮 - 模仿Ko-fi样式 */}
      <Box
        as="button"
        onClick={onOpen}
        bg="#FF8C42"
        color="white"
        borderRadius="6px"
        fontWeight="600"
        fontSize="14px"
        px={4}
        py={2}
        h="36px"
        minW="140px"
        border="0"
        cursor="pointer"
        textDecoration="none"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        gap={2}
        _hover={{
          bg: "#FF7A2B",
          transform: "scale(1.02)",
          boxShadow: "0 2px 8px rgba(255, 140, 66, 0.4)"
        }}
        _active={{
          transform: "scale(0.98)"
        }}
        transition="all 0.2s ease"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
      >
        <Text fontSize="16px" lineHeight="1">
          🥞
        </Text>
        <Text>
          {locale === 'zh' ? '请吃煎饼果子' : 'Buy me Jianbing'}
        </Text>
      </Box>

      {/* 收款码弹窗 */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent
          mx={4}
          borderRadius="16px"
          overflow="hidden"
          boxShadow="0 25px 50px rgba(0, 0, 0, 0.15)"
          bg={useColorModeValue('white', 'gray.800')}
        >
          <ModalHeader 
            bg="linear-gradient(135deg, #FF8C42 0%, #FF7A2B 100%)"
            color="white"
            textAlign="center"
            py={6}
            position="relative"
          >
            <VStack spacing={3}>
              <HStack spacing={3} align="center">
                <Text fontSize="28px" lineHeight="1">🥞</Text>
                <Text fontSize="xl" fontWeight="700" letterSpacing="0.5px">
                  {locale === 'zh' ? '请作者吃个煎饼果子' : 'Buy Author Jianbing'}
                </Text>
              </HStack>
              <Text fontSize="sm" opacity={0.95} fontWeight="400">
                {locale === 'zh' ? 
                  '您的支持是我继续开发的动力！' : 
                  'Your support keeps me motivated!'
                }
              </Text>
            </VStack>
            <ModalCloseButton 
              color="white" 
              size="lg"
              _hover={{ bg: 'whiteAlpha.200' }}
            />
          </ModalHeader>
          
          <ModalBody p={8}>
            <VStack spacing={6}>
              <Text 
                color={useColorModeValue("gray.600", "gray.300")}
                textAlign="center"
                fontSize="sm"
                lineHeight="1.6"
              >
                {locale === 'zh' ? 
                  '扫描下方微信二维码，请作者吃个煎饼果子！' : 
                  'Scan the wechat QR code below to buy the author a delicious Jianbing!'
                }
              </Text>
              
              <Box
                bg={useColorModeValue("white", "gray.700")}
                borderRadius="12px"
                p={6}
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.600")}
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  background: 'linear-gradient(45deg, #FF8C42, #FF7A2B, #FF8C42)',
                  borderRadius: '14px',
                  zIndex: -1,
                  opacity: 0.1
                }}
              >
                <Image
                  src="https://axe-1259245809.cos.ap-chengdu.myqcloud.com/_1748541352_qr_code.jpg"
                  alt={locale === 'zh' ? '收款二维码' : 'Payment QR Code'}
                  w="220px"
                  h="220px"
                  mx="auto"
                  borderRadius="8px"
                  objectFit="cover"
                  fallback={
                    <Box
                      w="220px"
                      h="220px"
                      bg={useColorModeValue("gray.100", "gray.600")}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="8px"
                    >
                      <VStack spacing={3}>
                        <Text fontSize="32px">🥞</Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          {locale === 'zh' ? '赞赏码加载中...' : 'Loading QR code...'}
                        </Text>
                      </VStack>
                    </Box>
                  }
                />
              </Box>
              
              <VStack spacing={2}>
                {/* <Text 
                  fontSize="xs" 
                  color={useColorModeValue("gray.500", "gray.400")}
                  textAlign="center"
                  fontStyle="italic"
                >
                  {locale === 'zh' ? 
                    '煎饼果子 - 中华街头美食的骄傲 🇨🇳' : 
                    'Jianbing - Pride of Chinese street food 🇨🇳'
                  }
                </Text> */}
                <Text 
                  fontSize="xs" 
                  color={useColorModeValue("gray.400", "gray.500")}
                  textAlign="center"
                >
                  {locale === 'zh' ? 
                    '谢谢您的支持！' : 
                    'Thank you for your support!'
                  }
                </Text>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default JianbingSupport; 