import { Box, Heading, Text } from '@chakra-ui/react';
import { Input, Button, message } from 'antd';
import { useState, useCallback, useMemo } from 'react';
import { useLocale } from '../../lib/useLocale';
import { updateCurrencyData } from './dataUtils';

const CurrencyManager = ({ 
  money, 
  yuanbao, 
  onUpdate, 
  data, 
  setData 
}) => {
  const { locale } = useLocale();
  const [isEditing, setIsEditing] = useState(false);
  const [tempMoney, setTempMoney] = useState('');
  const [tempYuanbao, setTempYuanbao] = useState('');

  const handleMoneyChange = useCallback((e) => {
    setTempMoney(e.target.value);
  }, []);

  const handleYuanbaoChange = useCallback((e) => {
    const value = e.target.value;
    // 限制元宝最大值为100000000
    if (value === '' || (Number(value) >= 0 && Number(value) <= 100000000)) {
      setTempYuanbao(value);
    }
  }, []);

  const saveCurrency = useCallback(() => {
    const rawData = JSON.parse(data.data.toString());
    const updatedRawData = updateCurrencyData(rawData, tempMoney, tempYuanbao);
    setData({ ...data, data: Buffer.from(JSON.stringify(updatedRawData)) });
    
    onUpdate(tempMoney, tempYuanbao);
    setIsEditing(false);
    
    message.success({
      content: locale === 'zh' ? '货币已保存，不要忘记保存到存档文件！' : 'Currency saved, don\'t forget to save to file!',
      duration: 3
    });
  }, [data, setData, tempMoney, tempYuanbao, onUpdate, locale]);

  const editCurrency = useCallback(() => {
    setTempMoney(money);
    setTempYuanbao(yuanbao);
    setIsEditing(true);
  }, [money, yuanbao]);

  return useMemo(() => (
    <Box p={4} border="1px" borderColor="gray.200" borderRadius="md" flex="1">
      <Heading size="sm" mb={3}>
        {locale === 'zh' ? '货币管理' : 'Currency Management'}
      </Heading>
      <Box display="flex" gap={4} alignItems="flex-start">
        <Box>
          <Text fontSize="sm" mb={1}>
            {locale === 'zh' ? '金钱' : 'Money'}
          </Text>
          <Input
            value={isEditing ? tempMoney : money}
            onChange={handleMoneyChange}
            placeholder={locale === 'zh' ? '输入金钱数量' : 'Enter money amount'}
            style={{ width: '150px' }}
            disabled={!isEditing}
          />
          <Text fontSize="xs" color="transparent" mt={1}>
            &nbsp;
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" mb={1}>
            {locale === 'zh' ? '元宝' : 'Yuanbao'}
          </Text>
          <Input
            value={isEditing ? tempYuanbao : yuanbao}
            onChange={handleYuanbaoChange}
            placeholder={locale === 'zh' ? '输入元宝数量(最大100000000)' : 'Enter yuanbao amount(max 100000000)'}
            style={{ width: '150px' }}
            disabled={!isEditing}
            max={100000000}
            type="number"
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            {locale === 'zh' ? '最多一亿' : 'Max 100 million'}
          </Text>
        </Box>
        <Box mt="25px">
          {isEditing ? (
            <Button type="primary" onClick={saveCurrency}>
              {locale === 'zh' ? '保存货币' : 'Save Currency'}
            </Button>
          ) : (
            <Button onClick={editCurrency}>
              {locale === 'zh' ? '编辑货币' : 'Edit Currency'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  ), [locale, isEditing, tempMoney, money, tempYuanbao, yuanbao, handleMoneyChange, handleYuanbaoChange, saveCurrency, editCurrency]);
};

export default CurrencyManager; 