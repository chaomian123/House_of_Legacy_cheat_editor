// 成员类型常量
export const MEMBER_TYPES = {
  FAMILY: 'Member_now',
  SPOUSE: 'Member_qu', 
  GUEST: 'MenKe_Now'
};

// 天赋映射
export const getTalentMap = (locale) => locale === 'zh' ? {
  '1': '文',
  '2': '武', 
  '3': '商',
  '4': '艺',
  '0': '无'
} : {
  '1': 'Literature',
  '2': 'Martial', 
  '3': 'Commerce',
  '4': 'Art',
  '0': 'None'
};

// 技能映射
export const getSkillMap = (locale) => locale === 'zh' ? {
  '0': '无',
  '2': '医'
} : {
  '0': 'None',
  '2': 'Medical'
};

// 天赋选项
export const getTalentOptions = (locale) => locale === 'zh' ? [
  { key: '1', value: '文', label: '文' },
  { key: '2', value: '武', label: '武' },
  { key: '3', value: '商', label: '商' },
  { key: '4', value: '艺', label: '艺' }
] : [
  { key: '1', value: 'Literature', label: 'Literature' },
  { key: '2', value: 'Martial', label: 'Martial' },
  { key: '3', value: 'Commerce', label: 'Commerce' },
  { key: '4', value: 'Art', label: 'Art' }
];

// 技能选项
export const getSkillOptions = (locale) => locale === 'zh' ? [
  { key: '0', label: '无' },
  { key: '2', label: '医' }
] : [
  { key: '0', label: 'None' },
  { key: '2', label: 'Medical' }
];

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
    info: 4
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