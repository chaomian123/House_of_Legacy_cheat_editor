// 成员类型常量
export const MEMBER_TYPES = {
  FAMILY: 'Member_now',
  SPOUSE: 'Member_qu', 
  GUEST: 'MenKe_Now'
};

// 天赋映射
export const getTalentMap = (locale) => {
  if (locale === 'zh') {
    return {
      '0': '无',
      '1': '文',
      '2': '武',
      '3': '商',
      '4': '艺'
    };
  } else if (locale === 'th') {
    return {
      '0': 'ไม่มี',
      '1': 'วรรณกรรม',
      '2': 'การต่อสู้',
      '3': 'การค้า',
      '4': 'ศิลปะ'
    };
  } else {
    return {
      '0': 'None',
      '1': 'Literature',
      '2': 'Martial',
      '3': 'Commerce',
      '4': 'Art'
    };
  }
};

// 技能映射
export const getSkillMap = (locale) => {
  if (locale === 'zh') {
    return {
      '0': '无',
      '1': '巫',
      '2': '医',
      '3': '相',
      '4': '卜',
      '5': '魅',
      '6': '工'
    };
  } else if (locale === 'th') {
    return {
      '0': 'ไม่มี',
      '1': 'แม่มด',
      '2': 'การแพทย์',
      '3': 'โชคลาภ',
      '4': 'การทำนาย',
      '5': 'เสน่ห์',
      '6': 'งานฝีมือ'
    };
  } else {
    return {
      '0': 'None',
      '1': 'Witch',
      '2': 'Medical',
      '3': 'Fortune',
      '4': 'Divination',
      '5': 'Charm',
      '6': 'Craft'
    };
  }
};

// 天赋选项
export const getTalentOptions = (locale) => {
  if (locale === 'zh') {
    return [
      { key: '0', value: '无', label: '无' },
      { key: '1', value: '文', label: '文' },
      { key: '2', value: '武', label: '武' },
      { key: '3', value: '商', label: '商' },
      { key: '4', value: '艺', label: '艺' }
    ];
  } else if (locale === 'th') {
    return [
      { key: '0', value: 'ไม่มี', label: 'ไม่มี' },
      { key: '1', value: 'วรรณกรรม', label: 'วรรณกรรม' },
      { key: '2', value: 'การต่อสู้', label: 'การต่อสู้' },
      { key: '3', value: 'การค้า', label: 'การค้า' },
      { key: '4', value: 'ศิลปะ', label: 'ศิลปะ' }
    ];
  } else {
    return [
      { key: '0', value: 'None', label: 'None' },
      { key: '1', value: 'Literature', label: 'Literature' },
      { key: '2', value: 'Martial', label: 'Martial' },
      { key: '3', value: 'Commerce', label: 'Commerce' },
      { key: '4', value: 'Art', label: 'Art' }
    ];
  }
};

// 技能选项
export const getSkillOptions = (locale) => {
  if (locale === 'zh') {
    return [
      { key: '0', label: '无' },
      { key: '1', label: '巫' },
      { key: '2', label: '医' },
      { key: '3', label: '相' },
      { key: '4', label: '卜' },
      { key: '5', label: '魅' },
      { key: '6', label: '工' }
    ];
  } else if (locale === 'th') {
    return [
      { key: '0', label: 'ไม่มี' },
      { key: '1', label: 'แม่มด' },
      { key: '2', label: 'การแพทย์' },
      { key: '3', label: 'โชคลาภ' },
      { key: '4', label: 'การทำนาย' },
      { key: '5', label: 'เสน่ห์' },
      { key: '6', label: 'งานฝีมือ' }
    ];
  } else {
    return [
      { key: '0', label: 'None' },
      { key: '1', label: 'Witch' },
      { key: '2', label: 'Medical' },
      { key: '3', label: 'Fortune' },
      { key: '4', label: 'Divination' },
      { key: '5', label: 'Charm' },
      { key: '6', label: 'Craft' }
    ];
  }
};

// 粮草类型ID
export const FOOD_TYPE_IDS = {
  FOOD: '2',
  VEGETABLES: '3', 
  MEAT: '4'
};

// 数据字段索引映射
export const FIELD_INDICES = {
  [MEMBER_TYPES.FAMILY]: {
    id: 0,
    age: 6,
    wen: 7,
    wu: 8,
    shang: 9,
    yi: 10,
    reputation: 16,
    beauty: 20,
    health: 21,
    mou: 27,
    skill_num: 33,
    info: 4,
    punishmentStatus: 15
  },
  [MEMBER_TYPES.SPOUSE]: {
    id: 0,
    info: 2,
    age: 5,
    wen: 6,
    wu: 7,
    shang: 8,
    yi: 9,
    reputation: 12,
    beauty: 15,
    health: 16,
    mou: 19,
    skill_num: 23
  },
  [MEMBER_TYPES.GUEST]: {
    id: 0,
    info: 2,
    age: 3,
    wen: 4,
    wu: 5,
    shang: 6,
    yi: 7,
    reputation: 11,
    mou: 15,
    payment: 18
  }
}; 