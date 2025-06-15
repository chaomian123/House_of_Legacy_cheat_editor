import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Button,
  useColorModeValue,
  Image,
  Flex,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useLocale } from '../lib/useLocale';
import SEOHead from '../components/SEOHead';
import { FaGamepad, FaTools, FaInfoCircle } from 'react-icons/fa';

const MotionBox = motion(Box);

export default function UnrealGames() {
  const { locale } = useLocale();
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  );

  const games = [
    {
      id: 'palworld',
      title: 'Palworld',
      description: locale === 'zh' 
        ? '幻兽帕鲁存档编辑器 - 修改帕鲁属性、玩家数据、物品等'
        : 'Palworld Save Editor - Edit Pal attributes, player data, items and more',
      image: '/images/games/palworld.jpg',
      status: 'available',
      engine: 'Unreal Engine',
      path: '/unreal-games/palworld'
    },
    {
      id: 'enshrouded',
      title: 'Enshrouded',
      description: locale === 'zh'
        ? '雾锁王国存档编辑器 - 修改角色属性、物品、技能等'
        : 'Enshrouded Save Editor - Edit character attributes, items, skills and more',
      image: '/images/games/enshrouded.jpg',
      status: 'available',
      engine: 'Unreal Engine',
      path: '/unreal-games/enshrouded'
    },
    {
      id: 'ark',
      title: 'ARK: Survival Evolved',
      description: locale === 'zh'
        ? '方舟：生存进化存档编辑器 - 修改恐龙属性、玩家数据等'
        : 'ARK: Survival Evolved Save Editor - Edit dinosaur attributes, player data and more',
      image: '/images/games/ark.jpg',
      status: 'coming',
      engine: 'Unreal Engine',
      path: '/unreal-games/ark'
    }
  ];

  return (
    <>
      <SEOHead 
        title={locale === 'zh' ? '虚幻引擎游戏存档修改器 | Unreal Engine Save Editor' : 'Unreal Engine Save Editor | Game Save File Editor'}
        description={locale === 'zh' 
          ? '专业的虚幻引擎游戏存档修改器，支持多款热门游戏，免费在线编辑游戏存档文件' 
          : 'Professional Unreal Engine save editor supporting multiple popular games. Free online editing of game save files.'
        }
        keywords={locale === 'zh' 
          ? '虚幻引擎存档修改器, 游戏存档编辑器, 帕鲁存档修改, 雾锁王国存档修改'
          : 'Unreal Engine Save Editor, game save editor, Palworld save editor, Enshrouded save editor, ARK save editor'
        }
      />

      <Box
        minH="100vh"
        bgGradient={bgGradient}
        py={20}
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            {/* 标题区域 */}
            <VStack spacing={4} textAlign="center" mb={12}>
              <Heading
                as="h1"
                size="2xl"
                bgGradient="linear(to-r, blue.500, purple.500)"
                bgClip="text"
                fontWeight="extrabold"
              >
                {locale === 'zh' ? '虚幻引擎游戏存档修改器' : 'Unreal Engine Save Editor'}
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl">
                {locale === 'zh'
                  ? '专业的虚幻引擎游戏存档修改工具，支持多款热门游戏'
                  : 'Professional Unreal Engine save editing tools for popular games'}
              </Text>
            </VStack>

            {/* 游戏列表 */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {games.map((game, index) => (
                <MotionBox
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box
                    bg="white"
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="xl"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-5px)' }}
                    position="relative"
                  >
                    {/* 游戏图片 */}
                    <Box
                      h="200px"
                      position="relative"
                      overflow="hidden"
                    >
                      <Image
                        src={game.image}
                        alt={game.title}
                        objectFit="cover"
                        w="100%"
                        h="100%"
                      />
                      <Badge
                        position="absolute"
                        top={4}
                        right={4}
                        colorScheme={
                          game.status === 'available' ? 'green' :
                          game.status === 'new' ? 'blue' : 'gray'
                        }
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {game.status === 'available' ? (locale === 'zh' ? '可用' : 'Available') :
                         game.status === 'new' ? (locale === 'zh' ? '新上线' : 'New') :
                         (locale === 'zh' ? '即将推出' : 'Coming Soon')}
                      </Badge>
                    </Box>

                    {/* 游戏信息 */}
                    <VStack p={6} align="stretch" spacing={4}>
                      <Heading size="md">{game.title}</Heading>
                      <Text color="gray.600" fontSize="sm">
                        {game.description}
                      </Text>
                      
                      <HStack spacing={2}>
                        <Icon as={FaGamepad} color="blue.500" />
                        <Text fontSize="sm" color="gray.500">
                          {game.engine}
                        </Text>
                      </HStack>

                      <Button
                        colorScheme="blue"
                        size="lg"
                        isDisabled={game.status === 'coming'}
                        onClick={() => window.location.href = game.path}
                      >
                        {game.status === 'coming' 
                          ? (locale === 'zh' ? '即将推出' : 'Coming Soon')
                          : (locale === 'zh' ? '进入编辑器' : 'Enter Editor')}
                      </Button>
                    </VStack>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>

            {/* 功能说明 */}
            <Box
              bg="white"
              borderRadius="xl"
              p={8}
              mt={8}
              boxShadow="xl"
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
                      ? '支持多款虚幻引擎游戏，持续更新中'
                      : 'Support for multiple Unreal Engine games, continuously updated'}
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
            </Box>
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
      bg="gray.50"
      borderRadius="lg"
      spacing={4}
      align="start"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
    >
      <Icon as={icon} w={8} h={8} color="blue.500" />
      <Heading size="md">{title}</Heading>
      <Text color="gray.600" fontSize="sm">
        {description}
      </Text>
    </VStack>
  );
} 