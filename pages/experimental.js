import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { FaFlask, FaHammer, FaCog, FaExclamationTriangle } from 'react-icons/fa';
import { useLocale } from '../lib/useLocale';
import SEOHead from '../components/SEOHead';

const ExperimentalFeatureCard = ({ title, description, status, icon }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      shadow="sm"
      position="relative"
    >
      <HStack spacing={4} align="start">
        <Icon as={icon} boxSize={6} color="orange.500" />
        <VStack align="start" spacing={2} flex={1}>
          <HStack>
            <Heading size="md">{title}</Heading>
            <Badge colorScheme="orange" variant="subtle">
              {status}
            </Badge>
          </HStack>
          <Text color="gray.600" fontSize="sm">
            {description}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default function Experimental() {
  const { locale } = useLocale();

  const experimentalFeatures = locale === 'zh' ? [
    {
      title: "一键清除宅院建筑",
      description: "快速清除游戏中的所有宅院建筑，重置宅院布局到初始状态。此功能正在开发中，敬请期待。",
      status: "开发中",
      icon: FaHammer
    }
  ] : [
    {
      title: "One-Click Clear Estate Buildings",
      description: "Quickly clear all estate buildings in the game and reset the estate layout to its initial state. This feature is under development, stay tuned.",
      status: "In Development",
      icon: FaHammer
    }
  ];

  return (
    <>
      <SEOHead 
        title={locale === 'zh' ? '实验功能 - 吾今有世家修改器' : 'Experimental Features - House of Legacy Editor'}
        description={locale === 'zh' ? '吾今有世家修改器实验功能页面，包含正在开发中的新功能' : 'Experimental features page for House of Legacy Editor, containing new features under development'}
      />
      
      <Container maxW="4xl" py={8} pb={20}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <HStack justify="center" mb={4}>
              <Icon as={FaFlask} boxSize={8} color="orange.500" />
              <Heading size="xl">
                {locale === 'zh' ? '实验功能' : 'Experimental Features'}
              </Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              {locale === 'zh' 
                ? '这里展示正在开发中的实验性功能' 
                : 'Here are experimental features under development'
              }
            </Text>
          </Box>

          <Divider />

          {/* Warning Alert */}
          <Alert status="warning" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>
                {locale === 'zh' ? '注意事项' : 'Important Notice'}
              </AlertTitle>
              <AlertDescription>
                {locale === 'zh' 
                  ? '实验功能可能不稳定，使用前请务必备份您的存档文件。这些功能仍在开发中，可能会发生变化。' 
                  : 'Experimental features may be unstable. Please backup your save files before use. These features are still under development and may change.'
                }
              </AlertDescription>
            </Box>
          </Alert>

          {/* Under Construction */}
          <Box textAlign="center" py={12}>
            <VStack spacing={6}>
              <Icon as={FaCog} boxSize={16} color="gray.400" />
              <Heading size="lg" color="gray.500">
                {locale === 'zh' ? '正在建设中' : 'Under Construction'}
              </Heading>
              <Text color="gray.500" fontSize="lg" maxW="md">
                {locale === 'zh' 
                  ? '我们正在努力开发新的实验功能，敬请期待！' 
                  : 'We are working hard on developing new experimental features, stay tuned!'
                }
              </Text>
            </VStack>
          </Box>

          {/* Future Features Preview */}
          <Box>
            <HStack mb={6}>
              <Icon as={FaExclamationTriangle} color="orange.500" boxSize={5} />
              <Heading size="md">
                {locale === 'zh' ? '即将推出的功能' : 'Upcoming Features'}
              </Heading>
            </HStack>
            
            <VStack spacing={4} align="stretch">
              {experimentalFeatures.map((feature, index) => (
                <ExperimentalFeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  status={feature.status}
                  icon={feature.icon}
                />
              ))}
            </VStack>
          </Box>

          {/* Footer */}
          <Box textAlign="center" pt={8}>
            <Text color="gray.500" fontSize="sm">
              {locale === 'zh' 
                ? '如果您有功能建议或想法，欢迎加入我们的反馈群分享' 
                : 'If you have feature suggestions or ideas, feel free to join our feedback group to share'
              }
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 