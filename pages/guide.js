import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  Divider,
  List,
  ListItem,
  ListIcon,
  Code,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';
import { useLocale } from '../lib/useLocale';
import SEOHead from '../components/SEOHead';

export default function Guide() {
  const { locale, t } = useLocale();

  return (
    <>
      <SEOHead 
        title={locale === 'zh' ? '看了就会的修改器使用指南 | 吾今有世家存档修改器' : 'Easy Guide for Save Editor | House of Legacy Save Editor'}
        description={locale === 'zh' 
          ? '详细的吾今有世家存档修改器使用教程，包含存档路径查找、文件选择、修改保存等完整步骤说明'
          : 'Detailed House of Legacy Save Editor tutorial with complete step-by-step instructions for save file modification'
        }
        keywords={locale === 'zh' 
          ? '吾今有世家修改器教程, 存档修改指南, 使用说明, 操作步骤'
          : 'House of Legacy editor tutorial, save modification guide, usage instructions, step by step'
        }
      />

      <Container maxW="4xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="xl" mb={4} color="blue.600">
              {locale === 'zh' ? '看了就会的修改器使用指南' : 'Easy Save Editor Guide'}
            </Heading>
            <Text fontSize="lg" color="gray.600">
              {locale === 'zh' 
                ? '详细的吾今有世家存档修改器使用教程'
                : 'Detailed House of Legacy Save Editor Tutorial'
              }
            </Text>
          </Box>

          <Divider />

          {/* 基本信息 */}
          <Box>
            <Heading as="h2" size="lg" mb={4} color="blue.700">
              {locale === 'zh' ? '基本信息' : 'Basic Information'}
            </Heading>
            <VStack spacing={3} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={2}>
                  {locale === 'zh' ? '修改器网址：' : 'Editor URL:'}
                </Text>
                <Code p={2} bg="gray.100" borderRadius="md" display="block">
                  https://savefile.space/
                </Code>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>
                  {locale === 'zh' ? '存档路径：' : 'Save File Path:'}
                </Text>
                <Code p={2} bg="gray.100" borderRadius="md" display="block" fontSize="sm">
                  C:\Users\Administrator\AppData\LocalLow\S3Studio\House of Legacy\FW\0
                </Code>
              </Box>
            </VStack>
          </Box>

          {/* 路径说明 */}
          <Alert status="info">
            <AlertIcon />
            <Box>
              <AlertTitle>
                {locale === 'zh' ? '路径说明' : 'Path Instructions'}
              </AlertTitle>
              <AlertDescription>
                {locale === 'zh' 
                  ? '适用绝大多数人，如果不适用请修改Administrator（用户名）。如果你的电脑里面没有Administrator文件夹，一般来讲是你设置了别名，而别名一般来说和你登录电脑时候的用户名相同，你替换成自己的用户名即可。'
                  : 'This path works for most users. If not applicable, please replace "Administrator" with your username. If there is no Administrator folder on your computer, it means you have set an alias, which is usually the same as your computer login username.'
                }
              </AlertDescription>
            </Box>
          </Alert>

          {/* 使用步骤 */}
          <Box>
            <Heading as="h2" size="lg" mb={4} color="blue.700">
              {locale === 'zh' ? '修改器使用流程' : 'Usage Steps'}
            </Heading>
            <VStack spacing={6} align="stretch">
              
              {/* 步骤1 */}
              <Box>
                <Heading as="h3" size="md" mb={3} color="green.600" display="flex" alignItems="center">
                  <CheckCircleIcon color="green.500" mr={2} />
                  {locale === 'zh' ? '步骤1：点击选择文件' : 'Step 1: Click Select File'}
                </Heading>
                <Image
                  src="https://makemaze.online/images/1749185247062_1jz49iby.png"
                  alt={locale === 'zh' ? '点击选择文件' : 'Click select file'}
                  maxW="100%"
                  height="auto"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                />
              </Box>

              {/* 步骤2 */}
              <Box>
                <Heading as="h3" size="md" mb={3} color="green.600" display="flex" alignItems="center">
                  <CheckCircleIcon color="green.500" mr={2} />
                  {locale === 'zh' ? '步骤2：按照存档路径选择存档' : 'Step 2: Select Save File According to Path'}
                </Heading>
                <Image
                  src="https://makemaze.online/images/1749185249282_q9uh8565.png"
                  alt={locale === 'zh' ? '按照存档路径选择存档' : 'Select save file according to path'}
                  maxW="100%"
                  height="auto"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                />
              </Box>

              {/* 步骤3 */}
              <Box>
                <Heading as="h3" size="md" mb={3} color="green.600" display="flex" alignItems="center">
                  <CheckCircleIcon color="green.500" mr={2} />
                  {locale === 'zh' ? '步骤3：修改完成后保存文档' : 'Step 3: Save Document After Modification'}
                </Heading>
                <Image
                  src="https://makemaze.online/images/1749185253284_vah3co1k.png"
                  alt={locale === 'zh' ? '修改完成后保存文档' : 'Save document after modification'}
                  maxW="100%"
                  height="auto"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                />
              </Box>

              {/* 步骤4 */}
              <Box>
                <Heading as="h3" size="md" mb={3} color="green.600" display="flex" alignItems="center">
                  <CheckCircleIcon color="green.500" mr={2} />
                  {locale === 'zh' ? '步骤4：将修改后的存档复制，并覆盖原来的存档' : 'Step 4: Copy Modified Save and Replace Original'}
                </Heading>
                <VStack spacing={3}>
                  <Image
                    src="https://makemaze.online/images/1749185254748_qej7yipj.png"
                    alt={locale === 'zh' ? '复制修改后的存档' : 'Copy modified save'}
                    maxW="100%"
                    height="auto"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                  />
                  <Image
                    src="https://makemaze.online/images/1749185255669_fj59j16g.png"
                    alt={locale === 'zh' ? '覆盖原来的存档' : 'Replace original save'}
                    maxW="100%"
                    height="auto"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                  />
                </VStack>
              </Box>
            </VStack>
          </Box>

          <Divider />

          {/* 常见问题 */}
          <Box>
            <Heading as="h2" size="lg" mb={4} color="blue.700">
              {locale === 'zh' ? '常见问题' : 'Common Issues'}
            </Heading>
            <VStack spacing={4} align="stretch">
              <Alert status="warning">
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {locale === 'zh' ? '常见问题1' : 'Common Issue 1'}
                  </AlertTitle>
                  <AlertDescription>
                    {locale === 'zh' 
                      ? '网址无法打开，更换浏览器、或者挂梯子。'
                      : 'Website cannot be opened, try changing browser or using VPN.'
                    }
                  </AlertDescription>
                </Box>
              </Alert>

              <Alert status="warning">
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {locale === 'zh' ? '常见问题2' : 'Common Issue 2'}
                  </AlertTitle>
                  <AlertDescription>
                    {locale === 'zh' 
                      ? '修改后没有效果，保存修改并覆盖原文档。'
                      : 'No effect after modification, save changes and replace original file.'
                    }
                  </AlertDescription>
                </Box>
              </Alert>
            </VStack>
          </Box>

          <Divider />

          {/* 科举考试时间 */}
          <Box>
            <Heading as="h2" size="lg" mb={4} color="blue.700">
              {locale === 'zh' ? '科举考试时间' : 'Imperial Examination Schedule'}
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={InfoIcon} color="blue.500" />
                <Text as="span" fontWeight="bold">
                  {locale === 'zh' ? '童试：' : 'Children\'s Exam: '}
                </Text>
                {locale === 'zh' 
                  ? '每年三月举行，是科举考试的初级阶段，玩家可以反复参加以积累经验'
                  : 'Held every March, it is the primary stage of the imperial examination, players can participate repeatedly to accumulate experience'
                }
              </ListItem>
              <ListItem>
                <ListIcon as={InfoIcon} color="blue.500" />
                <Text as="span" fontWeight="bold">
                  {locale === 'zh' ? '乡试：' : 'Provincial Exam: '}
                </Text>
                {locale === 'zh' 
                  ? '在角色第三年的十月举行，通过后称为"举人"，第一名被称为"解元"'
                  : 'Held in October of the character\'s third year, those who pass are called "Juren", and the first place is called "Jieyuan"'
                }
              </ListItem>
              <ListItem>
                <ListIcon as={InfoIcon} color="blue.500" />
                <Text as="span" fontWeight="bold">
                  {locale === 'zh' ? '会试：' : 'Metropolitan Exam: '}
                </Text>
                {locale === 'zh' 
                  ? '在角色第四年的四月举行，通过后称为"贡士"，第一名被称为"会元"'
                  : 'Held in April of the character\'s fourth year, those who pass are called "Gongshi", and the first place is called "Huiyuan"'
                }
              </ListItem>
              <ListItem>
                <ListIcon as={InfoIcon} color="blue.500" />
                <Text as="span" fontWeight="bold">
                  {locale === 'zh' ? '殿试：' : 'Palace Exam: '}
                </Text>
                {locale === 'zh' 
                  ? '在角色第四年的六月举行，由皇帝亲自主持，决定最终的功名。前三名分别被称为"状元"、"榜眼"和"探花"，其余通过者称为"进士"'
                  : 'Held in June of the character\'s fourth year, presided over by the Emperor himself, determining the final honors. The top three are called "Zhuangyuan", "Bangyan" and "Tanhua", and the rest who pass are called "Jinshi"'
                }
              </ListItem>
            </List>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 