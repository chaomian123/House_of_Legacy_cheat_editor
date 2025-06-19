import { Box, Heading, Text } from '@chakra-ui/react';
import { Input, Button, message } from 'antd';
import { useState, useCallback, useMemo } from 'react';
import { useLocale } from '../../lib/useLocale';
import { updateFoodData } from './dataUtils';

const FoodManager = ({
  food,
  vegetables,
  meat,
  onUpdate,
  data,
  setData
}) => {
  const { locale, t } = useLocale();
  const [isEditing, setIsEditing] = useState(false);
  const [tempFood, setTempFood] = useState('0');
  const [tempVegetables, setTempVegetables] = useState('0');
  const [tempMeat, setTempMeat] = useState('0');

  const handleFoodChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setTempFood(value);
    }
  }, []);

  const handleVegetablesChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setTempVegetables(value);
    }
  }, []);

  const handleMeatChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setTempMeat(value);
    }
  }, []);

  const saveFood = useCallback(() => {
    const rawData = JSON.parse(data.data.toString());
    const updatedRawData = updateFoodData(rawData, tempFood, tempVegetables, tempMeat);
    setData({ ...data, data: Buffer.from(JSON.stringify(updatedRawData)) });
    
    onUpdate(tempFood, tempVegetables, tempMeat);
    setIsEditing(false);
    
    message.success({
      content: t.food.foodSaved,
      duration: 3
    });
  }, [data, setData, tempFood, tempVegetables, tempMeat, onUpdate, locale]);

  const editFood = useCallback(() => {
    setTempFood(food);
    setTempVegetables(vegetables);
    setTempMeat(meat);
    setIsEditing(true);
  }, [food, vegetables, meat]);

  return useMemo(() => (
    <Box p={4} border="1px" borderColor="gray.200" borderRadius="md" flex="1">
      <Heading size="sm" mb={3}>
        {t.food.title}
      </Heading>
      <Box display="flex" gap={4} alignItems="flex-start">
        <Box>
          <Text fontSize="sm" mb={1}>
            {t.food.food}
          </Text>
          <Input
            value={isEditing ? tempFood : food}
            onChange={handleFoodChange}
            placeholder={t.food.enterFood}
            style={{ width: '120px' }}
            disabled={!isEditing}
            type="number"
          />
          <Text fontSize="xs" color="transparent" mt={1}>
            &nbsp;
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" mb={1}>
            {t.food.vegetables}
          </Text>
          <Input
            value={isEditing ? tempVegetables : vegetables}
            onChange={handleVegetablesChange}
            placeholder={t.food.enterVegetables}
            style={{ width: '120px' }}
            disabled={!isEditing}
            type="number"
          />
          <Text fontSize="xs" color="transparent" mt={1}>
            &nbsp;
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" mb={1}>
            {t.food.meat}
          </Text>
          <Input
            value={isEditing ? tempMeat : meat}
            onChange={handleMeatChange}
            placeholder={t.food.enterMeat}
            style={{ width: '120px' }}
            disabled={!isEditing}
            type="number"
          />
          <Text fontSize="xs" color="transparent" mt={1}>
            &nbsp;
          </Text>
        </Box>
        <Box mt="25px">
          {isEditing ? (
            <Button type="primary" onClick={saveFood}>
              {t.food.saveFood}
            </Button>
          ) : (
            <Button onClick={editFood}>
              {t.food.editFood}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  ), [locale, isEditing, tempFood, food, tempVegetables, vegetables, tempMeat, meat, handleFoodChange, handleVegetablesChange, handleMeatChange, saveFood, editFood]);
};

export default FoodManager; 