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

  const updates = locale === 'zh' ? [
    {
      date: '2025-06-06',
      type: 'fix',
      title: '修复表格显示问题',
      description: '修复家族成员较少时，表格上天赋技能选择框被遮挡的问题。通过设置表格最小高度和移除滚动限制，确保界面元素正常显示。新增用户使用指南页面，提供详细的修改器使用教程。',
    },
    {
      date: '2025-06-03',
      type: 'feature',
      title: '解除刑罚功能',
      description: '新增解除刑罚功能，支持对处于异常状态的角色进行刑罚解除。异常状态包括：被贬、徒刑、4种流放、斩首，共计7种状态。当角色处于这些异常状态时，会在操作列显示"解除刑罚"按钮。同时，全体属性一键升满时会自动对处于异常状态的角色解除刑罚。',
    },
    {
      date: '2025-06-02',
      type: 'enhancement',
      title: '优化首屏渲染性能',
      description: '优化首屏渲染性能',
    },
    {
      date: '2025-06-01',
      type: 'enhancement',
      title: '扩展技能系统',
      description: '技能选项从2个扩展到7个，支持编辑：无、巫、医、相、卜、魅、工',
    },
    {
      date: '2025-05-31',
      type: 'enhancement',
      title: '提示信息优化',
      description: '1. 批量升满属性时，提示成员中如果有流放的人员，会有坏档风险，请单独操作；2. 保存存档时，提示保存到存档路径覆盖存档。',
    },
    {
      date: '2025-05-31',
      type: 'feature',
      title: '健康值管理功能',
      description: '新增健康值编辑功能，支持修改家族成员和嫁娶成员的健康值。',
    },
    {
      date: '2025-05-31',
      type: 'feature',
      title: '粮草管理功能',
      description: '新增粮草管理功能，支持修改粮食、蔬菜、肉类数量。位于货币管理功能右侧，提供独立的编辑和保存操作。',
    },
    {
      date: '2025-05-30',
      type: 'feature',
      title: '一键升满全部成员声誉功能',
      description: '新增一键升满声誉按钮，可快速将家族成员、嫁娶成员或门客的声誉统一设置为100。按钮位于各表格标题区域，放置在一键18岁按钮左侧。',
    },
    {
      date: '2025-05-30',
      type: 'feature',
      title: '成员门客声誉编辑功能',
      description: '为家族成员、嫁娶成员、门客添加声誉属性列，支持单独编辑每个成员的声誉值，提供更精细的角色属性控制。',
    },
    {
      date: '2025-05-30',
      type: 'feature',
      title: '一键18岁功能',
      description: '新增一键18岁按钮，可快速将家族成员、嫁娶成员或门客的年龄统一设置为18岁，方便玩家快速调整角色年龄'
    },
    {
      date: '2025-05-29',
      type: 'feature',
      title: '升满属性功能',
      description: '新增个人和批量升满属性功能：为每个成员添加独立的"升满属性"按钮，可提升单个成员属性至满值；在列表标题旁添加"升满全属性"按钮，可一键将列表中所有成员属性升至满值'
    },
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
      date: '2025-06-06',
      type: 'fix',
      title: 'Fixed Table Display Issue',
      description: 'Fixed the issue where talent and skill selection dropdowns were blocked when there were fewer family members. Implemented table minimum height and removed scroll restrictions to ensure proper UI element display. Added comprehensive user guide page with detailed save editor tutorial.',
    },
    {
      date: '2025-06-03',
      type: 'feature',
      title: 'Punishment Removal Feature',
      description: 'Added punishment removal functionality to lift penalties from characters in abnormal states. Abnormal states include: demotion, imprisonment, 4 types of exile, and execution - totaling 7 states. When characters are in these abnormal states, a "Remove Punishment" button will appear in the actions column. Additionally, the batch max attributes feature will automatically remove punishments from characters in abnormal states.',
    },
    {
      date: '2025-06-02',
      type: 'enhancement',
      title: 'Optimized First Screen Rendering Performance',
      description: 'Improved initial page load and rendering performance',
    },
    {
      date: '2025-06-01',
      type: 'enhancement',
      title: 'Extended Skill System',
      description: 'Skill options expanded from 2 to 7, supporting editing: None, Witch, Medical, Fortune, Divination, Charm, Craft',
    },
    {
      date: '2025-05-31',
      type: 'enhancement',
      title: 'UI/UX Improvements',
      description: '1. Added warning message when batch max attributes operation encounters exiled members to prevent save corruption, recommend individual operation; 2. Added save path reminder when saving to overwrite original save file.',
    },
    {
      date: '2025-05-31',
      type: 'feature',
      title: 'Health Management Feature',
      description: 'Added health editing functionality to modify health values for family members and spouses, providing complete attribute management experience.',
    },
    {
      date: '2025-05-31',
      type: 'feature',
      title: 'Food Management Feature',
      description: 'Added food management functionality to modify quantities of food, vegetables, and meat. Located to the right of currency management, provides independent editing and saving operations.',
    },
    {
      date: '2025-05-30',
      type: 'feature',
      title: 'Max All Members Reputation Feature',
      description: 'Added "Max All Reputation" button to quickly set the reputation of all family members, spouses, or guests to 100. Button located in table header areas, positioned to the left of "Set All Age 18" button.',
    },
    {
      date: '2025-05-30',
      type: 'feature',
      title: 'Member and Guest Reputation Editing',
      description: 'Added reputation attribute column for family members, spouses, and guests, supporting individual editing of each member\'s reputation value for more granular character attribute control.',
    },
    {
      date: '2025-05-30',
      type: 'feature',
      title: 'Set All Age 18 Feature',
      description: 'Added "Set All Age 18" button to quickly set the age of all family members, spouses, or guests to 18 years old, making it convenient for players to quickly adjust character ages'
    },
    {
      date: '2025-05-29',
      type: 'feature',
      title: 'Max Attributes Feature',
      description: 'Added individual and batch max attributes functionality: Added independent "Max Attributes" button for each member to boost individual member attributes to maximum; Added "Max All Attributes" button next to list titles for one-click attribute maximization of all members in the list'
    },
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
            {updates.map((item, index) => (
              <TimelineItem
                key={`${item.date}-${index}`}
                date={item.date}
                type={item.type}
                title={item.title}
                description={item.description}
                isLast={index === updates.length - 1}
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