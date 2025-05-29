import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FaCalendarAlt, FaCode, FaBug, FaPlus, FaUsers, FaHeart, FaGlobe } from 'react-icons/fa';
import { useLocale } from '../lib/useLocale';
import SEOHead from '../components/SEOHead';

const TimelineItem = ({ date, type, title, description, isLast }) => {
  const { locale } = useLocale();
  
  const getTypeConfig = (type) => {
    const configs = {
      feature: { icon: FaPlus, color: 'green', label: locale === 'zh' ? '新功能' : 'Feature' },
      fix: { icon: FaBug, color: 'red', label: locale === 'zh' ? '修复' : 'Fix' },
      enhancement: { icon: FaCode, color: 'blue', label: locale === 'zh' ? '优化' : 'Enhancement' },
      family: { icon: FaUsers, color: 'purple', label: locale === 'zh' ? '家族' : 'Family' },
      spouse: { icon: FaHeart, color: 'pink', label: locale === 'zh' ? '嫁娶' : 'Spouse' },
      i18n: { icon: FaGlobe, color: 'orange', label: locale === 'zh' ? '国际化' : 'i18n' }
    };
    return configs[type] || configs.feature;
  };

  const typeConfig = getTypeConfig(type);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <HStack align="start" spacing={4} position="relative">
      {/* Timeline line */}
      {!isLast && (
        <Box
          position="absolute"
          left="20px"
          top="40px"
          bottom="-20px"
          width="2px"
          bg={borderColor}
          zIndex={0}
        />
      )}
      
      {/* Timeline dot */}
      <Box
        position="relative"
        zIndex={1}
        bg={`${typeConfig.color}.500`}
        borderRadius="full"
        p={2}
        color="white"
      >
        <Icon as={typeConfig.icon} boxSize={4} />
      </Box>

      {/* Content */}
      <Box flex={1} bg={bgColor} p={4} borderRadius="lg" border="1px" borderColor={borderColor} shadow="sm">
        <HStack justify="space-between" align="start" mb={2}>
          <VStack align="start" spacing={1}>
            <HStack>
              <Badge colorScheme={typeConfig.color} variant="subtle">
                {typeConfig.label}
              </Badge>
              <HStack color="gray.500" fontSize="sm">
                <Icon as={FaCalendarAlt} boxSize={3} />
                <Text>{date}</Text>
              </HStack>
            </HStack>
            <Heading size="sm" color={`${typeConfig.color}.600`}>
              {title}
            </Heading>
          </VStack>
        </HStack>
        <Text color="gray.600" fontSize="sm">
          {description}
        </Text>
      </Box>
    </HStack>
  );
};

export default function Changelog() {
  const { locale, t } = useLocale();

  const changelogData = locale === 'zh' ? [
    {
      date: '2025-05-29',
      type: 'feature',
      title: '货币管理功能',
      description: '新增金钱和元宝编辑功能，支持直接修改游戏货币数量'
    },
    {
      date: '2025-05-29',
      type: 'feature',
      title: '立即怀孕功能',
      description: '为符合游戏怀孕条件的成员添加立即怀孕功能'
    },
    {
      date: '2025-05-29',
      type: 'family',
      title: '家族成员技能编辑',
      description: '支持修改技能(无/医)和技能数值'
    },
    {
      date: '2025-05-29',
      type: 'spouse',
      title: '嫁娶成员技能编辑',
      description: '支持修改技能(无/医)和技能数值'
    },
    {
      date: '2025-05-28',
      type: 'family',
      title: '支持修改家族成员年龄',
      description: '新增家族成员年龄编辑功能。'
    },
    {
      date: '2025-05-27',
      type: 'fix',
      title: '修复门客属性修改bug',
      description: '解决了门客属性编辑时可能出现的数据保存问题，确保修改能够正确应用到存档文件中。'
    },
    {
      date: '2025-05-27',
      type: 'spouse',
      title: '妻妾婿属性编辑',
      description: '新增对妻妾婿成员的完整属性编辑支持，包括年龄、文、武、商、艺、谋、幸运、魅力、天赋等所有属性的修改功能。'
    },
    {
      date: '2025-05-26',
      type: 'i18n',
      title: '新增英语支持',
      description: '添加完整的英语界面支持，用户可以在中文和英文之间自由切换，提供更好的国际化体验。包含所有界面文本、错误提示和功能说明的双语支持。'
    },
    {
      date: '2025-05-23',
      type: 'feature',
      title: '门客属性编辑',
      description: '实现门客属性的在线编辑功能，支持修改年龄、文、武、商、艺、谋等核心属性，让玩家可以自定义门客的能力值。'
    },
    {
      date: '2025-05-23',
      type: 'family',
      title: '家族成员属性编辑',
      description: '开发家族成员属性编辑系统，支持修改文、武、商、艺、谋、幸运、魅力、天赋等属性，为玩家提供全面的角色定制功能。'
    }
  ] : [
    {
      date: '2025-05-29',
      type: 'feature',
      title: 'Currency Management',
      description: 'Added money and yuanbao editing functionality for direct game currency modification'
    },
    {
      date: '2025-05-29',
      type: 'feature',
      title: 'Immediate Pregnancy Feature',
      description: 'Added immediate pregnancy function for members who meet game pregnancy conditions'
    },
    {
      date: '2025-05-29',
      type: 'family',
      title: 'Family Member Skill Editing',
      description: 'Support editing skills (None/Medical) and skill values'
    },
    {
      date: '2025-05-29',
      type: 'spouse',
      title: 'Spouse Skill Editing',
      description: 'Support editing skills (None/Medical) and skill values'
    },
    {
      date: '2025-05-28',
      type: 'family',
      title: 'Support for Editing Family Member Age',
      description: 'Added family member age editing functionality.'
    },
    {
      date: '2025-05-27',
      type: 'fix',
      title: 'Fixed Guest Attribute Editing Bug',
      description: 'Resolved data saving issues that could occur when editing guest attributes, ensuring modifications are correctly applied to save files.'
    },
    {
      date: '2025-05-27',
      type: 'spouse',
      title: 'Spouse Attribute Editing',
      description: 'Added comprehensive attribute editing support for spouses, including age, literature, martial, commerce, art, strategy, luck, charm, and talent modifications.'
    },
    {
      date: '2025-05-26',
      type: 'i18n',
      title: 'Added English Language Support',
      description: 'Implemented full English interface support with seamless Chinese-English switching. Includes bilingual support for all interface text, error messages, and feature descriptions.'
    },
    {
      date: '2025-05-23',
      type: 'feature',
      title: 'Guest Attribute Editing',
      description: 'Implemented online editing functionality for guest attributes, supporting modifications to age, literature, martial, commerce, art, and strategy core attributes.'
    },
    {
      date: '2025-05-23',
      type: 'family',
      title: 'Family Member Attribute Editing',
      description: 'Developed family member attribute editing system, supporting modifications to literature, martial, commerce, art, strategy, luck, charm, and talent attributes.'
    }
  ];

  return (
    <>
      <SEOHead 
        title={locale === 'zh' ? '更新日志 - 吾今有世家修改器' : 'Changelog - House of Legacy Editor'}
        description={locale === 'zh' ? '查看吾今有世家修改器的所有功能更新和bug修复记录' : 'View all feature updates and bug fixes for House of Legacy Editor'}
      />
      
      <Container maxW="4xl" py={8} pb={20}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={4}>
              {locale === 'zh' ? '更新日志' : 'Changelog'}
            </Heading>
            <Text color="gray.600" fontSize="lg">
              {locale === 'zh' 
                ? '记录所有功能更新、bug修复和改进' 
                : 'Track all feature updates, bug fixes, and improvements'
              }
            </Text>
          </Box>

          <Divider />

          {/* Timeline */}
          <VStack spacing={6} align="stretch">
            {changelogData.map((item, index) => (
              <TimelineItem
                key={`${item.date}-${index}`}
                date={item.date}
                type={item.type}
                title={item.title}
                description={item.description}
                isLast={index === changelogData.length - 1}
              />
            ))}
          </VStack>

          {/* Footer */}
          {/* <Box textAlign="center" pt={8}>
            <Text color="gray.500" fontSize="sm">
              {locale === 'zh' 
                ? '更多功能正在开发中，敬请期待...' 
                : 'More features are in development, stay tuned...'
              }
            </Text>
          </Box> */}
        </VStack>
      </Container>
    </>
  );
} 