import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Collapse
} from '@chakra-ui/react';
import { Table, Input, Form, Button, Radio, message } from 'antd';
import JSONEditor from 'jsoneditor';
import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useLocale } from '../../lib/useLocale';
import 'jsoneditor/dist/jsoneditor.min.css';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

export default function Editor({ isLoading, setIsLoading, isOpen, onClose, data, setData, saveData }) {
  const [form] = Form.useForm();
  const [editorContainer, setEditorContainer] = useState(null);
  const [editor, setEditor] = useState(null);
  const [editorMode, setEditorMode] = useState('tree');
  const [tableData_member, setTableDataMember] = useState([]);
  const [tableData_menke, setTableDataMenke] = useState([]);
  const [tableData_qu, setTableDataQu] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [pregnancyModal, setPregnancyModal] = useState({ isOpen: false, record: null, type: null });
  const [maxAllAttributesModal, setMaxAllAttributesModal] = useState({ isOpen: false, type: null });
  const [collapseStates, setCollapseStates] = useState({
    member: true,
    qu: true,
    menke: true
  });
  const [money, setMoney] = useState('');
  const [yuanbao, setYuanbao] = useState('');
  const [isEditingCurrency, setIsEditingCurrency] = useState(false);
  const [tempMoney, setTempMoney] = useState('');
  const [tempYuanbao, setTempYuanbao] = useState('');
  
  // 粮草相关状态
  const [food, setFood] = useState('0');
  const [vegetables, setVegetables] = useState('0');
  const [meat, setMeat] = useState('0');
  const [isEditingFood, setIsEditingFood] = useState(false);
  const [tempFood, setTempFood] = useState('0');
  const [tempVegetables, setTempVegetables] = useState('0');
  const [tempMeat, setTempMeat] = useState('0');
  
  const { locale, t } = useLocale();

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      wen: '',
      wu: '',
      shang: '',
      yi: '',
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const handlePregnancy = (record, type) => {
    setPregnancyModal({ isOpen: true, record, type });
  };

  const confirmPregnancy = () => {
    const { record, type } = pregnancyModal;
    const rawData = JSON.parse(data.data.toString());
    const memberIndex = rawData[type].value.findIndex(member => member[0] === record.id);
    
    if (memberIndex > -1) {
      if (type === 'Member_qu') {
        rawData[type].value[memberIndex][18] = '1';
      } else if (type === 'Member_now') {
        rawData[type].value[memberIndex][25] = '1';
      }
      setData({ ...data, data: Buffer.from(JSON.stringify(rawData))});
    }
    
    setPregnancyModal({ isOpen: false, record: null, type: null });
  };

  const cancelPregnancy = () => {
    setPregnancyModal({ isOpen: false, record: null, type: null });
  };

  const saveCurrency = () => {
    const rawData = JSON.parse(data.data.toString());
    if (!rawData.CGNum) {
      rawData.CGNum = { value: ['0', '0'] };
    }
    rawData.CGNum.value[0] = tempMoney;
    rawData.CGNum.value[1] = tempYuanbao;
    setData({ ...data, data: Buffer.from(JSON.stringify(rawData))});
    
    // 更新显示的值
    setMoney(tempMoney);
    setYuanbao(tempYuanbao);
    setIsEditingCurrency(false);
    
    message.success({
      content: locale === 'zh' ? '货币已保存，不要忘记保存到存档文件！' : 'Currency saved, don\'t forget to save to file!',
      duration: 3
    });
  };

  const editCurrency = () => {
    setTempMoney(money);
    setTempYuanbao(yuanbao);
    setIsEditingCurrency(true);
  };

  // 粮草管理函数
  const saveFood = () => {
    const rawData = JSON.parse(data.data.toString());
    if (!rawData.Prop_have) {
      rawData.Prop_have = { value: [] };
    }
    
    // 更新或插入粮食数据 (类型ID: '2')
    const foodIndex = rawData.Prop_have.value.findIndex(item => item[0] === '2');
    if (foodIndex > -1) {
      rawData.Prop_have.value[foodIndex][1] = tempFood;
    } else {
      rawData.Prop_have.value.push(['2', tempFood]);
    }
    
    // 更新或插入蔬菜数据 (类型ID: '3')
    const vegetablesIndex = rawData.Prop_have.value.findIndex(item => item[0] === '3');
    if (vegetablesIndex > -1) {
      rawData.Prop_have.value[vegetablesIndex][1] = tempVegetables;
    } else {
      rawData.Prop_have.value.push(['3', tempVegetables]);
    }
    
    // 更新或插入肉类数据 (类型ID: '4')
    const meatIndex = rawData.Prop_have.value.findIndex(item => item[0] === '4');
    if (meatIndex > -1) {
      rawData.Prop_have.value[meatIndex][1] = tempMeat;
    } else {
      rawData.Prop_have.value.push(['4', tempMeat]);
    }
    
    setData({ ...data, data: Buffer.from(JSON.stringify(rawData))});
    
    // 更新显示的值
    setFood(tempFood);
    setVegetables(tempVegetables);
    setMeat(tempMeat);
    setIsEditingFood(false);
    
    message.success({
      content: locale === 'zh' ? '粮草已保存，不要忘记保存到存档文件！' : 'Food saved, don\'t forget to save to file!',
      duration: 3
    });
  };

  const editFood = () => {
    setTempFood(food);
    setTempVegetables(vegetables);
    setTempMeat(meat);
    setIsEditingFood(true);
  };

  // 粮草输入处理函数
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

  // 显示全属性升满确认对话框
  const confirmMaxAllAttributes = (type) => {
    setMaxAllAttributesModal({ isOpen: true, type });
  };

  // 取消全属性升满操作
  const cancelMaxAllAttributes = () => {
    setMaxAllAttributesModal({ isOpen: false, type: null });
  };

  // 执行全属性升满操作
  const executeMaxAllAttributes = () => {
    const type = maxAllAttributesModal.type;
    setMaxAllAttributesModal({ isOpen: false, type: null });
    
    const rawData = JSON.parse(data.data.toString());
    
    if (type === 'Member_now') {
      rawData[type].value.forEach((member, index) => {
        // 更新基础属性
        rawData[type].value[index][7] = '100';  // wen
        rawData[type].value[index][8] = '100';  // wu
        rawData[type].value[index][9] = '100';  // shang
        rawData[type].value[index][10] = '100'; // yi
        rawData[type].value[index][27] = '100'; // mou
        rawData[type].value[index][20] = '100'; // beauty
        
        // 更新info字符串中的属性
        const info = rawData[type].value[index][4].split('|');
        info[3] = '100'; // talent_num
        info[7] = '100'; // lucky
        rawData[type].value[index][4] = info.join('|');
      });
    } else if (type === 'Member_qu') {
      rawData[type].value.forEach((member, index) => {
        rawData[type].value[index][6] = '100';  // wen
        rawData[type].value[index][7] = '100';  // wu
        rawData[type].value[index][8] = '100';  // shang
        rawData[type].value[index][9] = '100';  // yi
        rawData[type].value[index][19] = '100'; // mou
        rawData[type].value[index][15] = '100'; // beauty
        
        // 更新info字符串中的属性
        const info = rawData[type].value[index][2].split('|');
        info[3] = '100'; // talent_num
        info[7] = '100'; // lucky
        rawData[type].value[index][2] = info.join('|');
      });
    } else if (type === 'MenKe_Now') {
      rawData[type].value.forEach((member, index) => {
        rawData[type].value[index][4] = '100';  // wen
        rawData[type].value[index][5] = '100';  // wu
        rawData[type].value[index][6] = '100';  // shang
        rawData[type].value[index][7] = '100';  // yi
        rawData[type].value[index][15] = '100'; // mou
      });
    }
    
    setData({ ...data, data: Buffer.from(JSON.stringify(rawData))});
    
    // 重新加载数据到表格
    const member_now = rawData?.Member_now?.value || [];
    const members = member_now.map(fields => {
      const info = fields[4].split('|');
      return {
        gender: info[4],
        name: info[0],
        id: fields[0],
        age: fields[6],
        wen: fields[7],
        wu: fields[8],
        shang: fields[9],
        yi: fields[10],
        mou: fields[27],
        talent: info[2],
        talent_num: info[3],
        skill: info[6] || '0',
        skill_num: fields[33] || '0',
        lucky: info[7],
        beauty: fields[20],
        health: fields[21],
        reputation: fields[16],
      };
    });
    
    const qu_now = rawData?.Member_qu?.value || [];
    const qu = qu_now.map(fields => {
      const info = fields[2].split('|');
      return {
        name: info[0],
        gender: info[4],
        id: fields[0],
        age: fields[5],
        wen: fields[6],
        wu: fields[7],
        shang: fields[8],
        yi: fields[9],
        mou: fields[19],
        talent: info[2],
        talent_num: info[3],
        skill: info[6] || '0',
        skill_num: fields[23],
        lucky: info[7],
        beauty: fields[15],
        health: fields[16],
        reputation: fields[12],
      };
    });
    
    const menke_now = rawData?.MenKe_Now?.value || [];
    const menke = menke_now.map(fields => {
      return {
        name: fields[2].split('|')[0],
        id: fields[0],
        age: fields[3],
        wen: fields[4],
        wu: fields[5],
        shang: fields[6],
        yi: fields[7],
        mou: fields[15],
        payment: fields[18],
        reputation: fields[11],
      };
    });
    
    setTableDataMember(members);
    setTableDataQu(qu);
    setTableDataMenke(menke);
    
    message.success({
      content: locale === 'zh' ? '全属性已升满！不要忘记保存到存档文件！' : 'All attributes maxed! Don\'t forget to save to file!',
      duration: 3
    });
  };

  const setAllAge18 = (type) => {
    const rawData = JSON.parse(data.data.toString());
    
    if (type === 'Member_now') {
      rawData[type].value.forEach((member, index) => {
        const zuzhangInfo = rawData['Member_First'].value[0];
        const zuzhangId = zuzhangInfo[0];
        const ID = rawData[type].value[index][0];
        
        // 设置年龄为18岁
        rawData[type].value[index][6] = '18';
        
        // 如果是族长，同时更新Member_First中的年龄
        if (ID === zuzhangId) {
          rawData['Member_First'].value[0][6] = '18';
        }
      });
    } else if (type === 'Member_qu') {
      rawData[type].value.forEach((member, index) => {
        rawData[type].value[index][5] = '18'; // age字段在Member_qu中是index 5
      });
    } else if (type === 'MenKe_Now') {
      rawData[type].value.forEach((member, index) => {
        rawData[type].value[index][3] = '18'; // age字段在MenKe_Now中是index 3
      });
    }
    
    setData({ ...data, data: Buffer.from(JSON.stringify(rawData))});
    
    // 重新加载数据到表格
    const member_now = rawData?.Member_now?.value || [];
    const members = member_now.map(fields => {
      const info = fields[4].split('|');
      return {
        gender: info[4],
        name: info[0],
        id: fields[0],
        age: fields[6],
        wen: fields[7],
        wu: fields[8],
        shang: fields[9],
        yi: fields[10],
        mou: fields[27],
        talent: info[2],
        talent_num: info[3],
        skill: info[6] || '0',
        skill_num: fields[33] || '0',
        lucky: info[7],
        beauty: fields[20],
        health: fields[21],
        reputation: fields[16],
      };
    });
    
    const qu_now = rawData?.Member_qu?.value || [];
    const qu = qu_now.map(fields => {
      const info = fields[2].split('|');
      return {
        name: info[0],
        gender: info[4],
        id: fields[0],
        age: fields[5],
        wen: fields[6],
        wu: fields[7],
        shang: fields[8],
        yi: fields[9],
        mou: fields[19],
        talent: info[2],
        talent_num: info[3],
        skill: info[6] || '0',
        skill_num: fields[23],
        lucky: info[7],
        beauty: fields[15],
        health: fields[16],
        reputation: fields[12],
      };
    });
    
    const menke_now = rawData?.MenKe_Now?.value || [];
    const menke = menke_now.map(fields => {
      return {
        name: fields[2].split('|')[0],
        id: fields[0],
        age: fields[3],
        wen: fields[4],
        wu: fields[5],
        shang: fields[6],
        yi: fields[7],
        mou: fields[15],
        payment: fields[18],
        reputation: fields[11],
      };
    });
    
    setTableDataMember(members);
    setTableDataQu(qu);
    setTableDataMenke(menke);
    
    message.success({
      content: locale === 'zh' ? '全员年龄已设为18岁！不要忘记保存到存档文件！' : 'All ages set to 18! Don\'t forget to save to file!',
      duration: 3
    });
  };

  const maxAllReputation = (type) => {
    const rawData = JSON.parse(data.data.toString());
    
    if (type === 'Member_now') {
      rawData[type].value.forEach((member, index) => {
        rawData[type].value[index][16] = '100'; // 家族成员声誉
      });
    } else if (type === 'Member_qu') {
      rawData[type].value.forEach((member, index) => {
        rawData[type].value[index][12] = '100'; // 嫁娶成员声誉
      });
    } else if (type === 'MenKe_Now') {
      rawData[type].value.forEach((member, index) => {
        rawData[type].value[index][11] = '100'; // 门客声誉
      });
    }
    
    setData({ ...data, data: Buffer.from(JSON.stringify(rawData))});
    
    // 重新加载数据到表格
    const member_now = rawData?.Member_now?.value || [];
    const members = member_now.map(fields => {
      const info = fields[4].split('|');
      return {
        gender: info[4],
        name: info[0],
        id: fields[0],
        age: fields[6],
        wen: fields[7],
        wu: fields[8],
        shang: fields[9],
        yi: fields[10],
        mou: fields[27],
        talent: info[2],
        talent_num: info[3],
        skill: info[6] || '0',
        skill_num: fields[33] || '0',
        lucky: info[7],
        beauty: fields[20],
        health: fields[21],
        reputation: fields[16],
      };
    });
    
    const qu_now = rawData?.Member_qu?.value || [];
    const qu = qu_now.map(fields => {
      const info = fields[2].split('|');
      return {
        name: info[0],
        gender: info[4],
        id: fields[0],
        age: fields[5],
        wen: fields[6],
        wu: fields[7],
        shang: fields[8],
        yi: fields[9],
        mou: fields[19],
        talent: info[2],
        talent_num: info[3],
        skill: info[6] || '0',
        skill_num: fields[23],
        lucky: info[7],
        beauty: fields[15],
        health: fields[16],
        reputation: fields[12],
      };
    });
    
    const menke_now = rawData?.MenKe_Now?.value || [];
    const menke = menke_now.map(fields => {
      return {
        name: fields[2].split('|')[0],
        id: fields[0],
        age: fields[3],
        wen: fields[4],
        wu: fields[5],
        shang: fields[6],
        yi: fields[7],
        mou: fields[15],
        payment: fields[18],
        reputation: fields[11],
      };
    });
    
    setTableDataMember(members);
    setTableDataQu(qu);
    setTableDataMenke(menke);
    
    message.success({
      content: locale === 'zh' ? '全员声誉已升满！不要忘记保存到存档文件！' : 'All reputation maxed! Don\'t forget to save to file!',
      duration: 3
    });
  };

  const maxSingleMemberAttributes = (record, type) => {
    const rawData = JSON.parse(data.data.toString());
    const memberIndex = rawData[type].value.findIndex(member => member[0] === record.id);
    
    if (memberIndex > -1) {
      if (type === 'Member_now') {
        // 更新基础属性
        rawData[type].value[memberIndex][7] = '100';  // wen
        rawData[type].value[memberIndex][8] = '100';  // wu
        rawData[type].value[memberIndex][9] = '100';  // shang
        rawData[type].value[memberIndex][10] = '100'; // yi
        rawData[type].value[memberIndex][27] = '100'; // mou
        rawData[type].value[memberIndex][20] = '100'; // beauty
        rawData[type].value[memberIndex][21] = '100'; // health
        
        // 更新info字符串中的属性
        const info = rawData[type].value[memberIndex][4].split('|');
        info[3] = '100'; // talent_num
        info[7] = '100'; // lucky
        rawData[type].value[memberIndex][4] = info.join('|');
      } else if (type === 'Member_qu') {
        rawData[type].value[memberIndex][6] = '100';  // wen
        rawData[type].value[memberIndex][7] = '100';  // wu
        rawData[type].value[memberIndex][8] = '100';  // shang
        rawData[type].value[memberIndex][9] = '100';  // yi
        rawData[type].value[memberIndex][19] = '100'; // mou
        rawData[type].value[memberIndex][15] = '100'; // beauty
        rawData[type].value[memberIndex][16] = '100'; // health
        
        // 更新info字符串中的属性
        const info = rawData[type].value[memberIndex][2].split('|');
        info[3] = '100'; // talent_num
        info[7] = '100'; // lucky
        rawData[type].value[memberIndex][2] = info.join('|');
      } else if (type === 'MenKe_Now') {
        rawData[type].value[memberIndex][4] = '100';  // wen
        rawData[type].value[memberIndex][5] = '100';  // wu
        rawData[type].value[memberIndex][6] = '100';  // shang
        rawData[type].value[memberIndex][7] = '100';  // yi
        rawData[type].value[memberIndex][15] = '100'; // mou
      }
      
      setData({ ...data, data: Buffer.from(JSON.stringify(rawData))});
      
      // 重新加载数据到表格
      const member_now = rawData?.Member_now?.value || [];
      const members = member_now.map(fields => {
        const info = fields[4].split('|');
        return {
          gender: info[4],
          name: info[0],
          id: fields[0],
          age: fields[6],
          wen: fields[7],
          wu: fields[8],
          shang: fields[9],
          yi: fields[10],
          mou: fields[27],
          talent: info[2],
          talent_num: info[3],
          skill: info[6] || '0',
          skill_num: fields[33] || '0',
          lucky: info[7],
          beauty: fields[20],
          health: fields[21],
          reputation: fields[16],
        };
      });
      
      const qu_now = rawData?.Member_qu?.value || [];
      const qu = qu_now.map(fields => {
        const info = fields[2].split('|');
        return {
          name: info[0],
          gender: info[4],
          id: fields[0],
          age: fields[5],
          wen: fields[6],
          wu: fields[7],
          shang: fields[8],
          yi: fields[9],
          mou: fields[19],
          talent: info[2],
          talent_num: info[3],
          skill: info[6] || '0',
          skill_num: fields[23],
          lucky: info[7],
          beauty: fields[15],
          health: fields[16],
          reputation: fields[12],
        };
      });
      
      const menke_now = rawData?.MenKe_Now?.value || [];
      const menke = menke_now.map(fields => {
        return {
          name: fields[2].split('|')[0],
          id: fields[0],
          age: fields[3],
          wen: fields[4],
          wu: fields[5],
          shang: fields[6],
          yi: fields[7],
          mou: fields[15],
          payment: fields[18],
          reputation: fields[11],
        };
      });
      
      setTableDataMember(members);
      setTableDataQu(qu);
      setTableDataMenke(menke);
      
      message.success({
        content: locale === 'zh' ? `${record.name} 属性已升满！` : `${record.name} attributes maxed!`,
        duration: 2
      });
    }
  };

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

  const toggleCollapse = (section) => {
    setCollapseStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const save = async (key, type='Member_now') => {
    try {
      const row = await form.validateFields();
      let tableData
      if (type === 'MenKe_Now') {
        tableData = tableData_menke
        const newData = [...tableData];
        const index = newData.findIndex((item) => key === item.id);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setTableDataMenke(newData);
          setEditingKey('');
        }
      } else if (type === 'Member_now') {
        tableData = tableData_member
        const newData = [...tableData];
        const index = newData.findIndex((item) => key === item.id);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setTableDataMember(newData);
          setEditingKey('');
      }
    } else if (type === 'Member_qu') {
      tableData = tableData_qu
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setTableDataQu(newData);
        setEditingKey('');
      }
    }
      
        // 更新原始数据
        const rawData = JSON.parse(data.data.toString());
        const memberIndex = rawData[type].value.findIndex(member => member[0] === key);
        if (memberIndex > -1) {
          if (type === 'MenKe_Now') {
            rawData[type].value[memberIndex][3] = row.age;
            rawData[type].value[memberIndex][4] = row.wen;
            rawData[type].value[memberIndex][5] = row.wu;
            rawData[type].value[memberIndex][6] = row.shang;
            rawData[type].value[memberIndex][7] = row.yi;
            rawData[type].value[memberIndex][15] = row.mou;
            rawData[type].value[memberIndex][18] = row.payment;
            rawData[type].value[memberIndex][11] = row.reputation; // 门客声誉
            setData({ ...data, data: Buffer.from(JSON.stringify(rawData))});
          } else if (type === 'Member_now') {
            const zuzhangInfo = rawData['Member_First'].value[0]
            const zuzhangAge = zuzhangInfo[6]
            const zuzhangId = zuzhangInfo[0]
            const ID = rawData[type].value[memberIndex][0]
            if (ID === zuzhangId) {
              rawData['Member_First'].value[0][6] = row.age
            }
            const info = rawData[type].value[memberIndex][4].split('|')
            info[2] = row.talent;
            info[3] = row.talent_num;
            info[6] = row.skill || '0';
            info[7] = row.lucky;
  
            // const old_name = info[0];
            rawData[type].value[memberIndex][4] = info.join('|');
            rawData[type].value[memberIndex][7] = row.wen;
            rawData[type].value[memberIndex][6] = row.age;
            rawData[type].value[memberIndex][8] = row.wu;
            rawData[type].value[memberIndex][9] = row.shang;
            rawData[type].value[memberIndex][10] = row.yi;
            rawData[type].value[memberIndex][27] = row.mou;
            rawData[type].value[memberIndex][20] = row.beauty;
            rawData[type].value[memberIndex][21] = row.health;
            rawData[type].value[memberIndex][33] = row.skill_num;
            rawData[type].value[memberIndex][16] = row.reputation; // 家族成员声誉
            let newData = JSON.stringify(rawData)
            setData({ ...data, data: Buffer.from(newData)});
            // }
          } else if (type === 'Member_qu') {
            const info = rawData[type].value[memberIndex][2].split('|')
            info[2] = row.talent;
            info[3] = row.talent_num;
            info[6] = row.skill || '0';
            info[7] = row.lucky;
            rawData[type].value[memberIndex][2] = info.join('|');
            rawData[type].value[memberIndex][5] = row.age;
            rawData[type].value[memberIndex][6] = row.wen;
            rawData[type].value[memberIndex][7] = row.wu;
            rawData[type].value[memberIndex][8] = row.shang;
            rawData[type].value[memberIndex][9] = row.yi;
            rawData[type].value[memberIndex][19] = row.mou;
            rawData[type].value[memberIndex][15] = row.beauty;
            rawData[type].value[memberIndex][16] = row.health;
            rawData[type].value[memberIndex][23] = row.skill_num;
            rawData[type].value[memberIndex][12] = row.reputation; // 嫁娶成员声誉
            let newData = JSON.stringify(rawData)
            setData({ ...data, data: Buffer.from(newData)});
          }
        
          
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const EditableCell = useCallback(({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `请输入 ${title}!`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  }, []);

  useEffect(() => {
    // 确保数据存在才进行处理
    if (!data?.data) {
      return;
    }
    
    const rawData = JSON.parse(data.data.toString() || "{}")
    const member_now = rawData?.Member_now?.value || []
    // console.log(rawData, 'tableData')
    const members = member_now.map(fields => {
    const info = fields[4].split('|')
      return {
        gender: info[4],
        name: info[0], // 获取名字
        id: fields[0], // 成员ID
        age: fields[6],
        wen: fields[7],
        wu: fields[8],
        shang: fields[9],
        yi: fields[10],
        mou: fields[27],
        talent: info[2],
        talent_num: info[3],
        skill: info[6] || '0', // 技能，默认为0
        skill_num: fields[33] || '0', // 技能数值，默认为0
        lucky: info[7],
        beauty: fields[20],
        health: fields[21],
        reputation: fields[16],
      };
    });
    const qu_now = rawData?.Member_qu?.value || []
    // console.log(rawData, 'tableData')
    const qu = qu_now.map(fields => {
      // console.log(fields, 'fields')
      const info = fields[2].split('|')
      return {
        name: info[0], // 获取名字
        gender: info[4],
        id: fields[0], // 成员ID
        age: fields[5],
        wen: fields[6],
        wu: fields[7],
        shang: fields[8],
        yi: fields[9],
        mou: fields[19],
        talent: info[2],
        talent_num: info[3],
        skill: info[6] || '0', // 技能，默认为0
        skill_num: fields[23], // 技能数值，默认为0
        lucky: info[7],
        beauty: fields[15],
        health: fields[16],
        reputation: fields[12],
      };
    });
    const menke_now = rawData?.MenKe_Now?.value || []
    // 门客
    const menke = menke_now.map(fields => {
      return {
        name: fields[2].split('|')[0], // 获取名字
        id: fields[0], // 成员ID
        age: fields[3], // 成员ID
        wen: fields[4],
        wu: fields[5],
        shang: fields[6],
        yi: fields[7],
        mou: fields[15],
        payment: fields[18],
        reputation: fields[11],
      };
    });
    // console.log(members, 'members') // TODO: Remove this debug inf
    setTableDataMember(members);
    setTableDataMenke(menke);
    setTableDataQu(qu);

    // 读取金钱和元宝数据
    const cgNum = rawData?.CGNum?.value || [];
    setMoney(cgNum[0] || '0');
    setYuanbao(cgNum[1] || '0');

    // 读取粮草数据
    const propHave = rawData?.Prop_have?.value || [];
    const foodItem = propHave.find(item => item[0] === '2');
    const vegetablesItem = propHave.find(item => item[0] === '3');
    const meatItem = propHave.find(item => item[0] === '4');
    
    setFood(foodItem ? foodItem[1] : '0');
    setVegetables(vegetablesItem ? vegetablesItem[1] : '0');
    setMeat(meatItem ? meatItem[1] : '0');

    return () => {
      setEditor(null);
    };
  }, [data, isLoading, editorMode]); // 移除editorContainer依赖，只依赖数据相关的变量

  useEffect(() => {
  }, [isLoading, editor, editorMode]); // Add editorMode to dependency array

  const editorContainerRef = useCallback(node => {
    if (node)
      setEditorContainer(node);
  }, []);

  const columns_member = useMemo(() => [
    {
      title: locale === 'zh' ? '名字' : 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: false,
    },
    {
      title: t.attributes.age,
      dataIndex: 'age',
      key: 'age',
      editable: true,
    },
    {
      title: t.attributes.literature,
      dataIndex: 'wen',
      key: 'wen',
      editable: true,
    },
    {
      title: t.attributes.martial,
      dataIndex: 'wu',
      key: 'wu',
      editable: true,
    },
    {
      title: t.attributes.commerce,
      dataIndex: 'shang',
      key: 'shang',
      editable: true,
    },
   
    {
      title: t.attributes.art,
      dataIndex: 'yi',
      key: 'yi',
      editable: true,
    },
    {
      title: t.attributes.strategy,
      dataIndex: 'mou',
      key: 'mou',
      editable: true,
    },
    {
      title: t.attributes.reputation,
      dataIndex: 'reputation',
      key: 'reputation',
      editable: true,
    },
    {
      title: t.attributes.luck,
      dataIndex: 'lucky',
      key: 'lucky',
      editable: true,
    },
    {
      title: t.attributes.charm,
      dataIndex: 'beauty',
      key: 'beauty',
      editable: true,
    },
    {
      title: t.attributes.health,
      dataIndex: 'health',
      key: 'health',
      editable: true,
    },
    {
      title: t.attributes.talent,
      dataIndex: 'talent',
      key: 'talent', 
      // editable: true,
      render: (text, record, index) => {
        const talentMap = locale === 'zh' ? {
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
        const talent_dict = locale === 'zh' ? [
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
        return isEditing(record) ? (
          <Form.Item
            name="talent"
            style={{ margin: 0 }}
            // rules={[{ required: true, message: '请选择天赋!' }]}
          >
             <Radio.Group value={text}>
            <Radio value={'1'}>{locale === 'zh' ? '文' : 'Literature'}</Radio>
            <Radio value={'2'}>{locale === 'zh' ? '武' : 'Martial'}</Radio>
            <Radio value={'3'}>{locale === 'zh' ? '商' : 'Commerce'}</Radio>
            <Radio value={'4'}>{locale === 'zh' ? '艺' : 'Art'}</Radio>
          </Radio.Group>
            {/* <Select>
              {talent_dict.map(({key, value, label}) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ))}
            </Select> */}
            {/* {console.log(Object.entries(talentMap))} */}
          </Form.Item>
        ) : (
          talentMap[text] || text
        );
      }
    },
    {
      title: locale === 'zh' ? '天赋数值' : 'Talent Value',
      dataIndex: 'talent_num',
      key: 'talent_num',
      editable: true,
    },
    {
      title: t.attributes.skill,
      dataIndex: 'skill',
      key: 'skill',
      render: (text, record, index) => {
        const skillMap = locale === 'zh' ? {
          '0': '无',
          '2': '医'
        } : {
          '0': 'None',
          '2': 'Medical'
        };
        
        return isEditing(record) ? (
          <Form.Item
            name="skill"
            style={{ margin: 0 }}
          >
            <Radio.Group value={text}>
              <Radio value={'0'}>{locale === 'zh' ? '无' : 'None'}</Radio>
              <Radio value={'2'}>{locale === 'zh' ? '医' : 'Medical'}</Radio>
            </Radio.Group>
          </Form.Item>
        ) : (
          skillMap[text] || text
        );
      }
    },
    {
      title: t.attributes.skillValue,
      dataIndex: 'skill_num',
      key: 'skill_num',
      editable: true,
    },
    {
      title: locale === 'zh' ? '操作' : 'Actions',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.id, 'Member_now')}
              style={{ marginRight: 8 }}
              size="small"
            >
              {t.save}
            </Button>
            <Button onClick={cancel} size="small">
              {t.cancel}
            </Button>
          </span>
        ) : (
          <span>
            <Button disabled={editingKey !== ''} onClick={() => edit(record)} size="small" style={{ marginRight: 8 }}>
              {t.edit}
            </Button>
            <Button 
              size="small" 
              onClick={() => maxSingleMemberAttributes(record, 'Member_now')}
              disabled={editingKey !== ''}
              style={{ marginRight: 8 }}
            >
              {locale === 'zh' ? '升满属性' : 'Max Attributes'}
            </Button>
            {record.age >= 18 && record.age <= 30 && record.gender === '0' && (
              <Button 
                danger 
                size="small" 
                onClick={() => handlePregnancy(record, 'Member_now')}
                disabled={editingKey !== ''}
              >
                {locale === 'zh' ? '立即怀孕' : 'Immediate Pregnancy'}
              </Button>
            )}
          </span>
        );
      },
    },
  ], [locale, t, isEditing, edit, cancel, save, handlePregnancy]);

  const columns_qu = useMemo(() => [
    {
      title: locale === 'zh' ? '名字' : 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: false,
    },
    {
      title: t.attributes.age,
      dataIndex: 'age',
      key: 'age',
      editable: true,
    },
    {
      title: t.attributes.literature,
      dataIndex: 'wen',
      key: 'wen',
      editable: true,
    },
    {
      title: t.attributes.martial,
      dataIndex: 'wu',
      key: 'wu',
      editable: true,
    },
    {
      title: t.attributes.commerce,
      dataIndex: 'shang',
      key: 'shang',
      editable: true,
    },
   
    {
      title: t.attributes.art,
      dataIndex: 'yi',
      key: 'yi',
      editable: true,
    },
    {
      title: t.attributes.strategy,
      dataIndex: 'mou',
      key: 'mou',
      editable: true,
    },
    {
      title: t.attributes.reputation,
      dataIndex: 'reputation',
      key: 'reputation',
      editable: true,
    },
    {
      title: t.attributes.luck,
      dataIndex: 'lucky',
      key: 'lucky',
      editable: true,
    },
    {
      title: t.attributes.charm,
      dataIndex: 'beauty',
      key: 'beauty',
      editable: true,
    },
    {
      title: t.attributes.health,
      dataIndex: 'health',
      key: 'health',
      editable: true,
    },
    {
      title: t.attributes.talent,
      dataIndex: 'talent',
      key: 'talent', 
      // editable: true,
      render: (text, record, index) => {
        const talentMap = locale === 'zh' ? {
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
        const talent_dict = locale === 'zh' ? [
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
        return isEditing(record) ? (
          <Form.Item
            name="talent"
            style={{ margin: 0 }}
            // rules={[{ required: true, message: '请选择天赋!' }]}
          >
             <Radio.Group value={text}>
            <Radio value={'1'}>{locale === 'zh' ? '文' : 'Literature'}</Radio>
            <Radio value={'2'}>{locale === 'zh' ? '武' : 'Martial'}</Radio>
            <Radio value={'3'}>{locale === 'zh' ? '商' : 'Commerce'}</Radio>
            <Radio value={'4'}>{locale === 'zh' ? '艺' : 'Art'}</Radio>
          </Radio.Group>
            {/* <Select>
              {talent_dict.map(({key, value, label}) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ))}
            </Select> */}
            {/* {console.log(Object.entries(talentMap))} */}
          </Form.Item>
        ) : (
          talentMap[text] || text
        );
      }
    },
    {
      title: locale === 'zh' ? '天赋数值' : 'Talent Value',
      dataIndex: 'talent_num',
      key: 'talent_num',
      editable: true,
    },
    {
      title: t.attributes.skill,
      dataIndex: 'skill',
      key: 'skill',
      render: (text, record, index) => {
        const skillMap = locale === 'zh' ? {
          '0': '无',
          '2': '医'
        } : {
          '0': 'None',
          '2': 'Medical'
        };
        
        return isEditing(record) ? (
          <Form.Item
            name="skill"
            style={{ margin: 0 }}
          >
            <Radio.Group value={text}>
              <Radio value={'0'}>{locale === 'zh' ? '无' : 'None'}</Radio>
              <Radio value={'2'}>{locale === 'zh' ? '医' : 'Medical'}</Radio>
            </Radio.Group>
          </Form.Item>
        ) : (
          skillMap[text] || text
        );
      }
    },
    {
      title: t.attributes.skillValue,
      dataIndex: 'skill_num',
      key: 'skill_num',
      editable: true,
    },
    {
      title: locale === 'zh' ? '操作' : 'Actions',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.id, 'Member_qu')}
              style={{ marginRight: 8 }}
              size="small"
            >
              {t.save}
            </Button>
            <Button onClick={cancel} size="small">
              {t.cancel}
            </Button>
          </span>
        ) : (
          <span>
            <Button disabled={editingKey !== ''} onClick={() => edit(record)} size="small" style={{ marginRight: 8 }}>
              {t.edit}
            </Button>
            <Button 
              size="small" 
              onClick={() => maxSingleMemberAttributes(record, 'Member_qu')}
              disabled={editingKey !== ''}
              style={{ marginRight: 8 }}
            >
              {locale === 'zh' ? '升满属性' : 'Max Attributes'}
            </Button>
            {record.age >= 18 && record.age <= 30 && record.gender === '0' && (
              <Button 
                danger 
                size="small" 
                onClick={() => handlePregnancy(record, 'Member_qu')}
                disabled={editingKey !== ''}
              >
                {locale === 'zh' ? '立即怀孕' : 'Immediate Pregnancy'}
              </Button>
            )}
          </span>
        );
      },
    },
  ], [locale, t, isEditing, edit, cancel, save, handlePregnancy]);

  const columns_menke = useMemo(() => [
    {
      title: locale === 'zh' ? '名字' : 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: false,
    },
    {
      title: t.attributes.age,
      dataIndex: 'age',
      key: 'age',
      editable: true,
    },
    {
      title: t.attributes.literature,
      dataIndex: 'wen',
      key: 'wen',
      editable: true,
    },
    {
      title: t.attributes.martial,
      dataIndex: 'wu',
      key: 'wu',
      editable: true,
    },
    {
      title: t.attributes.commerce,
      dataIndex: 'shang',
      key: 'shang',
      editable: true,
    },
  
    {
      title: t.attributes.art,
      dataIndex: 'yi',
      key: 'yi',
      editable: true,
    },
    {
      title: t.attributes.strategy,
      dataIndex: 'mou',
      key: 'mou',
      editable: true,
    },
    {
      title: t.attributes.reputation,
      dataIndex: 'reputation',
      key: 'reputation',
      editable: true,
    },
    {
      title: locale === 'zh' ? '每月薪酬' : 'Monthly Salary',
      dataIndex: 'payment',
      key: 'payment',
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record);
        return !editable && `${locale === 'zh' ? '￥' : '$'}${text}`
      }
    },
    {
      title: locale === 'zh' ? '操作' : 'Actions',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.id, 'MenKe_Now')}
              style={{ marginRight: 8 }}
              size="small"
            >
              {t.save}
            </Button>
            <Button onClick={cancel} size="small">
              {t.cancel}
            </Button>
          </span>
        ) : (
          <span>
            <Button disabled={editingKey !== ''} onClick={() => edit(record)} size="small">
              {t.edit}
            </Button>
          </span>
        );
      },
    },
  ], [locale, t, isEditing, edit, cancel, save]);

  const mergedColumns_member = useMemo(() => columns_member.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  }), [columns_member, isEditing]);

  const mergedColumns_qu = useMemo(() => columns_qu.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  }), [columns_qu, isEditing]);

  const mergedColumns_menke = useMemo(() => columns_menke.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  }), [columns_menke, isEditing]);

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} size='full' mt='20'>
      <ModalOverlay />
      <ModalContent>
        {/* <ModalHeader>Editor</ModalHeader> */}
        <ModalBody mt='5'>
         
            <Box display="flex" flexDirection="column" gap={4}>
              {/* 货币和粮草管理 */}
              <Box display="flex" gap={4}>
                {/* 货币管理 */}
                {useMemo(() => (
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
                          value={isEditingCurrency ? tempMoney : money}
                          onChange={handleMoneyChange}
                          placeholder={locale === 'zh' ? '输入金钱数量' : 'Enter money amount'}
                          style={{ width: '150px' }}
                          disabled={!isEditingCurrency}
                        />
                        <Text fontSize="xs" color="transparent" mt={1}>
                          {/* 占位文本，保持高度一致 */}
                          &nbsp;
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" mb={1}>
                          {locale === 'zh' ? '元宝' : 'Yuanbao'}
                        </Text>
                        <Input
                          value={isEditingCurrency ? tempYuanbao : yuanbao}
                          onChange={handleYuanbaoChange}
                          placeholder={locale === 'zh' ? '输入元宝数量(最大100000000)' : 'Enter yuanbao amount(max 100000000)'}
                          style={{ width: '150px' }}
                          disabled={!isEditingCurrency}
                          max={100000000}
                          type="number"
                        />
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          {locale === 'zh' ? '最多一亿' : 'Max 100 million'}
                        </Text>
                      </Box>
                      <Box mt="25px">
                        {isEditingCurrency ? (
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
                ), [locale, isEditingCurrency, tempMoney, money, tempYuanbao, yuanbao, handleMoneyChange, handleYuanbaoChange, saveCurrency, editCurrency])}

                {/* 粮草管理 */}
                {useMemo(() => (
                  <Box p={4} border="1px" borderColor="gray.200" borderRadius="md" flex="1">
                    <Heading size="sm" mb={3}>
                      {locale === 'zh' ? '粮草管理' : 'Food Management'}
                    </Heading>
                    <Box display="flex" gap={4} alignItems="flex-start">
                      <Box>
                        <Text fontSize="sm" mb={1}>
                          {locale === 'zh' ? '粮食' : 'Food'}
                        </Text>
                        <Input
                          value={isEditingFood ? tempFood : food}
                          onChange={handleFoodChange}
                          placeholder={locale === 'zh' ? '输入粮食数量' : 'Enter food amount'}
                          style={{ width: '120px' }}
                          disabled={!isEditingFood}
                          type="number"
                        />
                        <Text fontSize="xs" color="transparent" mt={1}>
                          &nbsp;
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" mb={1}>
                          {locale === 'zh' ? '蔬菜' : 'Vegetables'}
                        </Text>
                        <Input
                          value={isEditingFood ? tempVegetables : vegetables}
                          onChange={handleVegetablesChange}
                          placeholder={locale === 'zh' ? '输入蔬菜数量' : 'Enter vegetables amount'}
                          style={{ width: '120px' }}
                          disabled={!isEditingFood}
                          type="number"
                        />
                        <Text fontSize="xs" color="transparent" mt={1}>
                          &nbsp;
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" mb={1}>
                          {locale === 'zh' ? '肉类' : 'Meat'}
                        </Text>
                        <Input
                          value={isEditingFood ? tempMeat : meat}
                          onChange={handleMeatChange}
                          placeholder={locale === 'zh' ? '输入肉类数量' : 'Enter meat amount'}
                          style={{ width: '120px' }}
                          disabled={!isEditingFood}
                          type="number"
                        />
                        <Text fontSize="xs" color="transparent" mt={1}>
                          &nbsp;
                        </Text>
                      </Box>
                      <Box mt="25px">
                        {isEditingFood ? (
                          <Button type="primary" onClick={saveFood}>
                            {locale === 'zh' ? '保存粮草' : 'Save Food'}
                          </Button>
                        ) : (
                          <Button onClick={editFood}>
                            {locale === 'zh' ? '编辑粮草' : 'Edit Food'}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ), [locale, isEditingFood, tempFood, food, tempVegetables, vegetables, tempMeat, meat, handleFoodChange, handleVegetablesChange, handleMeatChange, saveFood, editFood])}
              </Box>

              <Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb="3">
                    <Box display="flex" alignItems="center" gap="2">
                      <Button
                        size="small"
                        icon={collapseStates.member ? <UpOutlined /> : <DownOutlined />}
                        onClick={() => toggleCollapse('member')}
                        aria-label="Toggle family members"
                      />
                      <Heading size="md">
                        {t.familyMembers}
                      </Heading>
                    </Box>
                    <Box display="flex" gap="2">
                      <Button 
                        size="small" 
                        onClick={() => maxAllReputation('Member_now')}
                      >
                        {t.maxAllReputation}
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => setAllAge18('Member_now')}
                      >
                        {t.setAllAge18}
                      </Button>
                      <Button 
                        type="primary" 
                        size="small" 
                        onClick={() => confirmMaxAllAttributes('Member_now')}
                      >
                        {locale === 'zh' ? '升满全属性' : 'Max All Attributes'}
                      </Button>
                    </Box>
                  </Box>
                  <Collapse in={collapseStates.member}>
                    <Form form={form} component={false}>
                      <Table
                        components={{
                          body: {
                            cell: EditableCell,
                          },
                        }}
                        dataSource={tableData_member}
                        columns={mergedColumns_member}
                        rowKey="id"
                        bordered
                        size="middle"
                        rowClassName="editable-row"
                        pagination={false}
                        scroll={{ y: 400 }}
                      />
                    </Form>
                  </Collapse>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb="3" mt="4">
                      <Box display="flex" alignItems="center" gap="2">
                        <Button
                          size="small"
                          icon={collapseStates.qu ? <UpOutlined /> : <DownOutlined />}
                          onClick={() => toggleCollapse('qu')}
                          aria-label="Toggle family qu members"
                        />
                        <Heading size="md">
                          {t.familyqu}
                        </Heading>
                      </Box>
                      <Box display="flex" gap="2">
                        <Button 
                          size="small" 
                          onClick={() => maxAllReputation('Member_qu')}
                        >
                          {t.maxAllReputation}
                        </Button>
                        <Button 
                          size="small" 
                          onClick={() => setAllAge18('Member_qu')}
                        >
                          {t.setAllAge18}
                        </Button>
                        <Button 
                          type="primary" 
                          size="small" 
                          onClick={() => confirmMaxAllAttributes('Member_qu')}
                        >
                          {locale === 'zh' ? '升满全属性' : 'Max All Attributes'}
                        </Button>
                      </Box>
                    </Box>
                    <Collapse in={collapseStates.qu}>
                      <Form form={form} component={false}>
                        <Table
                          components={{
                            body: {
                              cell: EditableCell,
                            },
                          }}
                          dataSource={tableData_qu}
                          columns={mergedColumns_qu}
                          rowKey="id"
                          bordered
                          size="middle"
                          rowClassName="editable-row"
                          pagination={false}
                          scroll={{ y: 400 }}
                        />
                      </Form>
                    </Collapse>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb="3">
                <Box display="flex" alignItems="center" gap="2">
                  <Button
                    size="small"
                    icon={collapseStates.menke ? <UpOutlined /> : <DownOutlined />}
                    onClick={() => toggleCollapse('menke')}
                    aria-label="Toggle guests"
                  />
                  <Heading size="md">
                    {t.guests}
                  </Heading>
                </Box>
                <Box display="flex" gap="2">
                  <Button 
                    size="small" 
                    onClick={() => maxAllReputation('MenKe_Now')}
                  >
                    {t.maxAllReputation}
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => setAllAge18('MenKe_Now')}
                  >
                    {t.setAllAge18}
                  </Button>
                  <Button 
                    type="primary" 
                    size="small" 
                    onClick={() => confirmMaxAllAttributes('MenKe_Now')}
                  >
                    {locale === 'zh' ? '升满全属性' : 'Max All Attributes'}
                  </Button>
                </Box>
              </Box>
              <Collapse in={collapseStates.menke}>
                <Form form={form} component={false}>
                  <Table
                    components={{
                      body: {
                        cell: EditableCell,
                      },
                    }}
                    dataSource={tableData_menke}
                    columns={mergedColumns_menke}
                    rowKey="id"
                    bordered
                    size="middle"
                    rowClassName="editable-row"
                    pagination={false}
                    scroll={{ y: 400 }}
                  />
                </Form>
              </Collapse>
          </Box>
    
        </ModalBody>
        <ModalFooter style={{position: 'fixed', top: 0, right: 0}} >
          <Button
            colorScheme='orange'
            isDisabled={isLoading}
            onClick={async () => {
              setIsLoading(true);

              const isSaveSuccess = await saveData();
              setIsLoading(false);

              if (isSaveSuccess)
                onClose();
            }}
          >
            {locale === 'zh' ? '保存到存档文件' : 'Save to File'}
          </Button>
          <Button
            ml='3'
            onClick={() => {
              setData(null);
              onClose();
            }}
            isDisabled={isLoading}
          >
            {locale === 'zh' ? '关闭' : 'Close'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    {/* 立即受孕确认对话框 */}
    <Modal isOpen={pregnancyModal.isOpen} onClose={cancelPregnancy} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {locale === 'zh' ? '立即怀孕确认' : 'Immediate Pregnancy Confirmation'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert status="warning" mb={4}>
            <AlertIcon />
            <Box>
              <AlertTitle>
                {locale === 'zh' ? '警告！' : 'Warning!'}
              </AlertTitle>
              <AlertDescription>
                {locale === 'zh' 
                  ? '请使用前先备份存档，以防造成无法挽回的影响！' 
                  : 'Please backup your save file before use to prevent irreversible effects!'
                }
              </AlertDescription>
            </Box>
          </Alert>
          <Text>
            {locale === 'zh' 
              ? `确定要让 "${pregnancyModal.record?.name}" 立即怀孕吗？` 
              : `Are you sure you want "${pregnancyModal.record?.name}" to become pregnant immediately?`
            }
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button 
            colorScheme="red" 
            mr={3} 
            onClick={confirmPregnancy}
          >
            {locale === 'zh' ? '确认' : 'Confirm'}
          </Button>
          <Button onClick={cancelPregnancy}>
            {locale === 'zh' ? '取消' : 'Cancel'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    {/* 全属性升满确认对话框 */}
    <Modal isOpen={maxAllAttributesModal.isOpen} onClose={cancelMaxAllAttributes} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {locale === 'zh' ? '一键升满全属性确认' : 'Max All Attributes Confirmation'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert status="warning" mb={4}>
            <AlertIcon />
            <Box>
              <AlertDescription>
                {locale === 'zh' 
                  ? '如果列表中有处于流放、被贬、斩首等刑罚的成员，批量操作会自动免除其刑罚' 
                  : 'If the list contains members under punishment such as exile, demotion, or execution, batch operations will automatically remove their punishments'
                }
              </AlertDescription>
            </Box>
          </Alert>
          <Text>
            {locale === 'zh' 
              ? '确定要对当前列表中的所有成员执行升满全属性操作吗？'
              : 'Are you sure you want to max all attributes for all members in the current list?'
            }
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button 
            colorScheme="red" 
            mr={3} 
            onClick={executeMaxAllAttributes}
          >
            {locale === 'zh' ? '确认执行' : 'Confirm'}
          </Button>
          <Button onClick={cancelMaxAllAttributes}>
            {locale === 'zh' ? '取消' : 'Cancel'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
}
