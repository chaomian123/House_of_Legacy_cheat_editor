import { MEMBER_TYPES, FIELD_INDICES, FOOD_TYPE_IDS } from './constants';

// 解析成员数据
export const parseMemberData = (rawData, memberType) => {
  const memberData = rawData?.[memberType]?.value || [];
  const indices = FIELD_INDICES[memberType];
  
  return memberData.map(fields => {
    if (!fields || fields.length === 0) {
      return null;
    }
    
    const member = {
      id: fields[indices.id],
      age: fields[indices.age],
      wen: fields[indices.wen],
      wu: fields[indices.wu],
      shang: fields[indices.shang],
      yi: fields[indices.yi],
      mou: fields[indices.mou],
      reputation: fields[indices.reputation]
    };

    // 解析info字符串（家族成员和嫁娶成员有info）
    if (memberType === MEMBER_TYPES.GUEST) {
      // 门客数据结构不同
      member.name = fields[2].split('|')[0];
      member.payment = fields[indices.payment] || '0';
    } else if (indices.info !== undefined) {
      const info = fields[indices.info].split('|');
      member.name = info[0];
      member.talent = info[2];
      member.talent_num = info[3];
      member.skill = info[6] || '0';
      member.lucky = info[7];
      
      if (memberType === MEMBER_TYPES.FAMILY) {
        member.gender = info[4];
        member.beauty = fields[indices.beauty];
        member.health = fields[indices.health];
        member.skill_num = fields[indices.skill_num] || '0';
      } else if (memberType === MEMBER_TYPES.SPOUSE) {
        member.gender = info[4];
        member.beauty = fields[indices.beauty];
        member.health = fields[indices.health];
        member.skill_num = fields[indices.skill_num];
      }
    }

    return member;
  });
};

// 更新成员数据到原始数据
export const updateMemberInRawData = (rawData, memberType, memberId, updatedData) => {
  const memberIndex = rawData[memberType].value.findIndex(member => member[0] === memberId);
  if (memberIndex === -1) return rawData;

  const indices = FIELD_INDICES[memberType];
  const member = rawData[memberType].value[memberIndex];

  // 更新基础属性
  member[indices.age] = updatedData.age;
  member[indices.wen] = updatedData.wen;
  member[indices.wu] = updatedData.wu;
  member[indices.shang] = updatedData.shang;
  member[indices.yi] = updatedData.yi;
  member[indices.mou] = updatedData.mou;
  member[indices.reputation] = updatedData.reputation;

  if (memberType === MEMBER_TYPES.GUEST) {
    // 门客特殊处理
    member[indices.payment] = updatedData.payment;
  } else {
    // 家族成员和嫁娶成员处理info字符串
    const info = member[indices.info].split('|');
    info[2] = updatedData.talent;
    info[3] = updatedData.talent_num;
    info[6] = updatedData.skill || '0';
    info[7] = updatedData.lucky;
    member[indices.info] = info.join('|');

    if (memberType === MEMBER_TYPES.FAMILY) {
      member[indices.beauty] = updatedData.beauty;
      member[indices.health] = updatedData.health;
      member[indices.skill_num] = updatedData.skill_num;
      
      // 如果是族长，同时更新Member_First中的年龄
      const zuzhangInfo = rawData['Member_First']?.value?.[0];
      if (zuzhangInfo && zuzhangInfo[0] === memberId) {
        rawData['Member_First'].value[0][6] = updatedData.age;
      }
    } else if (memberType === MEMBER_TYPES.SPOUSE) {
      member[indices.beauty] = updatedData.beauty;
      member[indices.health] = updatedData.health;
      member[indices.skill_num] = updatedData.skill_num;
    }
  }

  return rawData;
};

// 批量升满属性
export const maxAllMemberAttributes = (rawData, memberType) => {
  const indices = FIELD_INDICES[memberType];
  
  rawData[memberType].value.forEach((member, index) => {
    // 设置基础属性为100
    member[indices.wen] = '100';
    member[indices.wu] = '100';
    member[indices.shang] = '100';
    member[indices.yi] = '100';
    member[indices.mou] = '100';

    if (memberType !== MEMBER_TYPES.GUEST) {
      // 家族成员和嫁娶成员额外处理
      member[indices.beauty] = '100';
      
      // 更新info字符串中的属性
      const info = member[indices.info].split('|');
      info[3] = '100'; // talent_num
      info[7] = '100'; // lucky
      member[indices.info] = info.join('|');

      if (memberType === MEMBER_TYPES.FAMILY) {
        member[indices.health] = '100';
      } else if (memberType === MEMBER_TYPES.SPOUSE) {
        member[indices.health] = '100';
      }
    }
  });

  return rawData;
};

// 批量设置年龄为18
export const setAllMemberAge18 = (rawData, memberType) => {
  const indices = FIELD_INDICES[memberType];
  
  rawData[memberType].value.forEach((member, index) => {
    member[indices.age] = '18';
    
    // 如果是家族成员，检查是否为族长并同时更新Member_First
    if (memberType === MEMBER_TYPES.FAMILY) {
      const zuzhangInfo = rawData['Member_First']?.value?.[0];
      if (zuzhangInfo && zuzhangInfo[0] === member[0]) {
        rawData['Member_First'].value[0][6] = '18';
      }
    }
  });

  return rawData;
};

// 批量升满声誉
export const maxAllMemberReputation = (rawData, memberType) => {
  const indices = FIELD_INDICES[memberType];
  
  rawData[memberType].value.forEach((member, index) => {
    member[indices.reputation] = '100';
  });

  return rawData;
};

// 设置成员怀孕
export const setMemberPregnant = (rawData, memberType, memberId) => {
  const memberIndex = rawData[memberType].value.findIndex(member => member[0] === memberId);
  if (memberIndex === -1) return rawData;

  if (memberType === MEMBER_TYPES.SPOUSE) {
    rawData[memberType].value[memberIndex][18] = '1';
  } else if (memberType === MEMBER_TYPES.FAMILY) {
    rawData[memberType].value[memberIndex][25] = '1';
  }

  return rawData;
};

// 获取货币数据
export const getCurrencyData = (rawData) => {
  const cgNum = rawData?.CGNum?.value || [];
  return {
    money: cgNum[0] || '0',
    yuanbao: cgNum[1] || '0'
  };
};

// 更新货币数据
export const updateCurrencyData = (rawData, money, yuanbao) => {
  if (!rawData.CGNum) {
    rawData.CGNum = { value: ['0', '0'] };
  }
  rawData.CGNum.value[0] = money;
  rawData.CGNum.value[1] = yuanbao;
  return rawData;
};

// 获取粮草数据
export const getFoodData = (rawData) => {
  const propHave = rawData?.Prop_have?.value || [];
  const foodItem = propHave.find(item => item[0] === FOOD_TYPE_IDS.FOOD);
  const vegetablesItem = propHave.find(item => item[0] === FOOD_TYPE_IDS.VEGETABLES);
  const meatItem = propHave.find(item => item[0] === FOOD_TYPE_IDS.MEAT);
  
  return {
    food: foodItem ? foodItem[1] : '0',
    vegetables: vegetablesItem ? vegetablesItem[1] : '0',
    meat: meatItem ? meatItem[1] : '0'
  };
};

// 更新粮草数据
export const updateFoodData = (rawData, food, vegetables, meat) => {
  if (!rawData.Prop_have) {
    rawData.Prop_have = { value: [] };
  }
  
  // 更新或插入粮食数据
  const foodIndex = rawData.Prop_have.value.findIndex(item => item[0] === FOOD_TYPE_IDS.FOOD);
  if (foodIndex > -1) {
    rawData.Prop_have.value[foodIndex][1] = food;
  } else {
    rawData.Prop_have.value.push([FOOD_TYPE_IDS.FOOD, food]);
  }
  
  // 更新或插入蔬菜数据
  const vegetablesIndex = rawData.Prop_have.value.findIndex(item => item[0] === FOOD_TYPE_IDS.VEGETABLES);
  if (vegetablesIndex > -1) {
    rawData.Prop_have.value[vegetablesIndex][1] = vegetables;
  } else {
    rawData.Prop_have.value.push([FOOD_TYPE_IDS.VEGETABLES, vegetables]);
  }
  
  // 更新或插入肉类数据
  const meatIndex = rawData.Prop_have.value.findIndex(item => item[0] === FOOD_TYPE_IDS.MEAT);
  if (meatIndex > -1) {
    rawData.Prop_have.value[meatIndex][1] = meat;
  } else {
    rawData.Prop_have.value.push([FOOD_TYPE_IDS.MEAT, meat]);
  }
  
  return rawData;
}; 