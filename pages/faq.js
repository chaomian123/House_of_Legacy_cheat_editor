import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  useColorModeValue,
  Badge,
  Divider
} from '@chakra-ui/react';
import { FaQuestionCircle, FaLightbulb, FaFolder, FaEye } from 'react-icons/fa';
import { useLocale } from '../lib/useLocale';
import SEOHead from '../components/SEOHead';

const FAQItem = ({ question, answer, icon, category }) => {
  const { locale } = useLocale();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const categoryColors = {
    file: 'blue',
    path: 'green',
    general: 'purple'
  };

  return (
    <AccordionItem border="1px" borderColor={borderColor} borderRadius="lg" mb={4}>
      <AccordionButton
        bg={bgColor}
        _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
        borderRadius="lg"
        p={4}
      >
        <Box flex="1" textAlign="left">
          <HStack spacing={3} align="center">
            <Icon as={icon} color={`${categoryColors[category]}.500`} boxSize={5} />
            <VStack align="start" spacing={1}>
              <HStack>
                <Badge colorScheme={categoryColors[category]} variant="subtle" size="sm">
                  {locale === 'zh' ? 
                    (category === 'file' ? '文件' : category === 'path' ? '路径' : '常规') :
                    (category === 'file' ? 'File' : category === 'path' ? 'Path' : 'General')
                  }
                </Badge>
              </HStack>
              <Text fontWeight="semibold" fontSize="md">
                {question}
              </Text>
            </VStack>
          </HStack>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4} pt={2}>
        <Box pl={8}>
          <Text color="gray.600" lineHeight="1.6">
            {answer}
          </Text>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default function FAQ() {
  const { locale } = useLocale();

  const faqData = locale === 'zh' ? [
    {
      question: "我为什么找不到你说的文件夹？",
      answer: "请开启隐藏文件夹显示。在Windows系统中，您需要在文件资源管理器中点击\"查看\"选项卡，然后勾选\"隐藏的项目\"。这样就能看到AppData等隐藏文件夹了。",
      icon: FaEye,
      category: "file"
    },
    {
      question: "文件路径里面的0是什么意思？",
      answer: "如果你的存档位于第一个插槽，请选择0文件夹；如果你的存档位于第二个插槽，请选择1文件夹。简而言之，文件夹的数字与你想更改的存档位于插槽第几个直接相关。数字从0开始计数，所以第一个存档槽对应0，第二个对应1，以此类推。",
      icon: FaFolder,
      category: "path"
    }
  ] : [
    {
      question: "Why can't I find the folder you mentioned?",
      answer: "Please enable the display of hidden folders. In Windows, you need to click the 'View' tab in File Explorer, then check 'Hidden items'. This will allow you to see hidden folders like AppData.",
      icon: FaEye,
      category: "file"
    },
    {
      question: "What does the number 0 in the file path mean?",
      answer: "If your save file is in the first slot, choose the 0 folder; if your save file is in the second slot, choose the 1 folder. In short, the folder number directly corresponds to which slot your save file is in. Numbers start from 0, so the first save slot corresponds to 0, the second to 1, and so on.",
      icon: FaFolder,
      category: "path"
    }
  ];

  return (
    <>
      <SEOHead 
        title={locale === 'zh' ? '吾今有世家存档修改器 常见问题解答' : 'House of Legacy Save Editor - FAQ'}
        description={locale === 'zh' ? '吾今有世家修改器常见问题解答，帮助您快速解决使用中遇到的问题' : 'Frequently asked questions for House of Legacy Editor, helping you quickly solve problems encountered during use'}
      />
      
      <Container maxW="4xl" py={8} pb={20}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <HStack justify="center" mb={4}>
              <Icon as={FaQuestionCircle} boxSize={8} color="blue.500" />
              <Heading size="xl">
                {locale === 'zh' ? '吾今有世家存档修改器 常见问题解答' : 'House of Legacy Save Editor - FAQ'}
              </Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              {locale === 'zh' 
                ? '这里收集了用户最常遇到的问题和解决方案' 
                : 'Here are the most common questions and solutions encountered by users'
              }
            </Text>
          </Box>

          <Divider />

          {/* FAQ Section */}
          <Box>
            <HStack mb={6}>
              <Icon as={FaLightbulb} color="orange.500" boxSize={5} />
              <Heading size="md">
                {locale === 'zh' ? '使用指南' : 'Usage Guide'}
              </Heading>
            </HStack>
            
            <Accordion allowMultiple>
              {faqData.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  icon={item.icon}
                  category={item.category}
                />
              ))}
            </Accordion>
          </Box>

          {/* Footer */}
          <Box textAlign="center" pt={8}>
            <Text color="gray.500" fontSize="sm">
              {locale === 'zh' 
                ? '如果您的问题没有在这里找到答案，请加入我们的反馈群寻求帮助' 
                : 'If your question is not answered here, please join our feedback group for help'
              }
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 