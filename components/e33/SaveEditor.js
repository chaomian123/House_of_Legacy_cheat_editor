import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Grid,
  GridItem,
  Heading,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Badge,
  Switch,
  Select,
  ButtonGroup,
  useToast,
  InputGroup,
  InputLeftElement,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Center,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  Portal,
  Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaUpload, FaSave, FaSearch, FaUndo, FaCopy, FaEllipsisV, FaExternalLinkAlt } from 'react-icons/fa';
import { useLocale } from '../../lib/useLocale';
import { 
  processFile, 
  extractInventoryItems, 
  updateInventoryItems, 
  findInventoryItem,
  encodeSavFile,
  downloadFile
} from '../../services/wasmService';
import { loadYaml } from '../../utils/yamlLoader';

const MotionBox = motion(Box);

// 角色列表
const CHARACTERS = [
  { id: 'all', name: 'All Characters', color: 'gray' },
  { id: 'gustave', name: 'Gustave', color: 'blue' },
  { id: 'lune', name: 'Lune', color: 'purple' },
  { id: 'maelle', name: 'Maelle', color: 'green' },
  { id: 'monoco', name: 'Monoco', color: 'orange' },
  { id: 'sciel', name: 'Sciel', color: 'cyan' },
  { id: 'verso', name: 'Verso', color: 'red' }
];

// 主分类映射
const MAIN_CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: '' },
  { id: 'Outfits', name: 'Outfits', icon: '' },
  { id: 'Weapons', name: 'Weapons', icon: '' },
  { id: 'Hair', name: 'Hair', icon: '' },
  { id: 'Tints', name: 'Tints', icon: '' }
];

const SaveEditor = () => {
  const { t, locale } = useLocale();
  const [saveData, setSaveData] = useState(null);
  const [yamlData, setYamlData] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [fileName, setFileName] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [gold, setGold] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  // 主题颜色
  const bgColor = useColorModeValue('black', 'black');
  const borderColor = useColorModeValue('#fcd88a', '#fcd88a');
  const textColor = useColorModeValue('#b4b2b0', '#b4b2b0');
  const highlightColor = useColorModeValue('rgba(252, 216, 138, 0.15)', 'rgba(252, 216, 138, 0.15)');
  const buttonColorScheme = 'yellow';
  const accentColor = '#fcd88a';

  // 武器链接组件
  const WeaponLink = ({ weaponName, children }) => {
    const handleWeaponClick = (e) => {
      e.preventDefault();
      const wikiUrl = `https://expedition33.wiki.fextralife.com/${encodeURIComponent(weaponName)}`;
      window.open(wikiUrl, '_blank');
    };
    
    return (
      <Tooltip label="View weapon details on wiki" placement="top" bg="black" color={textColor} borderColor="#fcd88a" borderWidth="1px">
        <Text
          as="span"
          cursor="pointer"
          color="#63B3ED"
          fontWeight="bold"
          onClick={handleWeaponClick}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleWeaponClick(e);
            }
          }}
          role="button"
          aria-label={`View details for ${weaponName}`}
          textDecoration="underline"
          _hover={{ color: "#90CDF4" }}
        >
          {children}
        </Text>
      </Tooltip>
    );
  };

  // 加载YAML数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await loadYaml('ex33_mapping_full.yaml');
        
        // 转换YAML数据为扁平数组格式
        const flattenedItems = [];
        
        // 处理YAML数据结构
        if (data && data.items && Array.isArray(data.items)) {
          data.items.forEach(item => {
            if (!item) return;
            
            // 解析分类和角色信息
            let character = 'unknown';
            let mainCategory = item.category || '';
            
            // 从category字段中提取信息 (例如: "Outfits.Gustave" -> category="Outfits", character="Gustave")
            if (item.category && item.category.includes('.')) {
              const parts = item.category.split('.');
              mainCategory = parts[0] || '';
              character = parts[1] || '';
              
              // 如果是角色名，移除其他部分
              if (character.includes(' ')) {
                character = character.split(' ')[0];
              }
              
              // 转换为小写以匹配我们的角色ID
              character = character.toLowerCase();
            }
            
            flattenedItems.push({
              ...item,
              category: mainCategory,
              character: character,
              name: item.name || `未命名物品_${flattenedItems.length + 1}`,
              save_key: item.save_key || `unknown_key_${flattenedItems.length + 1}`
            });
          });
        }
        
        console.log(`✅ Loaded ${flattenedItems.length} items from YAML`);
        console.log('Sample items:', flattenedItems.slice(0, 3));
        setYamlData(flattenedItems);
      } catch (err) {
        console.error('Error loading YAML data:', err);
        setError('Failed to load item data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const saveData = await processFile(file);
      setSaveData(saveData);
      
      const items = extractInventoryItems(saveData);
      setInventoryItems(items);

      if (saveData?.root?.properties) {
        const goldData = saveData.root.properties['Gold_0'];
        const goldValue = goldData && typeof goldData === 'object' && 'Int' in goldData ? goldData.Int : 0;
        setGold(goldValue);
      }
      
      setFileName(file.name);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'Error processing file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!saveData || !fileName) return;

    try {
      console.log('=== Starting save modifications ===');
      console.log('Current state:', {
        gold,
        inventoryItems
      });

      setIsLoading(true);
      setError(null);

      // 更新物品数据
      const updatedSaveData = updateInventoryItems(saveData, inventoryItems);
      
      // 更新特殊属性
      if (updatedSaveData.root?.properties) {
        console.log('=== Updating special attributes ===');
        
        // 更新金币
        if (updatedSaveData.root.properties['Gold_0']) {
          updatedSaveData.root.properties['Gold_0'].Int = gold;
          console.log('Updated gold:', gold);
        }
      }

      // 编码为 SAV 文件
      const savData = await encodeSavFile(updatedSaveData);
      
      // 下载文件
      downloadFile(savData, fileName, 'application/octet-stream');
      
      console.log('✅ Save successful');
    } catch (err) {
      console.error('Error saving file:', err);
      setError(err instanceof Error ? err.message : 'Error saving file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemChange = (itemName, value) => {
    const numericValue = value ? 1 : 0;
    const updatedItems = [...inventoryItems];
    const index = updatedItems.findIndex(item => item.key?.Name === itemName);
    
    if (index !== -1) {
      updatedItems[index].value.Int = numericValue;
    } else if (numericValue === 1) {
      updatedItems.push({
        key: { Name: itemName },
        value: { Int: 1 }
      });
    }
    
    setInventoryItems(updatedItems);
  };

  const isItemOwned = useCallback((itemName) => {
    if (!inventoryItems || inventoryItems.length === 0) return false;
    
    const item = inventoryItems.find(item => {
      return item.key && item.key.Name === itemName;
    });
    
    return item && item.value && item.value.Int > 0;
  }, [inventoryItems]);

  // 获取颜料物品
  const tintsItems = useMemo(() => {
    if (!yamlData || yamlData.length === 0) return [];
    
    return yamlData.filter(item => item.category === 'Tints');
  }, [yamlData]);
  
  // 获取过滤后的物品（不包括颜料和符文）
  const getFilteredItems = useMemo(() => {
    if (!yamlData || yamlData.length === 0) return [];
    
    return yamlData.filter(item => {
      // 排除颜料类物品和符文类物品
      if (item.category === 'Tints' || item.category === 'Pictos') return false;
      
      // 确保物品有所有必要的属性
      if (!item || !item.category) return false;
      
      // 角色筛选
      if (selectedCharacter !== 'all' && item.character !== selectedCharacter) {
        return false;
      }
      
      // 类别筛选
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      
      // 搜索筛选
      if (searchTerm && item.name && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [yamlData, selectedCharacter, selectedCategory, searchTerm]);

  // 是否显示角色选择器
  const showCharacterSelector = useMemo(() => {
    return true; // 现在颜料单独显示，所以角色选择器始终显示
  }, []);
  
  // 获取物品数量
  const getItemQuantity = useCallback((itemName) => {
    if (!inventoryItems || inventoryItems.length === 0) return 0;
    
    const item = inventoryItems.find(item => {
      return item.key && item.key.Name === itemName;
    });
    
    return item && item.value && item.value.Int ? item.value.Int : 0;
  }, [inventoryItems]);
  
  // 更新物品数量
  const handleItemQuantityChange = useCallback((itemName, value) => {
    const numericValue = parseInt(value, 10) || 0;
    const updatedItems = [...inventoryItems];
    const index = updatedItems.findIndex(item => item.key?.Name === itemName);
    
    if (index !== -1) {
      updatedItems[index].value.Int = numericValue;
    } else if (numericValue > 0) {
      updatedItems.push({
        key: { Name: itemName },
        value: { Int: numericValue }
      });
    }
    
    setInventoryItems(updatedItems);
  }, [inventoryItems]);

  // 批量操作
  const handleBatchOperation = (operation) => {
    const items = getFilteredItems;
    const updatedItems = [...inventoryItems];
    
    items.forEach(item => {
      const value = operation === 'setAll' ? 1 : 0;
      const index = updatedItems.findIndex(i => i.key?.Name === item.save_key);
      
      if (index !== -1) {
        updatedItems[index].value.Int = value;
      } else if (value === 1) {
        updatedItems.push({
          key: { Name: item.save_key },
          value: { Int: 1 }
        });
      }
    });
    
    setInventoryItems(updatedItems);
    toast({
      title: operation === 'setAll' ? 'All items set to owned' : 'All items cleared',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
      variant: 'solid',
      bg: '#fcd88a',
      color: 'black',
    });
  };

  // 调试信息
  useEffect(() => {
    console.log('Item data:', yamlData);
    console.log('Filtered items:', getFilteredItems);
    console.log('Inventory items:', inventoryItems);
    
    // 检查物品拥有状态
    if (yamlData.length > 0 && inventoryItems.length > 0) {
      console.log('Checking item ownership:');
      const sampleItems = yamlData.slice(0, 5);
      sampleItems.forEach(item => {
        const owned = isItemOwned(item.save_key);
        console.log(`${item.name} (${item.save_key}): ${owned ? 'Owned' : 'Not owned'}`);
        
        // 查找存档中的对应物品
        const savedItem = inventoryItems.find(i => i.key?.Name === item.save_key);
        console.log('Corresponding save item:', savedItem);
      });
    }
  }, [yamlData, getFilteredItems, inventoryItems, isItemOwned]);

  useEffect(() => {
    console.log('Tint items:', tintsItems);
    console.log('Filtered items:', getFilteredItems);
    console.log('Inventory items:', inventoryItems);
  }, [tintsItems, getFilteredItems, inventoryItems]);

  return (
    <Box w="full" bg="black" color="#b4b2b0">
      <VStack spacing={6} align="stretch">
        {/* 文件上传区域 */}
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <HStack spacing={4}>
            <Input
              type="file"
              accept=".sav"
              onChange={handleFileUpload}
              display="none"
              id="file-upload"
            />
            <Button
              as="label"
              htmlFor="file-upload"
              leftIcon={<FaUpload />}
              colorScheme={buttonColorScheme}
              isLoading={isLoading}
            >
              {t.expedition33?.uploadSave || 'Upload Save'}
            </Button>
            {fileName && (
              <Text color={textColor}>
                {fileName}
              </Text>
            )}
          </HStack>
        </Box>

        <>
          {/* 金币编辑区域 */}
          <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <VStack spacing={4} align="stretch">
              <Heading size="md" color={accentColor}>
                Gold
              </Heading>
              <Divider borderColor={borderColor} />
              <FormControl>
                <FormLabel color={textColor}>{t.expedition33?.gold || 'Gold'}</FormLabel>
                <NumberInput
                  value={gold}
                  onChange={(_, value) => setGold(value)}
                  min={0}
                  borderColor={borderColor}
                >
                  <NumberInputField bg="black" color={textColor} _hover={{ borderColor: accentColor }} _focus={{ borderColor: accentColor }} />
                  <NumberInputStepper>
                    <NumberIncrementStepper color={accentColor} />
                    <NumberDecrementStepper color={accentColor} />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </VStack>
          </Box>

          {/* 颜料编辑区域 */}
          <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <VStack spacing={4} align="stretch">
              <Heading size="md" color={accentColor}>
                Tints
              </Heading>
              <Divider borderColor={borderColor} />
              
              <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4}} spacing={4}>
                {tintsItems.map((item) => (
                  <FormControl key={item.save_key}>
                    <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>{item.name}</FormLabel>
                    <NumberInput
                      value={getItemQuantity(item.save_key)}
                      onChange={(_, value) => handleItemQuantityChange(item.save_key, value)}
                      min={0}
                      max={999}
                      size="sm"
                      borderColor={borderColor}
                    >
                      <NumberInputField bg="black" color={textColor} _hover={{ borderColor: accentColor }} _focus={{ borderColor: accentColor }} />
                      <NumberInputStepper>
                        <NumberIncrementStepper color={accentColor} />
                        <NumberDecrementStepper color={accentColor} />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>

          {/* 物品编辑区域 */}
          <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between" wrap="wrap" spacing={4}>
                <Heading size="lg" color={accentColor}>
                  {t.expedition33?.items || 'Item List'}
                </Heading>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FaEllipsisV />}
                    colorScheme={buttonColorScheme}
                    variant="outline"
                  >
                    Batch Operations
                  </MenuButton>
                  <MenuList bg="black" borderColor={borderColor}>
                    <MenuItem onClick={() => handleBatchOperation('setAll')} bg="black" color={textColor} _hover={{ bg: highlightColor }}>
                      Set All to Owned
                    </MenuItem>
                    <MenuItem onClick={() => handleBatchOperation('clearAll')} bg="black" color={textColor} _hover={{ bg: highlightColor }}>
                      Clear All
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>

              {/* 筛选控制区 */}
              <Grid templateColumns={{base: "1fr", md: "repeat(3, 1fr)"}} gap={4}>
                <GridItem>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color={accentColor}>
                      <FaSearch />
                    </InputLeftElement>
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      bg="black"
                      color={textColor}
                      borderColor={borderColor}
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor }}
                    />
                  </InputGroup>
                </GridItem>

                <GridItem>
                  <Select 
                    // placeholder="Select Category" 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    bg="black"
                    color={textColor}
                    borderColor={borderColor}
                    _hover={{ borderColor: accentColor }}
                    _focus={{ borderColor: accentColor }}
                    sx={{
                      option: {
                        bg: "black !important",
                        color: "#b4b2b0",
                        _hover: {
                          bg: "rgba(252, 216, 138, 0.15) !important"
                        },
                        _checked: {
                          bg: "rgba(252, 216, 138, 0.3) !important"
                        }
                      }
                    }}
                  >
                    {MAIN_CATEGORIES.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </Select>
                </GridItem>

                {showCharacterSelector && (
                  <GridItem>
                    <Select
                      // placeholder="Select Character"
                      value={selectedCharacter}
                      onChange={(e) => setSelectedCharacter(e.target.value)}
                      bg="black"
                      color={textColor}
                      borderColor={borderColor}
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor }}
                      sx={{
                        option: {
                          bg: "black !important",
                          color: "#b4b2b0",
                          _hover: {
                            bg: "rgba(252, 216, 138, 0.15) !important"
                          },
                          _checked: {
                            bg: "rgba(252, 216, 138, 0.3) !important"
                          }
                        }
                      }}
                    >
                      {CHARACTERS.map(character => (
                        <option key={character.id} value={character.id}>
                          {character.name}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                )}
              </Grid>

              {/* 物品列表展示 */}
              <Box maxH="500px" overflowY="auto" mt={4}>
                {isLoading ? (
                  <Center p={10}>
                    <Spinner size="xl" color={accentColor} />
                  </Center>
                ) : getFilteredItems && getFilteredItems.length > 0 ? (
                  <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4}} spacing={4}>
                    {getFilteredItems.map((item) => {
                      // 是否为武器
                      const isWeapon = item.category === 'Weapons';
                      
                      // 武器名称（用于tooltip URL）
                      const weaponName = item.name.split(' (')[0]; // 移除括号中的角色名
                      
                      const cardContent = (
                        <Card 
                          key={item.save_key} 
                          bg={isItemOwned(item.save_key) ? highlightColor : 'black'}
                          borderColor={isItemOwned(item.save_key) ? accentColor : borderColor}
                          borderWidth="1px"
                          size="sm"
                          transition="all 0.2s"
                          _hover={{
                            shadow: 'md',
                            transform: 'translateY(-2px)',
                            borderColor: isWeapon ? accentColor : borderColor
                          }}
                          position="relative"
                        >
                          <CardBody>
                            <FormControl>
                              <Flex direction="column" gap={2}>
                                <Flex justify="space-between" align="center">
                                  {isWeapon ? (
                                    <WeaponLink weaponName={weaponName}>
                                      {item.name}
                                    </WeaponLink>
                                  ) : (
                                    <Text fontWeight="bold" fontSize="md" noOfLines={1} title={item.name} color={textColor}>
                                      {item.name}
                                    </Text>
                                  )}
                                  <Switch
                                    isChecked={isItemOwned(item.save_key)}
                                    onChange={(e) => handleItemChange(item.save_key, e.target.checked)}
                                    colorScheme={buttonColorScheme}
                                    size="md"
                                  />
                                </Flex>
                                
                                <Flex wrap="wrap" gap={2} mt={1}>
                                  {item.character && (
                                    <Badge 
                                      colorScheme={
                                        item.character === 'gustave' ? 'blue' :
                                        item.character === 'lune' ? 'purple' : 
                                        item.character === 'maelle' ? 'green' :
                                        item.character === 'monoco' ? 'orange' :
                                        item.character === 'sciel' ? 'cyan' :
                                        item.character === 'verso' ? 'red' : 'gray'
                                      }
                                      borderRadius="full"
                                      px={2}
                                      display="flex"
                                      alignItems="center"
                                      bg={
                                        item.character === 'gustave' ? 'rgba(66, 153, 225, 0.15)' :
                                        item.character === 'lune' ? 'rgba(159, 122, 234, 0.15)' : 
                                        item.character === 'maelle' ? 'rgba(72, 187, 120, 0.15)' :
                                        item.character === 'monoco' ? 'rgba(237, 137, 54, 0.15)' :
                                        item.character === 'sciel' ? 'rgba(76, 206, 225, 0.15)' :
                                        item.character === 'verso' ? 'rgba(229, 62, 62, 0.15)' : 'rgba(160, 174, 192, 0.15)'
                                      }
                                      color={
                                        item.character === 'gustave' ? '#63B3ED' :
                                        item.character === 'lune' ? '#B794F4' : 
                                        item.character === 'maelle' ? '#68D391' :
                                        item.character === 'monoco' ? '#F6AD55' :
                                        item.character === 'sciel' ? '#76E4F7' :
                                        item.character === 'verso' ? '#FC8181' : '#CBD5E0'
                                      }
                                      borderWidth="1px"
                                      borderColor={
                                        item.character === 'gustave' ? '#4299E1' :
                                        item.character === 'lune' ? '#9F7AEA' : 
                                        item.character === 'maelle' ? '#48BB78' :
                                        item.character === 'monoco' ? '#ED8936' :
                                        item.character === 'sciel' ? '#4CDCE1' :
                                        item.character === 'verso' ? '#E53E3E' : '#A0AEC0'
                                      }
                                    >
                                      <Box as="span" w="2" h="2" borderRadius="full" 
                                        bg={
                                          item.character === 'gustave' ? '#4299E1' :
                                          item.character === 'lune' ? '#9F7AEA' : 
                                          item.character === 'maelle' ? '#48BB78' :
                                          item.character === 'monoco' ? '#ED8936' :
                                          item.character === 'sciel' ? '#4CDCE1' :
                                          item.character === 'verso' ? '#E53E3E' : '#A0AEC0'
                                        }
                                        mr={1} 
                                      />
                                      {item.character.charAt(0).toUpperCase() + item.character.slice(1)}
                                    </Badge>
                                  )}
                                  
                                  {item.category && (
                                    <Badge 
                                      colorScheme={
                                        item.category === 'Outfits' ? 'pink' :
                                        item.category === 'Weapons' ? 'red' :
                                        item.category === 'Hair' ? 'yellow' :
                                        item.category === 'Tints' ? 'teal' : 'gray'
                                      }
                                      borderRadius="full"
                                      px={2}
                                      display="flex"
                                      alignItems="center"
                                      bg={
                                        item.category === 'Outfits' ? 'rgba(237, 100, 166, 0.15)' :
                                        item.category === 'Weapons' ? 'rgba(229, 62, 62, 0.15)' :
                                        item.category === 'Hair' ? 'rgba(236, 201, 75, 0.15)' :
                                        item.category === 'Tints' ? 'rgba(56, 178, 172, 0.15)' : 'rgba(160, 174, 192, 0.15)'
                                      }
                                      color={
                                        item.category === 'Outfits' ? '#F687B3' :
                                        item.category === 'Weapons' ? '#FC8181' :
                                        item.category === 'Hair' ? '#F6E05E' :
                                        item.category === 'Tints' ? '#4FD1C5' : '#CBD5E0'
                                      }
                                      borderWidth="1px"
                                      borderColor={
                                        item.category === 'Outfits' ? '#ED64A6' :
                                        item.category === 'Weapons' ? '#E53E3E' :
                                        item.category === 'Hair' ? '#ECC94B' :
                                        item.category === 'Tints' ? '#38B2AC' : '#A0AEC0'
                                      }
                                    >
                                      {item.category === 'Outfits' && ''}
                                      {item.category === 'Weapons' && ''}
                                      {item.category === 'Hair' && ''}
                                      {item.category === 'Tints' && ''}
                                      {item.category}
                                    </Badge>
                                  )}
                                  
                                  {item.shared && (
                                    <Badge 
                                      colorScheme="orange" 
                                      borderRadius="full" 
                                      px={2}
                                      bg="rgba(237, 137, 54, 0.15)"
                                      color="#F6AD55"
                                      borderWidth="1px"
                                      borderColor="#ED8936"
                                    >
                                      Shared
                                    </Badge>
                                  )}
                                </Flex>
                              </Flex>
                            </FormControl>
                          </CardBody>
                        </Card>
                      );
                      
                      // 如果是武器，添加tooltip
                      return (
                        <React.Fragment key={item.save_key}>
                          {cardContent}
                        </React.Fragment>
                      );
                    })}
                  </SimpleGrid>
                ) : (
                  <Center p={10}>
                    <Text color={textColor}>No items found matching your criteria</Text>
                  </Center>
                )}
              </Box>
            </VStack>
          </Box>

          {/* 保存按钮 */}
          <Button
            colorScheme={buttonColorScheme}
            size="lg"
            onClick={handleSave}
            isLoading={isLoading}
            leftIcon={<FaSave />}
            isDisabled={!saveData}
          >
            {t.expedition33?.saveChanges || 'Save Changes'}
          </Button>
        </>

        {error && (
          <Alert status="error" bg="black" borderWidth="1px" borderColor="red.500">
            <AlertIcon />
            <AlertTitle color={textColor}>{t.expedition33?.error || 'Error'}</AlertTitle>
            <AlertDescription color={textColor}>{error}</AlertDescription>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default SaveEditor; 