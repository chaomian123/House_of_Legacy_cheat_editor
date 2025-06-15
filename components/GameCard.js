import {
  Box,
  Image,
  Badge,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaGamepad } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useLocale } from '../lib/useLocale';
const MotionBox = motion(Box);

const STATUS_COLORS = {
  available: 'green',
  new: 'blue',
  coming: 'gray'
};

const STATUS_TEXTS = {
  available: {
    zh: '可用',
    en: 'Available'
  },
  new: {
    zh: '新功能',
    en: 'New'
  },
  coming: {
    zh: '即将推出',
    en: 'Coming Soon'
  }
};

export default function GameCard({
  title,
  description,
  image,
  status,
  engine,
  path
}) {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const { locale } = useLocale();
  const handleClick = () => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <MotionBox
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        bg={bgColor}
        borderRadius="xl"
        overflow="hidden"
        boxShadow="xl"
        transition="all 0.3s"
        _hover={{ bg: hoverBg }}
        position="relative"
        cursor="pointer"
        onClick={handleClick}
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
      >
        {/* 游戏图片 */}
        <Box
          position="relative"
          overflow="hidden"
          paddingTop="56.25%" // 16:9 比例 (9/16 = 0.5625 = 56.25%)
        >
          <Image
            src={image}
            alt={title}
            objectFit="cover"
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            transition="transform 0.3s"
            _groupHover={{ transform: 'scale(1.05)' }}
          />
          <Badge
            position="absolute"
            top={4}
            right={4}
            colorScheme={
              status === 'available' ? 'green' :
              status === 'new' ? 'blue' : 'gray'
            }
            px={3}
            py={1}
            borderRadius="full"
            fontSize="sm"
            fontWeight="bold"
            zIndex={1}
          >
            {status === 'available' ? 'Available' :
             status === 'new' ? 'New' : 'Coming Soon'}
          </Badge>
        </Box>

        {/* 游戏信息 */}
        <VStack p={6} align="stretch" spacing={4}>
          <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.700', 'white')}>
            {title}
          </Text>
          <Text color={textColor} fontSize="sm">
            {description}
          </Text>
          
          <HStack spacing={2}>
            <Icon as={FaGamepad} color="blue.500" />
            <Text fontSize="sm" color={textColor}>
              {engine}
            </Text>
          </HStack>

          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleClick}
            _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
            transition="all 0.2s"
          >
            {locale === 'zh' ? '进入编辑器' : 'Enter Editor'}
          </Button>
        </VStack>
      </Box>
    </MotionBox>
  );
} 