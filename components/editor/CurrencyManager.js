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
  const { locale, t } = useLocale();
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
      content: t.currency.currencySaved,
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
        {t.currency.title}
      </Heading>
      <Box display="flex" gap={4} alignItems="flex-start">
        <Box>
          <Text fontSize="sm" mb={1}>
            {t.currency.money}
          </Text>
          <Input
            value={isEditing ? tempMoney : money}
            onChange={handleMoneyChange}
            placeholder={t.currency.enterMoney}
            style={{ width: '150px' }}
            disabled={!isEditing}
          />
          <Text fontSize="xs" color="transparent" mt={1}>
            &nbsp;
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" mb={1}>
            {t.currency.yuanbao}
          </Text>
          <Input
            value={isEditing ? tempYuanbao : yuanbao}
            onChange={handleYuanbaoChange}
            placeholder={t.currency.enterYuanbao}
            style={{ width: '150px' }}
            disabled={!isEditing}
            max={100000000}
            type="number"
          />
          <Text fontSize="xs" color="gray.500" mt={1}>
            {t.currency.maxAmount}
          </Text>
        </Box>
        <Box mt="25px">
          {isEditing ? (
            <Button type="primary" onClick={saveCurrency}>
              {t.currency.saveCurrency}
            </Button>
          ) : (
            <Button onClick={editCurrency}>
              {t.currency.editCurrency}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  ), [locale, isEditing, tempMoney, money, tempYuanbao, yuanbao, handleMoneyChange, handleYuanbaoChange, saveCurrency, editCurrency]);
};

export default CurrencyManager; 