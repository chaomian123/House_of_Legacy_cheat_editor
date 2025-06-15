import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  useColorModeValue,
  Image,
  Flex,
  Icon,
  Button,
  Badge,
  useColorMode
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useLocale } from '../lib/useLocale';
import SEOHead from '../components/SEOHead';
import GameCard from '../components/GameCard';


const MotionBox = motion(Box);

export default function Home() {
  const { locale } = useLocale();
  const { colorMode } = useColorMode();
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  );

  const games = [
    {
      id: 'hol',
      title: locale === 'zh' ? '吾今有世家' : 'House of Legacy',
      description: locale === 'zh' 
        ? '吾今有世家存档编辑器 - 修改家族成员属性、门客系统、妻妾婿属性等'
        : 'House of Legacy Save Editor - Edit family member attributes, guest system, spouse attributes and more',
      image: 'https://makemaze.online/images/1750002850230_vrt5yhyp.png',
      status: 'available',
      engine: 'Custom Engine',
      path: '/house-of-legacy'
    },
    {
      id: 'expedition33',
      title: locale === 'zh' ? '光与影: 33号远征队' : 'Clair Obscur: Expedition 33',
      description: locale === 'zh'
        ? '33号远征队存档编辑器 - 修改灵光点、金币、物品、服装发型等'
        : 'Clair Obscur: Expedition 33 Save Editor in browser - Edit lumina points, gold, items, outfits, hair and more',
      image: 'https://makemaze.online/images/1750002852122_57dcf4ey.png',
      status: 'new',
      engine: 'Unreal Engine',
      path: '/expedition33'
    }
  ];

  return (
    <>
      <SEOHead 
        title={locale === 'zh' ? '游戏存档修改器 | Game Save Editor' : 'Game Save Editor | Professional Save File Editor'}
        description={locale === 'zh' 
          ? '专业的游戏存档修改器，支持多款热门游戏，免费在线编辑游戏存档文件' 
          : 'Professional game save editor supporting multiple popular games. Free online editing of game save files.'
        }
        keywords={locale === 'zh' 
          ? '游戏存档修改器, 存档编辑器, 吾今有世家存档修改, 33号远征队存档修改'
          : 'Game Save Editor, save file editor, House of Legacy save editor, Expedition 33 save editor'
        }
      />

      <Box
        minH="100vh"
        position="relative"
        overflow="hidden"
      >
     

        {/* 渐变背景 */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient={bgGradient}
          opacity={0.8}
          zIndex={1}
        />

        {/* 主要内容 */}
        <Container maxW="container.xl" position="relative" zIndex={2} py={20}>
          <VStack spacing={8} align="stretch">
            {/* 标题区域 */}
            <VStack spacing={4} textAlign="center" mb={12}>
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Heading
                  as="h1"
                  size="2xl"
                  bgGradient="linear(to-r, blue.500, purple.500)"
                  bgClip="text"
                  fontWeight="extrabold"
                >
                  {locale === 'zh' ? '在线游戏存档修改器' : 'Game Save Editor in browser'}
                </Heading>
              </MotionBox>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Text fontSize="xl" color="gray.600" maxW="2xl">
                  {locale === 'zh'
                    ? '选择你想要编辑存档的游戏'
                    : 'Select the game you want to edit'}
                </Text>
              </MotionBox>
            </VStack>

            {/* 游戏列表 */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              {games.map((game, index) => (
                <MotionBox
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GameCard
                    title={game.title}
                    description={game.description}
                    image={game.image}
                    status={game.status}
                    engine={game.engine}
                    path={game.path}
                  />
                </MotionBox>
              ))}
            </SimpleGrid>

            {/* 功能说明 */}
            {/* <Box
              borderRadius="xl"
              p={8}
              mt={8}
              boxShadow="xl"
              bg={useColorModeValue('white', 'gray.800')}
            >
              <VStack spacing={6} align="stretch">
                <Heading size="lg" textAlign="center">
                  {locale === 'zh' ? '主要功能' : 'Key Features'}
                </Heading>
                
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                  <FeatureCard
                    icon={FaTools}
                    title={locale === 'zh' ? '存档编辑' : 'Save Editing'}
                    description={locale === 'zh'
                      ? '支持修改游戏存档中的各种数据，包括角色属性、物品、技能等'
                      : 'Edit various game data including character attributes, items, skills and more'}
                  />
                  <FeatureCard
                    icon={FaGamepad}
                    title={locale === 'zh' ? '多游戏支持' : 'Multi-Game Support'}
                    description={locale === 'zh'
                      ? '支持多款热门游戏，持续更新中'
                      : 'Support for multiple popular games, continuously updated'}
                  />
                  <FeatureCard
                    icon={FaInfoCircle}
                    title={locale === 'zh' ? '使用指南' : 'User Guide'}
                    description={locale === 'zh'
                      ? '详细的使用说明和教程，帮助您快速上手'
                      : 'Detailed instructions and tutorials to help you get started quickly'}
                  />
                </SimpleGrid>
              </VStack>
            </Box> */}
          </VStack>
        </Container>
      </Box>
    </>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <VStack
      p={6}
      bg={useColorModeValue('gray.50', 'gray.700')}
      borderRadius="lg"
      spacing={4}
      align="start"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
    >
      <Icon as={icon} w={8} h={8} color="blue.500" />
      <Heading size="md">{title}</Heading>
      <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize="sm">
        {description}
      </Text>
    </VStack>
  );
}

